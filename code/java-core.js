/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Java-Übungsterminal, Teil 4: Typprüfung wie javac und Ausführung. Jede Anweisung wird einmal in eine
   JavaScript-Funktion übersetzt und dann ausgeführt. Fehlermeldungen folgen javac, dazu kommt ein deutscher Hinweis. */
(function (G) {
"use strict";
const JV = G.JV;
const {CompileError, JObj, JArr, JBox, JThrow, Halt, isStr, JList, JMap, JView, JSet, JEntry, JBuilder, JRandom, javaDouble, javaFloat,
  LIB, T, C, A, TV, BOX, UNBOX, tname, erase, sigKey, hashes, lib, cmpStr, dblCmp, parse, PRIMS} = JV;
const s$ = v => typeof v === "string" ? v : v.valueOf();
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

const BRK = 1, CNT = 2, RET = 3, YLD = 4;
const BRK0 = {k:BRK, l:null}, CNT0 = {k:CNT, l:null};
const OBJ = C("Object"), STR = C("String");
const WIDEN = {byte:["short", "int", "long", "float", "double"], short:["int", "long", "float", "double"], char:["int", "long", "float", "double"],
  int:["long", "float", "double"], long:["float", "double"], float:["double"], double:[], boolean:[]};
const HIDDEN = new Set(["ImmutableList", "KeySetView", "ValuesView", "EntrySetView", "MapEntry", "ArraysList", "Itr"]);

/* Ergänzungen der Bibliothek, die den Übersetzer brauchen */
class JIter extends JObj { constructor(cls, h, n, r) { super(cls); this.hasNext = h; this.next = n; this.remove = r; } }
lib("Itr", {fq:"java.util.ArrayList$Itr", pkg:"java.util", tparams:["E"], ifaces:["Iterator"]}, {});
lib("Enum", {fq:"java.lang.Enum", pkg:"java.lang", abstract:true, ifaces:["Comparable"]}, {
  "String name()": o => o.f["Enum#name"],
  "int ordinal()": o => o.f["Enum#ordinal"],
  "String toString()": o => o.f["Enum#name"]
});
lib("Record", {fq:"java.lang.Record", pkg:"java.lang", abstract:true}, {});
LIB.Thread.methods.get("sleep")[0].throws = [C("InterruptedException")];
LIB.Object.methods.get("toString")[0].impl = (o, a, rt) => o instanceof JObj ? rt.S(rt.defaultToString(o)) : rt.S(rt.toStr(o));
LIB.Object.methods.get("equals")[0].impl = (o, [x], rt) => o instanceof JObj ? o === x : rt.equals(o, x);
LIB.Object.methods.get("hashCode")[0].impl = (o, a, rt) => o instanceof JObj || o instanceof JArr ? rt.idHash(o) : rt.hash(o);
const OBJ_TOSTRING = LIB.Object.methods.get("toString")[0], OBJ_HASH = LIB.Object.methods.get("hashCode")[0], OBJ_EQUALS = LIB.Object.methods.get("equals")[0];
LIB.InputStream.methods.delete("read");

const isRefT = t => t.k === "c" || t.k === "a" || t.k === "null" || t.k === "v";
const isNumT = t => t.k === "p" && t.n !== "boolean";
const isIntT = t => t.k === "p" && (t.n === "int" || t.n === "long" || t.n === "char" || t.n === "byte" || t.n === "short");
const unb = t => t.k === "c" && UNBOX[t.n] ? T[UNBOX[t.n]] : null;
const boxT = t => C(BOX[t.n]);
const isStrT = t => t.k === "c" && t.n === "String";
const same = (a, b) => tname(a) === tname(b);
const prom = t => t.k === "p" ? t : unb(t) || t;
const unaryProm = t => { const p = prom(t); return (p.n === "byte" || p.n === "short" || p.n === "char") ? T.int : p; };
const binProm = (a, b) => { a = prom(a); b = prom(b); if (a.n === "double" || b.n === "double") return T.double; if (a.n === "float" || b.n === "float") return T.float; if (a.n === "long" || b.n === "long") return T.long; return T.int; };
const numLike = t => isNumT(t) || (!!unb(t) && unb(t).n !== "boolean");
const boolLike = t => (t.k === "p" && t.n === "boolean") || (t.k === "c" && t.n === "Boolean");
const dflt = t => t.k === "p" ? (t.n === "long" ? 0n : t.n === "boolean" ? false : 0) : null;
const d2i = v => v !== v ? 0 : v >= 2147483647 ? 2147483647 : v <= -2147483648 ? -2147483648 : Math.trunc(v) | 0;
const d2l = v => v !== v ? 0n : v >= 9223372036854775807 ? 9223372036854775807n : v <= -9223372036854775808 ? -9223372036854775808n : BigInt(Math.trunc(v));
const intOf = a => a === "long" ? v => Number(BigInt.asIntN(32, v)) : (a === "double" || a === "float") ? d2i : v => v;
function primConv(a, b) {
  if (a === b) return null;
  switch (b) {
    case "int": return a === "long" || a === "double" || a === "float" ? intOf(a) : null;
    case "long": return a === "double" || a === "float" ? d2l : v => BigInt(v);
    case "double": return a === "long" ? v => Number(v) : null;
    case "float": return a === "long" ? v => Math.fround(Number(v)) : (a === "double" || a === "int") ? Math.fround : null;
    case "char": { const f = intOf(a); return v => f(v) & 0xFFFF; }
    case "byte": { const f = intOf(a); return v => (f(v) << 24) >> 24; }
    case "short": { const f = intOf(a); return v => (f(v) << 16) >> 16; }
    case "boolean": return null;
  }
  return null;
}
const strOfPrim = n => n === "char" ? v => String.fromCharCode(v) : n === "double" ? javaDouble : n === "float" ? javaFloat : n === "boolean" ? v => v ? "true" : "false" : v => String(v);

/* Deutsche Hinweise zu den häufigsten Meldungen */
const HINTS = [
  [/^cannot find symbol/, "Diesen Namen kennt Java an dieser Stelle nicht. Prüfe die Schreibweise (Groß- und Kleinschreibung zählt), ob die Variable vorher deklariert wurde und ob ein import fehlt."],
  [/possible lossy conversion from (double|float) to (int|long|short|byte|char)/, "Eine Kommazahl passt nicht ohne Verlust in eine Ganzzahl-Variable. Nimm double als Typ oder wandle bewusst mit einem Cast um, zum Beispiel (int) wert."],
  [/possible lossy conversion/, "Der Wert ist größer als der Zieltyp. Nimm einen größeren Typ oder wandle bewusst mit einem Cast um."],
  [/^incompatible types: String cannot be converted to (int|double|long|float)/, "Ein Text ist keine Zahl. Zum Umwandeln gibt es Integer.parseInt(text) oder Double.parseDouble(text)."],
  [/^incompatible types: (int|double|long|char|boolean) cannot be converted to String/, "Eine Zahl ist kein Text. Mit String.valueOf(wert) oder \"\" + wert wird daraus ein String."],
  [/^incompatible types: int cannot be converted to boolean/, "Eine Bedingung muss true oder false ergeben. Zum Vergleichen schreibst du ==, ein einzelnes = ist eine Zuweisung."],
  [/^incompatible types/, "Der Wert hat einen anderen Datentyp als die Variable oder der Parameter, in die er soll."],
  [/^missing return statement/, "Die Methode verspricht einen Rückgabewert, aber nicht jeder Weg durch die Methode endet mit return."],
  [/might not have been initialized/, "Die Variable hat an dieser Stelle noch keinen Wert. Gib ihr bei der Deklaration einen Startwert, zum Beispiel int summe = 0;."],
  [/^unreachable statement/, "Diese Zeile kann nie ausgeführt werden, weil davor return, break, continue oder throw steht."],
  [/static context/, "Aus einer static-Methode wie main kannst du nur static-Methoden und static-Variablen direkt nutzen. Mache die Methode static oder erzeuge zuerst ein Objekt mit new."],
  [/has private access/, "Das Element ist private und deshalb nur innerhalb seiner Klasse sichtbar. Von außen greifst du über eine Methode zu, zum Beispiel einen Getter."],
  [/cannot be applied to given types|no suitable (method|constructor) found/, "Anzahl oder Datentypen der Argumente passen nicht zu dem, was die Methode oder der Konstruktor erwartet."],
  [/^bad operand types for binary operator '(==|!=)'/, "Diese beiden Werte lassen sich nicht mit == vergleichen. Texte vergleichst du mit equals()."],
  [/^bad operand types/, "Dieser Operator passt nicht zu diesen Datentypen."],
  [/^incomparable types/, "Diese beiden Typen kann Java nicht miteinander vergleichen."],
  [/is already defined/, "Der Name ist in diesem Bereich schon vergeben. Wähle einen anderen Namen oder lass den Datentyp weg, wenn du die vorhandene Variable ändern willst."],
  [/cannot be dereferenced/, "Primitive Werte wie int oder double haben keine Methoden. Methoden gibt es nur bei Objekten wie String."],
  [/^unexpected type/, "Hier ist ein anderer Typ nötig."],
  [/unreported exception/, "Diese Methode kann eine geprüfte Exception auslösen. Fange sie mit try-catch ab oder ergänze throws bei deiner Methode."],
  [/is abstract; cannot be instantiated/, "Von abstrakten Klassen und Interfaces gibt es keine Objekte. Erzeuge ein Objekt einer konkreten Unterklasse."],
  [/does not override abstract method/, "Die Klasse muss alle abstrakten Methoden ihrer Oberklasse oder ihres Interfaces umsetzen."],
  [/weaker access privileges/, "Methoden aus einem Interface sind public. Schreibe public vor die Methode."],
  [/does not override or implement/, "Mit @Override sagst du, dass du eine geerbte Methode überschreibst. Eine solche Methode gibt es in der Oberklasse aber nicht. Prüfe Name und Parameter."],
  [/cannot assign a value to final variable/, "Eine final-Variable bekommt nur einmal einen Wert."],
  [/break outside switch or loop/, "break funktioniert nur in Schleifen und in switch."],
  [/'void' type not allowed here/, "Diese Methode gibt nichts zurück (void). Ihr Ergebnis kann man nicht ausgeben oder speichern."],
  [/integer number too large/, "Die Zahl passt nicht in int (höchstens 2147483647). Für größere Zahlen nimm long und hänge ein L an, zum Beispiel 3000000000L."],
  [/array required, but/, "Eckige Klammern [ ] gehen nur bei Arrays."],
  [/should be declared in a file named/, "Eine public class muss genauso heißen wie ihre Datei."],
  [/^duplicate class/, "Zwei Klassen haben denselben Namen."],
  [/^missing method body/, "Nach den runden Klammern der Methode fehlt der Rumpf in geschweiften Klammern."],
  [/^unexpected return value/, "Eine void-Methode gibt keinen Wert zurück. Lass den Wert hinter return weg oder gib der Methode einen Rückgabetyp."],
  [/missing return value/, "Die Methode muss hier einen Wert zurückgeben, zum Beispiel return ergebnis;."],
  [/has already been caught/, "Ein früherer catch-Block fängt diese Exception schon ab. Spezielle Exceptions gehören vor die allgemeinen."],
  [/is never thrown in body/, "Im try-Block kann diese Exception gar nicht entstehen."],
  [/duplicate case label/, "Jeder case-Wert darf in einem switch nur einmal vorkommen."],
  [/constant expression required/, "Hinter case muss ein fester Wert stehen, keine Variable."],
  [/kann das Übungsterminal nicht ausführen/, ""]
];
function hintFor(e) { if (e.hint !== "") for (const [re, h] of HINTS) if (!e.hint && re.test(e.msg)) return h; return e.hint; }

/* ---------- Laufzeitumgebung pro Programmlauf ---------- */
function makeRT(opts, prog) {
  let seed = (opts.seed >>> 0) || 0x2545F491;
  const rand32 = () => { seed = (seed + 0x6D2B79F5) | 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (t ^ (t >>> 14)) >>> 0; };
  const cache = {Integer:new Map(), Short:new Map(), Byte:new Map(), Long:new Map(), Character:new Map()};
  const TRUE = new JBox("Boolean", true), FALSE = new JBox("Boolean", false);
  const rt = {
    chunks:[], outLen:0, maxOut:opts.maxOut || 100000, stack:[], line:0, steps:0, lim:50000, t0:now(), maxMs:opts.maxMs || 5000,
    input:opts.input || [], inIdx:0, eof:!!opts.eof, stdinClosed:false, sleptMs:0, file:"Main.java", maxDepth:opts.maxDepth || 9000, prog,
    now,
    push(k, s) {
      if (!s) return;
      if (this.outLen + s.length > this.maxOut) {
        s = s.slice(0, Math.max(0, this.maxOut - this.outLen));
        this.outLen = this.maxOut;
        this.add(k, s);
        throw new Halt("outlimit");
      }
      this.outLen += s.length;
      this.add(k, s);
    },
    add(k, s) {
      const last = this.chunks[this.chunks.length - 1];
      if (last && last.k === k) last.s += s; else this.chunks.push({k, s});
      if (opts.onOut) opts.onOut(k, s);
    },
    out(s) { this.push("out", s); },
    err(s) { this.push("err", s); },
    check() { this.lim = this.steps + 50000; if (now() - this.t0 > this.maxMs) throw new Halt("timeout"); },
    S: s => new String(s),
    cls: n => LIB[n],
    defLocale:null,
    libStatic(key, fn) { this._ls = this._ls || {}; if (!(key in this._ls)) this._ls[key] = fn(this); return this._ls[key]; },
    random() { return (rand32() * 2097152 + (rand32() >>> 11)) / 9007199254740992; },
    idHash(o) { if (!o.h) o.h = (rand32() & 0x7fffffff) || 1; return o.h; },
    newRandom(cls) { return new JRandom(cls || LIB.Random, (BigInt(rand32()) << 16n) ^ BigInt(rand32())); },
    sleep(ms) { this.sleptMs += ms; },
    exit(c) { throw new Halt("exit", c); },
    readLine() {
      if (this.stdinClosed) return null;
      if (this.inIdx < this.input.length) { const l = this.input[this.inIdx++]; this.add("in", l + "\n"); return l; }
      if (this.eof) return null;
      throw new Halt("input");
    },
    box(t, v) {
      if (t === "Boolean") return v ? TRUE : FALSE;
      const c = cache[t];
      if (c && (t === "Character" ? v <= 127 : t === "Long" ? (v >= -128n && v <= 127n) : (v >= -128 && v <= 127))) {
        const key = t === "Long" ? Number(v) : v;
        let b = c.get(key);
        if (!b) { b = new JBox(t, v); c.set(key, b); }
        return b;
      }
      return new JBox(t, v);
    },
    primStr(v, p) { return strOfPrim(p)(v); },
    dflt(p) { return dflt(typeof p === "string" ? T[p] : p); },
    arr(et, a) { return new JArr(typeof et === "string" ? T[et] : et, a); },
    strArr(list) { return new JArr(STR, list.map(s => new String(s))); },
    arrKind(a) { return tname(a.et); },
    ex(name, msg) {
      const cls = LIB[name] || this.prog.K.get(name);
      const o = new JObj(cls);
      this.initThrowable(o, msg === undefined ? null : msg, null);
      return new JThrow(o);
    },
    npe(msg) { return this.ex("NullPointerException", msg || null); },
    initThrowable(o, m, cause) { o.f["Throwable#message"] = m === null || m === undefined ? null : m; o.f["Throwable#cause"] = cause || null; o.trace = this.trace(); return o; },
    trace() {
      const st = this.stack, out = [];
      let line = this.line;
      for (let i = st.length - 2; i >= 0; i -= 2) { out.push({m:st[i], line}); line = st[i + 1]; }
      return out;
    },
    frameName(m) { return `${m.cls.fq}.${m.isCtor ? "<init>" : m.clinit ? "<clinit>" : m.name}`; },
    stackText(o, prefix = "") {
      let s = prefix + this.toStr(o) + "\n";
      const fr = o.trace || [];
      const shown = fr.length > 48 ? fr.slice(0, 40) : fr;
      for (const f of shown) s += `\tat ${this.frameName(f.m)}(${this.file}:${f.line})\n`;
      if (shown.length < fr.length) s += `\t... ${fr.length - shown.length} weitere Aufrufe\n`;
      const cause = o.f["Throwable#cause"];
      if (cause && cause !== o) s += this.stackText(cause, "Caused by: ");
      return s;
    },
    lookup(o, sig) {
      const c = o instanceof JObj ? o.cls : isStr(o) ? LIB.String : o instanceof JBox ? LIB[o.t] : LIB.Object;
      return vtOf(c).get(sig);
    },
    call(o, sig, args) {
      const m = this.lookup(o, sig);
      return m.lib ? m.impl(o, args, this) : this.invoke(m, o, args);
    },
    invoke(m, self, args) {
      const L = new Array(m.nSlots);
      let k = 0;
      if (!m.static) L[k++] = self;
      for (let i = 0; i < args.length; i++) L[k++] = args[i];
      const st = this.stack;
      if (st.length > this.maxDepth * 2) throw this.ex("StackOverflowError", null);
      st.push(m, this.line);
      this.line = m.line;
      if (++this.steps > this.lim) this.check();
      try {
        const r = m.body(L);
        return r === undefined ? undefined : r.v;
      } catch (e) { if (e instanceof RangeError) throw this.ex("StackOverflowError", null); throw e; } finally { this.line = st.pop(); st.pop(); }
    },
    defaultToString(o) { return `${o.cls.fq}@${(this.hash(o) >>> 0).toString(16)}`; },
    arrCode(t) { if (t.k === "p") return {int:"I", long:"J", double:"D", float:"F", char:"C", boolean:"Z", byte:"B", short:"S"}[t.n]; if (t.k === "a") return "[" + this.arrCode(t.of); const c = findAny(t.n); return "L" + (c ? c.fq : t.n) + ";"; },
    toStr(v) {
      if (v === null || v === undefined) return "null";
      if (typeof v === "string") return v;
      if (v instanceof String) return v.valueOf();
      if (v instanceof JBox) return strOfPrim(UNBOX[v.t])(v.v);
      if (v instanceof JArr) return "[" + this.arrCode(v.et) + "@" + this.idHash(v).toString(16);
      if (v instanceof JObj) {
        const m = vtOf(v.cls).get("toString()");
        const r = m.lib ? m.impl(v, [], this) : this.invoke(m, v, []);
        return r === null ? "null" : s$(r);
      }
      return String(v);
    },
    hash(v) {
      if (isStr(v)) return hashes.strHash(v);
      if (v instanceof JBox) {
        switch (v.t) {
          case "Long": return hashes.longHash(v.v);
          case "Double": return hashes.doubleHash(v.v);
          case "Float": return hashes.floatHash(v.v);
          case "Boolean": return v.v ? 1231 : 1237;
          default: return v.v;
        }
      }
      if (v instanceof JObj) {
        const m = vtOf(v.cls).get("hashCode()");
        if (m === OBJ_HASH) return this.idHash(v);
        return m.lib ? m.impl(v, [], this) : this.invoke(m, v, []);
      }
      return this.idHash(v);
    },
    equals(a, b) {
      if (isStr(a)) return isStr(b) && s$(a) === s$(b);
      if (a instanceof JBox) return b instanceof JBox && a.t === b.t && (a.t === "Double" || a.t === "Float" ? Object.is(a.v, b.v) || (a.v !== a.v && b.v !== b.v) : a.v === b.v);
      if (a instanceof JObj) {
        const m = vtOf(a.cls).get("equals(Object)");
        if (m === OBJ_EQUALS) return a === b;
        return m.lib ? m.impl(a, [b], this) : this.invoke(m, a, [b]);
      }
      return a === b;
    },
    equalsN(a, b) { return a === null ? b === null : this.equals(a, b); },
    compare(a, b) {
      if (a === null || b === null) throw this.npe();
      if (isStr(a)) { if (!isStr(b)) throw this.cce(b, "java.lang.String"); return cmpStr(a, b); }
      if (a instanceof JBox) {
        if (!(b instanceof JBox) || b.t !== a.t) throw this.cce(b, "java.lang." + a.t);
        if (a.t === "Double" || a.t === "Float") return dblCmp(a.v, b.v);
        if (a.t === "Boolean") return a.v === b.v ? 0 : a.v ? 1 : -1;
        if (a.t === "Character" || a.t === "Short" || a.t === "Byte") return a.v - b.v;
        return a.v < b.v ? -1 : a.v > b.v ? 1 : 0;
      }
      if (a instanceof JObj) {
        if (a.f["Enum#ordinal"] !== undefined && b instanceof JObj && b.cls === a.cls) return a.f["Enum#ordinal"] - b.f["Enum#ordinal"];
        for (const [sig, m] of vtOf(a.cls)) if (m.name === "compareTo" && m.params.length === 1 && !m.lib) return this.invoke(m, a, [b]);
      }
      throw this.cce(a, "java.lang.Comparable");
    },
    className(v) { return v instanceof JObj ? v.cls.fq : isStr(v) ? "java.lang.String" : v instanceof JBox ? "java.lang." + v.t : v instanceof JArr ? "[" + this.arrCode(v.et) : "java.lang.Object"; },
    javaClassName(v) { return this.className(v); },
    cce(v, target) {
      const from = this.className(v), lib = n => n.startsWith("java.");
      const where = n => lib(n) ? "module java.base of loader 'bootstrap'" : "unnamed module of loader 'app'";
      const tail = lib(from) === lib(target) ? `${from} and ${target} are in ${where(from)}` : `${from} is in ${where(from)}; ${target} is in ${where(target)}`;
      return this.ex("ClassCastException", `class ${from} cannot be cast to class ${target} (${tail})`);
    },
    classObj(o) {
      const c = new JObj(LIB.Class);
      const name = this.className(o);
      const info = o instanceof JObj ? o.cls : null;
      c.info = {name, simple:info ? info.name : name.replace(/^.*[.$]/, ""), iface:false};
      return c;
    },
    jsReplacement(by) {
      let out = "";
      const s = s$(by);
      for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch === "\\") { i++; if (i >= s.length) throw this.ex("IllegalArgumentException", "character to be escaped is missing"); out += s[i] === "$" ? "$$" : s[i]; }
        else if (ch === "$") {
          if (/\d/.test(s[i + 1] || "")) out += "$";
          else if (s[i + 1] === "{") { const e = s.indexOf("}", i); out += "$<" + s.slice(i + 2, e) + ">"; i = e; }
          else throw this.ex("IllegalArgumentException", "Illegal group reference");
        } else out += ch;
      }
      return out;
    },
    size(c) { if (c instanceof JList) return c.a.length; if (c instanceof JSet || c instanceof JView) return c.map.size; if (c instanceof JMap) return c.size; return this.call(c, "size()", []); },
    toArray(c) {
      if (c === null) throw this.npe();
      if (c instanceof JList) return c.a.slice();
      if (c instanceof JSet) return c.map.nodes().map(n => n.k);
      if (c instanceof JView) return c.map.nodes().map(n => c.kind === "k" ? n.k : c.kind === "v" ? n.v : new JEntry(LIB.MapEntry, n, c.map));
      if (c instanceof JArr) return c.a.slice();
      const out = [], it = this.iterator(c);
      while (it.hasNext()) out.push(it.next());
      return out;
    },
    contains(c, x) {
      if (c instanceof JSet) return !!c.map.find(x);
      if (c instanceof JView && c.kind === "k") return !!c.map.find(x);
      return this.toArray(c).some(v => x === null ? v === null : this.equals(x, v));
    },
    collStr(c) { return "[" + this.toArray(c).map(x => x === c ? "(this Collection)" : this.toStr(x)).join(", ") + "]"; },
    collEquals(c, o) {
      if (c === o) return true;
      if (c instanceof JList) return o instanceof JList && o.a.length === c.a.length && c.a.every((v, i) => this.equalsN(v, o.a[i]));
      if (!(o instanceof JSet || o instanceof JView) || this.size(o) !== this.size(c)) return false;
      return this.toArray(o).every(x => this.contains(c, x));
    },
    collHash(c) {
      if (c instanceof JList) return c.a.reduce((h, v) => (Math.imul(31, h) + (v === null ? 0 : this.hash(v))) | 0, 1);
      return this.toArray(c).reduce((h, v) => (h + (v === null ? 0 : this.hash(v))) | 0, 0);
    },
    iterator(c) {
      if (c === null) throw this.npe();
      const rt = this, itr = LIB.Itr;
      if (c instanceof JList) {
        let cursor = 0, last = -1, exp = c.mod;
        return new JIter(itr, () => cursor !== c.a.length, () => {
          if (c.mod !== exp) throw rt.ex("ConcurrentModificationException", null);
          const i = cursor;
          if (i >= c.a.length) throw rt.ex("NoSuchElementException", null);
          cursor = i + 1;
          return c.a[last = i];
        }, () => {
          if (last < 0) throw rt.ex("IllegalStateException", null);
          if (c.mod !== exp) throw rt.ex("ConcurrentModificationException", null);
          if (c.ro) throw rt.ex("UnsupportedOperationException", null);
          c.a.splice(last, 1); cursor = last; last = -1; c.mod++; exp = c.mod;
        });
      }
      if (c instanceof JSet || c instanceof JView) {
        const map = c.map, kind = c instanceof JSet ? "k" : c.kind, nodes = map.nodes();
        let i = 0, exp = map.mod, cur = null;
        return new JIter(itr, () => i < nodes.length, () => {
          if (map.mod !== exp) throw rt.ex("ConcurrentModificationException", null);
          if (i >= nodes.length) throw rt.ex("NoSuchElementException", null);
          cur = nodes[i++];
          return kind === "k" ? cur.k : kind === "v" ? cur.v : new JEntry(LIB.MapEntry, cur, map);
        }, () => {
          if (!cur) throw rt.ex("IllegalStateException", null);
          if (map.mod !== exp) throw rt.ex("ConcurrentModificationException", null);
          map.remove(cur.k); cur = null; exp = map.mod;
        });
      }
      if (c instanceof JIter) return c;
      throw this.ex("UnsupportedOperationException", null);
    },
    mapOf(a) {
      const m = new JMap(LIB.HashMap, this, "linked");
      for (let i = 0; i < a.length; i += 2) {
        if (a[i] === null || a[i + 1] === null) throw this.npe();
        if (m.find(a[i])) throw this.ex("IllegalArgumentException", "duplicate key: " + this.toStr(a[i]));
        m.put(a[i], a[i + 1]);
      }
      m.ro = true;
      return m;
    },
    deepStr(a) {
      if (a === null) return "null";
      return "[" + a.a.map(x => x instanceof JArr ? (x.et.k === "p" ? "[" + x.a.map(v => strOfPrim(x.et.n)(v)).join(", ") + "]" : this.deepStr(x)) : this.toStr(x)).join(", ") + "]";
    },
    deepEq(a, b) {
      if (a === b) return true;
      if (a === null || b === null || a.a.length !== b.a.length) return false;
      return a.a.every((x, i) => (x instanceof JArr && b.a[i] instanceof JArr) ? this.deepEq(x, b.a[i]) : this.equalsN(x, b.a[i]));
    },
    isInst(v, t) {
      if (v === null) return false;
      if (t.k === "c") {
        if (t.n === "Object") return true;
        const n = v instanceof JObj ? v.cls.name : isStr(v) ? "String" : v instanceof JBox ? v.t : null;
        if (n === null) return false;
        return isSubAny(n, t.n);
      }
      if (t.k === "a") {
        if (!(v instanceof JArr)) return false;
        if (t.of.k === "p" || v.et.k === "p") return t.of.k === v.et.k && t.of.n === v.et.n;
        return subtypeAny(v.et, t.of);
      }
      return false;
    },
    initClass(c) {
      if (c.inited) return;
      c.inited = true;
      const sup = c.sup && this.prog.K.get(c.sup);
      if (sup) this.initClass(sup);
      for (const f of c.fields.values()) if (f.static) c.statics[f.name] = dflt(f.t);
      if (c.clinitM) this.invoke(c.clinitM, null, []);
    },
    newObj(c, ctor, args) {
      if (!c.inited) this.initClass(c);
      const o = new JObj(c);
      for (const [k, v] of c.defaults) o.f[k] = v;
      this.invoke(ctor, o, args);
      return o;
    },
    newArray(t, sizes, k = 0) {
      const n = sizes[k];
      if (n < 0) throw this.ex("NegativeArraySizeException", String(n));
      if (n > 30000000) throw this.ex("OutOfMemoryError", "Java heap space");
      const et = t.of, a = new Array(n);
      if (k + 1 < sizes.length) for (let i = 0; i < n; i++) a[i] = this.newArray(et, sizes, k + 1);
      else a.fill(dflt(et));
      return new JArr(et, a);
    }
  };
  const ps = (isErr) => { const o = new JObj(LIB.PrintStream); o.isErr = isErr; return o; };
  rt.sysOut = ps(false); rt.sysErr = ps(true); rt.sysIn = new JObj(LIB.InputStream);
  rt.defLocale = JV.mkLocale("en", "US");
  return rt;
}

/* vtables werden pro Klasse einmal gebaut. Bibliotheksklassen kennen nur die Bibliothek, Nutzerklassen das Programm. */
let CURK = null;
const findAny = n => (CURK && CURK.get(n)) || LIB[n];
function isSubAny(a, b) {
  if (a === b || b === "Object") return true;
  const c = findAny(a);
  if (!c) return false;
  if (c.sup && isSubAny(c.sup, b)) return true;
  for (const i of c.ifaces) if (isSubAny(i, b)) return true;
  return false;
}
function subtypeAny(a, b) {
  if (b.k === "c" && b.n === "Object") return true;
  if (a.k === "c" && b.k === "c") return isSubAny(a.n, b.n);
  if (a.k === "a" && b.k === "a") return (a.of.k === "p" || b.of.k === "p") ? (a.of.k === b.of.k && a.of.n === b.of.n) : subtypeAny(a.of, b.of);
  return false;
}
function allIfaces(c, out = new Set()) {
  for (const i of c.ifaces) { const ic = findAny(i); if (ic && !out.has(ic)) { out.add(ic); allIfaces(ic, out); } }
  if (c.sup) { const s = findAny(c.sup); if (s) allIfaces(s, out); }
  return out;
}
function vtOf(c) {
  if (c.vt) return c.vt;
  const vt = new Map();
  const sup = c.sup ? findAny(c.sup) : (c.kind === "interface" ? null : (c.name === "Object" ? null : LIB.Object));
  if (sup) for (const [k, m] of vtOf(sup)) vt.set(k, m);
  else if (c.name !== "Object") for (const [k, m] of vtOf(LIB.Object)) vt.set(k, m);
  for (const ic of allIfaces(c)) for (const ms of ic.methods.values()) for (const m of ms) if (!m.static && (!vt.has(m.sig) || (vt.get(m.sig).abstract && !m.abstract) || vt.get(m.sig).cls === LIB.Object && false)) { if (!vt.has(m.sig) || (vt.get(m.sig).abstract && !m.abstract)) vt.set(m.sig, m); }
  for (const ms of c.methods.values()) for (const m of ms) if (!m.static && !m.priv) vt.set(m.sig, m);
  c.vt = vt;
  return vt;
}

/* ---------- Übersetzer ---------- */
class Scope { constructor(up) { this.up = up; this.v = new Map(); } get(n) { for (let s = this; s; s = s.up) { const x = s.v.get(n); if (x) return x; } return null; } }
const E = (msg, pos, extra = [], hint = "") => new CompileError(msg, pos, {extra, hint});

function compileProgram(src, rt, opts) {
  const errors = [];
  const K = new Map();
  const prog = {K, errors, main:null, file:"Main.java", cls:null};
  rt.prog = prog;
  CURK = K;
  let unit;
  try { unit = parse(src); }
  catch (e) { if (e instanceof CompileError) { errors.push(e); return prog; } throw e; }

  /* Imports */
  const PKGS = new Set(["java.lang", "java.util", "java.io", "java.util.regex", "java.time", "java.math", "java.util.function", "java.nio.file", "java.text"]);
  const imp = {exact:new Set(), star:new Set(["java.lang"]), all:unit.loose.length > 0, staticCls:[]};
  for (const im of unit.imports) {
    const parts = im.name.split(".");
    if (im.st) {
      const clsName = im.star ? parts.pop() : (parts.pop(), parts.pop());
      const c = LIB[clsName];
      if (!c) { errors.push(E("cannot find symbol", im.p, [`  symbol:   class ${clsName}`])); continue; }
      imp.staticCls.push({c, member:im.star ? null : im.name.split(".").pop()});
      continue;
    }
    if (im.star) {
      if (!PKGS.has(im.name) && !LIB[parts[parts.length - 1]]) errors.push(E(`package ${im.name} does not exist`, src.indexOf(im.name, im.p)));
      else imp.star.add(im.name);
      continue;
    }
    const last = parts[parts.length - 1], pkg = parts.slice(0, -1).join(".");
    let c = LIB[last];
    if (pkg === "java.util.Map" && last === "Entry") { imp.exact.add("Map.Entry"); continue; }
    if (!c || c.pkg !== pkg || HIDDEN.has(last)) {
      const dot = src.lastIndexOf(".", src.indexOf(";", im.p));
      if (!PKGS.has(pkg)) errors.push(E(`package ${pkg} does not exist`, src.lastIndexOf(".", dot - 1) >= im.p ? dot : im.p));
      else errors.push(E("cannot find symbol", dot, [`  symbol:   class ${last}`, `  location: package ${pkg}`], "Diese Klasse gibt es in dem Paket nicht. Prüfe die Schreibweise."));
      continue;
    }
    imp.exact.add(c.name);
  }
  const visible = c => c.pkg === "java.lang" || imp.all || imp.exact.has(c.name) || imp.star.has(c.pkg);

  /* Klassen anmelden */
  const decls = [];
  function declare(d, outer) {
    if (K.has(d.name)) { errors.push(E(`duplicate class: ${d.name}`, d.p)); return; }
    const c = new JV.ClassInfo(d.name, {kind:d.kind, fq:outer ? outer.fq + "$" + d.name : d.name});
    c.decl = d; c.outer = outer; c.top = outer ? outer.top : c;
    c.inner = !!outer && !d.mods.static && d.kind === "class" && outer.kind !== "interface" && !outer.implicitCls;
    c.abstract = !!d.mods.abstract || d.kind === "interface";
    c.final = !!d.mods.final || d.kind === "enum" || d.kind === "record";
    c.inited = false;
    K.set(d.name, c);
    if (outer) outer.nested.set(d.name, c);
    decls.push(c);
    for (const m of d.members) if (m.k === "class") declare(m, c);
  }
  let implicitCls = null;
  if (unit.loose.length) {
    const d = {k:"class", kind:"class", name:"Main", mods:{final:true, anns:[]}, p:unit.loose[0].p, start:unit.loose[0].start, ext:null, impls:[], members:unit.loose.concat(unit.types.map(t => Object.assign(t, {nested:true}))), enumConsts:[], end:src.length};
    declare(d, null);
    implicitCls = K.get("Main");
    implicitCls.implicitCls = true;
  } else for (const d of unit.types) declare(d, null);
  const publics = unit.types.filter(d => d.mods.public);
  if (publics.length) {
    prog.file = publics[0].name + ".java";
    for (const d of publics.slice(1)) errors.push(E(`class ${d.name} is public, should be declared in a file named ${d.name}.java`, d.kp));
  }
  rt.file = prog.file;

  const findCls = n => K.get(n) || LIB[n];
  const isSubCls = (a, b) => isSubAny(a, b);
  function subtype(a, b) {
    if (a.k === "err" || b.k === "err") return true;
    if (a.k === "null") return isRefT(b);
    if (b.k === "v") return a.k !== "p";
    if (a.k === "v") return b.k === "c" && b.n === "Object" || b.k === "v";
    if (a.k === "a") {
      if (b.k === "c") return b.n === "Object";
      if (b.k !== "a") return false;
      if (a.of.k === "p" || b.of.k === "p") return a.of.k === "p" && b.of.k === "p" && a.of.n === b.of.n;
      return subtype(a.of, b.of);
    }
    if (a.k === "c" && b.k === "c") {
      if (!isSubCls(a.n, b.n)) return false;
      if (a.args && b.args && a.args.length && a.args.length === b.args.length && b.n !== "Object") return a.args.every((x, i) => same(x, b.args[i]) || x.k === "v" || b.args[i].k === "v");
      return true;
    }
    return false;
  }
  function conv(from, to, mode) {
    if (from.k === "err" || to.k === "err") return true;
    if (from.k === "void" || to.k === "void") return false;
    if (from.k === "p" && to.k === "p") return from.n === to.n || WIDEN[from.n].includes(to.n);
    if (from.k !== "p" && to.k !== "p") return subtype(from, to);
    if (mode === "strict") return false;
    if (from.k === "p") return subtype(boxT(from), to);
    const u = unb(from);
    return !!u && (u.n === to.n || WIDEN[u.n].includes(to.n));
  }
  function lub(a, b) {
    if (subtype(a, b)) return b;
    if (subtype(b, a)) return a;
    if (a.k === "c" && b.k === "c") { for (let c = findCls(a.n); c && c.sup; c = findCls(c.sup)) if (isSubCls(b.n, c.sup)) return C(c.sup); }
    return OBJ;
  }
  function castable(from, to) {
    if (from.k === "err" || to.k === "err") return true;
    if (from.k === "p" && to.k === "p") return (from.n === "boolean") === (to.n === "boolean");
    if (from.k === "p") return subtype(boxT(from), to);
    if (to.k === "p") { const u = unb(from); if (u) return u.n === to.n || WIDEN[u.n].includes(to.n); return from.k === "c" && ["Object", "Number", "Comparable"].includes(from.n) || from.k === "v"; }
    if (from.k === "null") return true;
    if (subtype(from, to) || subtype(to, from)) return true;
    if (from.k === "c" && to.k === "c") {
      const a = findCls(from.n), b = findCls(to.n);
      if (a && b && (a.kind === "interface" && !b.final || b.kind === "interface" && !a.final)) return true;
    }
    if (from.k === "a" && to.k === "a" && from.of.k !== "p" && to.of.k !== "p") return castable(from.of, to.of);
    return false;
  }

  function classByName(name, cls, pos) {
    if (name.includes(".")) {
      const parts = name.split(".");
      let c = K.get(parts[0]);
      if (c) { for (const p of parts.slice(1)) { c = c && c.nested.get(p); } if (c) return c; }
      if (name === "Map.Entry") { if (visible(LIB.Map)) return LIB["Map.Entry"]; }
      const last = parts[parts.length - 1], pkg = parts.slice(0, -1).join(".");
      if (pkg === "java.util.Map" && last === "Entry") return LIB["Map.Entry"];
      const l = LIB[last];
      if (l && l.pkg === pkg && !HIDDEN.has(last)) return l;
      if (PKGS.has(pkg)) throw E("cannot find symbol", pos, [`  symbol:   class ${last}`, `  location: package ${pkg}`]);
      throw E(`package ${pkg} does not exist`, pos);
    }
    for (let c = cls; c; c = c.outer) { const nc = c.nested.get(name); if (nc) return nc; }
    const u = K.get(name);
    if (u) return u;
    if (name === "Entry" && imp.exact.has("Map.Entry")) return LIB["Map.Entry"];
    const l = LIB[name];
    if (l && !HIDDEN.has(name)) {
      if (visible(l)) return l;
      throw E("cannot find symbol", pos, [`  symbol:   class ${name}`, `  location: class ${cls ? cls.name : "Main"}`], `Die Klasse ${name} liegt im Paket ${l.pkg} und muss importiert werden. Schreibe ganz oben in die Datei: import ${l.fq.replace(/\$.*$/, "")};`);
    }
    throw E("cannot find symbol", pos, [`  symbol:   class ${name}`, `  location: class ${cls ? cls.name : "Main"}`]);
  }
  function resolveType(n, cls, o = {}) {
    if (n.name === "void") { if (!o.allowVoid) throw E("'void' type not allowed here", n.p); return T.void; }
    if (n.name === "var") throw E("'var' is not allowed here", n.p);
    let t;
    if (PRIMS.has(n.name)) { if (n.args) throw E("unexpected type", n.p); t = T[n.name]; }
    else {
      const c = classByName(n.name, cls, n.p);
      let args = null;
      if (n.args) {
        if (!n.args.length) { if (!o.diamond) throw E("illegal start of type", n.p); args = []; }
        else {
          args = n.args.map(a => {
            const at = resolveType(a, cls);
            if (at.k === "p") throw E("unexpected type", a.p, ["  required: reference", `  found:    ${at.n}`], `In spitzen Klammern stehen nur Klassen, keine primitiven Typen. Schreibe ${BOX[at.n]} statt ${at.n}.`);
            return at;
          });
          if (!c.tparams.length) throw E(`type ${c.name} does not take parameters`, n.p);
          if (args.length !== c.tparams.length) throw E("wrong number of type arguments; required " + c.tparams.length, n.p);
        }
      }
      t = C(c.name, args);
    }
    for (let i = 0; i < n.dims; i++) t = A(t);
    return t;
  }

  /* Felder, Methoden und Konstruktoren der Nutzerklassen anlegen */
  const levels = {private:0, package:1, protected:2, public:3};
  const accessOf = mods => mods.public ? 3 : mods.protected ? 2 : mods.private ? 0 : 1;
  function userMethod(c, d, isCtor) {
    const m = {name:isCtor ? "<init>" : d.name, cls:c, decl:d, isCtor, lib:false, static:!isCtor && !!d.mods.static, priv:!!d.mods.private,
      abstract:false, final:!!d.mods.final, params:[], pnames:[], varargs:false, ret:T.void, throws:[], line:0, access:accessOf(d.mods), body:null, nSlots:0};
    if (c.kind === "interface" && !isCtor) {
      m.access = d.mods.private ? 0 : 3;
      if (!d.body && !d.mods.static && !d.mods.default && !d.mods.private) m.abstract = true;
    } else if (d.mods.abstract) m.abstract = true;
    m.line = lineOf(d.p);
    try {
      if (!isCtor) m.ret = resolveType(d.ret, c, {allowVoid:true});
      for (const p of d.params || []) { m.params.push(resolveType(p.type, c)); m.pnames.push(p.name); if (p.varargs) m.varargs = true; }
      m.throws = (d.throws || []).map(t => resolveType(t, c));
    } catch (e) { if (e instanceof CompileError) { errors.push(e); m.ret = m.ret || T.err; m.params = m.params.concat((d.params || []).slice(m.params.length).map(() => T.err)); } else throw e; }
    m.sig = sigKey(m.name, m.params);
    return m;
  }
  for (const c of decls) {
    const d = c.decl;
    try {
      if (d.ext) {
        const st = resolveType(d.ext, c.outer || c);
        const sc = findCls(st.n);
        if (sc.kind === "interface") errors.push(E("no interface expected here", d.ext.p));
        else if (sc.final) errors.push(E(`cannot inherit from final ${sc.name}`, d.ext.p));
        else if (sc.lib && !isSubCls(sc.name, "Throwable") && sc.name !== "Object") errors.push(E(`Erben von ${sc.name} kann das Übungsterminal nicht ausführen`, d.ext.p));
        else c.sup = sc.name;
        if (c.sup && isSubCls(c.sup, c.name)) { errors.push(E(`cyclic inheritance involving ${c.name}`, d.ext.p)); c.sup = "Object"; }
      } else c.sup = c.kind === "interface" ? null : c.kind === "enum" ? "Enum" : c.kind === "record" ? "Record" : "Object";
      for (const it of d.impls) {
        const t = resolveType(it, c.outer || c);
        const ic = findCls(t.n);
        if (ic.kind !== "interface") errors.push(E("interface expected here", it.p));
        else { c.ifaces.push(ic.name); if (t.args) (c.ifaceArgs = c.ifaceArgs || {})[ic.name] = t.args; }
      }
    } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
  }
  function lineOf(p) { let l = 1; for (let i = 0; i < p && i < src.length; i++) if (src.charCodeAt(i) === 10) l++; return l; }
  const lineStarts = [0];
  for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) lineStarts.push(i + 1);
  const lineAt = p => { let lo = 0, hi = lineStarts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= p) lo = mid; else hi = mid - 1; } return lo + 1; };

  for (const c of decls) {
    const d = c.decl;
    if (c.kind === "record") {
      for (const comp of d.comps) {
        try {
          const t = resolveType(comp.type, c);
          c.fields.set(comp.name, {name:comp.name, t, static:false, final:true, priv:true, cls:c, key:c.fq + "#" + comp.name, comp:true});
        } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
      }
    }
    if (c.kind === "enum") {
      d.enumConsts.forEach((ec, i) => {
        if (c.fields.has(ec.name)) errors.push(E(`variable ${ec.name} is already defined in enum ${c.name}`, ec.p));
        c.fields.set(ec.name, {name:ec.name, t:C(c.name), static:true, final:true, priv:false, cls:c, key:ec.name, enumConst:ec, ordinal:i});
      });
    }
    for (const mb of d.members) {
      if (mb.k === "field") {
        for (const v of mb.vars) {
          try {
            let t = resolveType(mb.type, c);
            for (let i = 0; i < v.dims; i++) t = A(t);
            if (c.fields.has(v.name)) { errors.push(E(`variable ${v.name} is already defined in class ${c.name}`, v.p)); continue; }
            const iface = c.kind === "interface";
            c.fields.set(v.name, {name:v.name, t, static:iface || !!mb.mods.static, final:iface || !!mb.mods.final, priv:!!mb.mods.private, cls:c, key:(iface || mb.mods.static) ? v.name : c.fq + "#" + v.name, decl:v, fieldDecl:mb});
            if (iface && !v.init) errors.push(E("= expected", v.p));
          } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
        }
      } else if (mb.k === "method") {
        const m = userMethod(c, mb, false);
        if (!mb.body && !m.abstract && !mb.mods.native) errors.push(E("missing method body, or declare abstract", mb.p));
        if (mb.body && m.abstract) errors.push(E(c.kind === "interface" ? "interface abstract methods cannot have body" : "abstract methods cannot have a body", mb.p));
        if (m.abstract && !c.abstract) errors.push(E(`${c.name} is not abstract and does not override abstract method ${m.name}(${m.params.map(tname).join(",")}) in ${c.name}`, d.start));
        const list = c.methods.get(m.name) || [];
        if (list.some(o => o.sig === m.sig)) errors.push(E(`method ${m.name}(${m.params.map(tname).join(",")}) is already defined in ${c.kind} ${c.name}`, mb.p));
        list.push(m);
        c.methods.set(m.name, list);
      } else if (mb.k === "ctor") {
        if (c.kind === "interface") { errors.push(E("<identifier> expected", mb.p)); continue; }
        const m = userMethod(c, mb, true);
        if (mb.compact) { m.params = [...c.fields.values()].filter(f => f.comp).map(f => f.t); m.pnames = [...c.fields.values()].filter(f => f.comp).map(f => f.name); m.sig = sigKey("<init>", m.params); m.compact = true; }
        if (c.kind === "enum") m.priv = true;
        if (c.ctors.some(o => o.sig === m.sig)) errors.push(E(`constructor ${c.name}(${m.params.map(tname).join(",")}) is already defined in class ${c.name}`, mb.p));
        c.ctors.push(m);
      }
    }
    if (c.kind !== "interface" && !c.ctors.length) {
      const m = {name:"<init>", cls:c, decl:null, isCtor:true, lib:false, static:false, priv:c.kind === "enum", abstract:false, params:[], pnames:[], varargs:false, ret:T.void, throws:[], line:lineOf(d.p), access:d.mods.public ? 3 : 1, body:null, nSlots:1, dflt:true};
      if (c.kind === "record") { const comps = [...c.fields.values()].filter(f => f.comp); m.params = comps.map(f => f.t); m.pnames = comps.map(f => f.name); m.canonical = true; }
      m.sig = sigKey("<init>", m.params);
      c.ctors.push(m);
    }
    if (c.kind === "record") {
      const comps = [...c.fields.values()].filter(f => f.comp);
      if (!c.ctors.some(m => m.params.length === comps.length && m.params.every((p, i) => same(p, comps[i].t)))) {
        const m = {name:"<init>", cls:c, decl:null, isCtor:true, lib:false, static:false, priv:false, abstract:false, params:comps.map(f => f.t), pnames:comps.map(f => f.name), varargs:false, ret:T.void, throws:[], line:lineOf(d.p), access:3, body:null, nSlots:1, canonical:true};
        m.sig = sigKey("<init>", m.params);
        c.ctors.push(m);
      }
      for (const f of comps) if (!(c.methods.get(f.name) || []).some(m => !m.params.length)) {
        c.methods.set(f.name, (c.methods.get(f.name) || []).concat([{name:f.name, cls:c, lib:true, static:false, params:[], ret:f.t, sig:f.name + "()", access:3, impl:o => o.f[f.key], throws:[]}]));
      }
      const synth = (sig, ret, params, impl) => { const name = sig.slice(0, sig.indexOf("(")); if (!(c.methods.get(name) || []).some(m => m.sig === sig)) c.methods.set(name, (c.methods.get(name) || []).concat([{name, cls:c, lib:true, static:false, params, ret, sig, access:3, impl, throws:[]}])); };
      synth("toString()", STR, [], (o, a, rt) => rt.S(`${c.name}[${comps.map(f => f.name + "=" + (f.t.k === "p" ? strOfPrim(f.t.n)(o.f[f.key]) : rt.toStr(o.f[f.key]))).join(", ")}]`));
      synth("equals(Object)", T.boolean, [OBJ], (o, [x], rt) => x instanceof JObj && x.cls === o.cls && comps.every(f => f.t.k === "p" ? (f.t.n === "double" || f.t.n === "float" ? dblCmp(o.f[f.key], x.f[f.key]) === 0 : o.f[f.key] === x.f[f.key]) : rt.equalsN(o.f[f.key], x.f[f.key])));
      synth("hashCode()", T.int, [], (o, a, rt) => comps.reduce((h, f) => { const v = o.f[f.key]; const hv = f.t.k === "p" ? rt.hash(rt.box(BOX[f.t.n], v)) : v === null ? 0 : rt.hash(v); return (Math.imul(31, h) + hv) | 0; }, 0));
    }
    if (c.kind === "enum") {
      const ct = C(c.name);
      c.methods.set("values", [{name:"values", cls:c, lib:true, static:true, params:[], ret:A(ct), sig:"values()", access:3, impl:(n, a, rt) => { if (!c.inited) rt.initClass(c); return new JArr(ct, c.enumValues.slice()); }, throws:[]}]);
      c.methods.set("valueOf", [{name:"valueOf", cls:c, lib:true, static:true, params:[STR], ret:ct, sig:"valueOf(String)", access:3, impl:(n, [s], rt) => {
        if (!c.inited) rt.initClass(c);
        if (s === null) throw rt.ex("NullPointerException", "Name is null");
        const v = c.enumValues.find(e => e.f["Enum#name"] === s$(s));
        if (!v) throw rt.ex("IllegalArgumentException", `No enum constant ${c.fq.replace(/\$/g, ".")}.${s$(s)}`);
        return v;
      }, throws:[]}]);
      c.methods.set("compareTo", (c.methods.get("compareTo") || []).concat([{name:"compareTo", cls:c, lib:true, static:false, params:[ct], ret:T.int, sig:`compareTo(${c.name})`, access:3, impl:(o, [x], rt) => { if (x === null) throw rt.npe(); return o.f["Enum#ordinal"] - x.f["Enum#ordinal"]; }, throws:[]}]));
    }
  }
  /* vtables und Prüfungen der Vererbung */
  for (const c of decls) vtOf(c);
  for (const c of decls) {
    const d = c.decl;
    if (!c.abstract) {
      for (const m of vtOf(c).values()) if (m.abstract) {
        errors.push(E(`${c.name} is not abstract and does not override abstract method ${m.name}(${m.params.map(tname).join(",")}) in ${m.cls.name}`, d.start));
        break;
      }
    }
    for (const ms of c.methods.values()) for (const m of ms) {
      if (m.lib || m.static) continue;
      const supers = [];
      if (c.sup) { const s = findCls(c.sup); const o = vtOf(s).get(m.sig); if (o) supers.push(o); }
      for (const ic of allIfaces(c)) for (const o of ic.methods.get(m.name) || []) if (o.sig === m.sig && !o.static) supers.push(o);
      if (c.kind === "interface") { const o = vtOf(LIB.Object).get(m.sig); if (o) supers.push(o); }
      const over = m.decl && m.decl.mods.anns.find(a => a.name === "Override");
      if (over && !supers.length) errors.push(E("method does not override or implement a method from a supertype", over.p));
      for (const o of supers) {
        if (o === m) continue;
        const oAcc = o.lib ? 3 : o.access;
        if (m.access < oAcc && !m.priv) {
          const verb = o.cls.kind === "interface" && c.kind !== "interface" ? "implement" : "override";
          const was = ["private", "package", "protected", "public"][oAcc];
          errors.push(E(`${m.name}(${m.params.map(tname).join(",")}) in ${c.name} cannot ${verb} ${o.name}(${o.params.map(tname).join(",")}) in ${o.cls.name}`, m.decl.p, [`  attempting to assign weaker access privileges; was ${was}`]));
          break;
        }
        if (o.ret && m.ret && o.ret.k !== "err" && m.ret.k !== "err" && !(same(o.ret, m.ret) || (isRefT(m.ret) && isRefT(o.ret) && subtype(m.ret, o.ret)) || o.ret.k === "v")) {
          errors.push(E(`${m.name}(${m.params.map(tname).join(",")}) in ${c.name} cannot ${o.cls.kind === "interface" ? "implement" : "override"} ${o.name}(${o.params.map(tname).join(",")}) in ${o.cls.name}`, m.decl.p, [`  return type ${tname(m.ret)} is not compatible with ${tname(o.ret)}`]));
          break;
        }
      }
    }
    c.defaults = [];
    for (let k = c; k && !k.lib; k = findCls(k.sup)) for (const f of k.fields.values()) if (!f.static) c.defaults.push([f.key, dflt(f.t)]);
  }

  /* ---------- Hilfen für Ausdrücke ---------- */
  const K_ = (t, v) => ({t, f:() => v, c:v});
  function newCtx(cls, m, isStatic, kind) {
    return {cls, m, st:isStatic, scope:new Scope(null), next:isStatic ? 0 : 1, max:isStatic ? 0 : 1, da:new Set(), targets:[], handlers:[],
      throws:m ? m.throws || [] : [], ret:m && !m.isCtor ? m.ret : T.void, kind:kind || (m && m.isCtor ? "ctor" : "method"), pendingLabel:null, swx:null, finalFields:null};
  }
  function declareVar(cx, name, t, final, pos) {
    if (cx.scope.get(name)) throw E(`variable ${name} is already defined in ${methodDesc(cx)}`, pos);
    const v = {name, t, slot:cx.next++, final:!!final, cv:undefined};
    cx.max = Math.max(cx.max, cx.next);
    cx.scope.v.set(name, v);
    return v;
  }
  function methodDesc(cx) {
    const m = cx.m;
    if (!m || cx.kind === "init") return cx.st ? "static initializer" : "instance initializer";
    if (m.isCtor) return `constructor ${m.cls.name}(${m.params.map(tname).join(",")})`;
    return `method ${m.name}(${m.params.map(tname).join(",")})`;
  }
  const locOf = cx => `${cx.cls.kind === "interface" ? "interface" : "class"} ${cx.cls.name}`;
  const daCopy = d => d === null ? null : new Set(d);
  const daMeet = (a, b) => a === null ? daCopy(b) : b === null ? daCopy(a) : new Set([...a].filter(x => b.has(x)));
  const daHas = (d, v) => d === null || d.has(v);
  function convF(from, to, node) {
    const why = node ? because(node) : "";
    if (from.k === "err" || to.k === "err" || to.k === "void") return null;
    if (from.k === "p" && to.k === "p") return primConv(from.n, to.n);
    if (from.k === "p") {
      const target = to.k === "c" && UNBOX[to.n] ? to.n : BOX[from.n];
      const pre = UNBOX[target] !== from.n ? primConv(from.n, UNBOX[target]) : null;
      return pre ? v => rt.box(target, pre(v)) : v => rt.box(target, v);
    }
    if (to.k === "p") {
      const u = unb(from);
      const w = u ? primConv(u.n, to.n) : null;
      if (!u) {
        const boxName = BOX[to.n];
        return v => { if (v === null) throw rt.npe(); if (!(v instanceof JBox) || v.t !== boxName) throw rt.cce(v, "java.lang." + boxName); return v.v; };
      }
      return w ? v => { if (v === null) throw rt.npe(`Cannot invoke "java.lang.${from.n}.${u.n}Value()" ${why}`); return w(v.v); }
        : v => { if (v === null) throw rt.npe(`Cannot invoke "java.lang.${from.n}.${u.n}Value()" ${why}`); return v.v; };
    }
    return null;
  }
  const apply = (f, g) => g ? L => g(f(L)) : f;
  function assignConv(r, to, pos, what = "") {
    if (r.t.k === "void") throw E(`incompatible types: void cannot be converted to ${tname(to)}`, pos);
    if (conv(r.t, to, "loose")) return apply(r.f, convF(r.t, to, r.node));
    if (r.c !== undefined && r.t.k === "p" && ["int", "short", "char", "byte"].includes(r.t.n)) {
      const tt = to.k === "p" ? to.n : UNBOX[to.n];
      const lim = {byte:[-128, 127], short:[-32768, 32767], char:[0, 65535]}[tt];
      if (lim && r.c >= lim[0] && r.c <= lim[1]) return apply(r.f, convF(T[tt], to) || null);
    }
    throw incompatible(r.t, to, pos);
  }
  function incompatible(from, to, pos) {
    const f = prom(from), t2 = prom(to);
    if (f.k === "p" && t2.k === "p" && isNumT(f) && isNumT(t2) && (from.k === "p" || to.k === "p")) {
      if (to.k === "p" || unb(to)) return E(`incompatible types: possible lossy conversion from ${tname(f)} to ${tname(t2)}`, pos);
    }
    return E(`incompatible types: ${tname(from)} cannot be converted to ${tname(to)}`, pos);
  }
  function describe(n) {
    if (!n) return null;
    if (n.k === "paren") return describe(n.e);
    if (n.k === "name") return `"${n.id}"`;
    if (n.k === "field") { const o = describe(n.obj); return o && o.startsWith('"') ? `"${o.slice(1, -1)}.${n.name}"` : `"${n.name}"`; }
    if (n.k === "call" && n.res) return `the return value of "${n.res}"`;
    if (n.k === "index") { const o = describe(n.arr); return o && o.startsWith('"') ? `"${o.slice(1, -1)}[...]"` : null; }
    if (n.k === "this") return '"this"';
    return null;
  }
  const epos = n => n.k === "call" ? (n.ap !== undefined ? n.ap : n.p) : n.k === "paren" ? n.p : n.p;
  const because = n => { const d = describe(n); return d ? ` because ${d} is null` : ""; };
  function isChecked(t) { return t.k === "c" && isSubCls(t.n, "Throwable") && !isSubCls(t.n, "RuntimeException") && !isSubCls(t.n, "Error"); }
  function checkThrown(t, cx, pos) {
    if (!isChecked(t)) return;
    for (let i = cx.handlers.length - 1; i >= 0; i--) {
      const h = cx.handlers[i];
      if (h.types.some(ct => subtype(t, ct))) { h.thrown.push(t); return; }
      h.thrown.push(t);
    }
    if (cx.throws.some(tt => subtype(t, tt))) return;
    throw E(`unreported exception ${tname(t)}; must be caught or declared to be thrown`, pos);
  }

  /* Namen auflösen */
  function findField(c, name, staticOnly) {
    for (let k = c; k; k = k.sup ? findCls(k.sup) : null) {
      const f = k.fields.get(name);
      if (f && (!staticOnly || f.static)) return f;
      for (const ic of allIfaces(k)) { const g = ic.fields.get(name); if (g) return g; }
      if (!k.sup) break;
    }
    return null;
  }
  function staticOf(f) {
    const c = f.cls;
    if (c.lib) {
      if (typeof f.value === "function") {
        const key = c.name + "." + f.name;
        const v = key === "System.out" ? rt.sysOut : key === "System.err" ? rt.sysErr : key === "System.in" ? rt.sysIn : key === "Boolean.TRUE" ? rt.box("Boolean", true) : key === "Boolean.FALSE" ? rt.box("Boolean", false) : rt.libStatic(key, f.value);
        return {f:() => v};
      }
      return {f:() => f.value, c:(f.t.k === "p" || isStrT(f.t)) ? f.value : undefined};
    }
    return null;
  }
  function constOfField(f) {
    if (f.cv !== undefined || !f.final || f.cls.lib || !f.decl || !f.decl.init || f.decl.init.k === "arrinit" || !(f.t.k === "p" || isStrT(f.t))) return f.cv;
    if (f.computing) return undefined;
    f.computing = true;
    try {
      const cx = newCtx(f.cls, null, true, "init");
      const r = X(f.decl.init, cx);
      if (r.c !== undefined && conv(r.t, f.t, "loose")) { const g = convF(r.t, f.t); f.cv = g ? g(r.c) : r.c; }
    } catch (e) { if (!(e instanceof CompileError)) throw e; }
    f.computing = false;
    return f.cv;
  }
  function fieldAccess(f, objR, n, cx, viaClass) {
    if (f.priv && f.cls.top !== cx.cls.top) throw E(`${f.name} has private access in ${f.cls.name}`, n.p);
    if (f.static) {
      const lb = staticOf(f);
      if (lb) return {t:f.t, f:lb.f, c:lb.c, field:f};
      const c = f.cls, name = f.name, H = c.statics;
      const cv = constOfField(f);
      if (cv !== undefined) return {t:f.t, f:() => cv, c:cv, field:f};
      const same_ = c === cx.cls;
      const get = same_ ? () => H[name] : () => { if (!c.inited) rt.initClass(c); return H[name]; };
      if (objR) { const of = objR.f; return {t:f.t, f:L => { of(L); return get(); }, field:f}; }
      return {t:f.t, f:get, field:f};
    }
    const key = f.key;
    if (!objR) {
      if (cx.st) throw E(`non-static variable ${f.name} cannot be referenced from a static context`, n.p);
      if (cx.finalFields && f.final && cx.finalFields.has(f) && cx.da !== null && !cx.da.has(f) && cx.kind === "ctor") throw E(`variable ${f.name} might not have been initialized`, n.p);
      return {t:f.t, f:L => L[0].f[key], field:f};
    }
    const of = objR.f, why = because(n.obj), cv = constOfField(f);
    return {t:f.t, f:L => { const o = of(L); if (o === null) throw rt.npe(`Cannot read field "${f.name}"${why}`); return o.f[key]; }, field:f, c:cv};
  }
  function varRef(v, n, cx) {
    if (!daHas(cx.da, v)) throw E(`variable ${v.name} might not have been initialized`, n.p);
    const s = v.slot;
    return {t:v.t, f:L => L[s], c:v.cv, v};
  }
  function nameRef(n, cx) {
    const v = cx.scope.get(n.id);
    if (v) return varRef(v, n, cx);
    for (let c = cx.cls; c; c = c.outer) {
      const f = findField(c, n.id);
      if (f) {
        if (c !== cx.cls && !f.static) throw E(`non-static variable ${f.name} cannot be referenced from a static context`, n.p);
        return fieldAccess(f, null, n, c === cx.cls ? cx : Object.assign({}, cx, {st:cx.st}));
      }
    }
    for (const s of imp.staticCls) { const f = s.c.fields.get(n.id); if (f && f.static && (!s.member || s.member === n.id)) return fieldAccess(f, null, n, cx); }
    try { return {cls:classByName(n.id, cx.cls, n.p)}; } catch (e) { if (!(e instanceof CompileError)) throw e; }
    if (n.id === "java" || n.id === "javax") return {pkg:n.id};
    if (n.asQual) return {pkg:n.id, unknown:true};
    throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.id}`, `  location: ${locOf(cx)}`]);
  }
  function qualRef(n, cx) {
    if (n.k === "name") return nameRef(n, cx);
    if (n.k === "field") return fieldRef(n, cx);
    return X(n, cx);
  }
  function fieldRef(n, cx) {
    if (n.obj.k === "super") {
      if (cx.st) throw E("non-static variable super cannot be referenced from a static context", n.obj.p);
      const f = findField(findCls(cx.cls.sup), n.name);
      if (!f) throw E("cannot find symbol", n.np, [`  symbol: variable ${n.name}`]);
      return fieldAccess(f, null, n, cx);
    }
    if (n.obj.k === "name" && n.asQual) n.obj.asQual = true;
    const q = qualRef(n.obj, cx);
    if (q.pkg) {
      const full = q.pkg + "." + n.name;
      if (q.unknown) { if (n.asQual) throw E(`package ${q.pkg} does not exist`, n.p); throw E("cannot find symbol", n.obj.p, [`  symbol:   variable ${q.pkg}`, `  location: ${locOf(cx)}`]); }
      const l = LIB[n.name];
      if (l && l.pkg === q.pkg && !HIDDEN.has(n.name)) return {cls:l};
      if (PKGS.has(full) || [...PKGS].some(p => p.startsWith(full + "."))) return {pkg:full};
      throw E(`package ${q.pkg} does not exist`, n.p);
    }
    if (q.cls) {
      const c = q.cls;
      const f = findField(c, n.name);
      if (f) {
        if (!f.static) throw E(`non-static variable ${n.name} cannot be referenced from a static context`, n.np);
        return fieldAccess(f, null, n, cx, true);
      }
      const nc = c.nested.get(n.name) || (c.name === "Map" && n.name === "Entry" ? LIB["Map.Entry"] : null);
      if (nc) return {cls:nc};
      if (n.name === "length" || n.name === "class") throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.name}`, `  location: class ${c.name}`]);
      throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.name}`, `  location: ${c.kind === "interface" ? "interface" : "class"} ${c.name}`]);
    }
    const t = q.t;
    if (t.k === "a") {
      if (n.name === "length") { const af = q.f, why = because(n.obj); return {t:T.int, f:L => { const a = af(L); if (a === null) throw rt.npe(`Cannot read the array length${why}`); return a.a.length; }, arrLen:true}; }
      throw E("cannot find symbol", n.np, [`  symbol:   variable ${n.name}`, `  location: class Object`]);
    }
    if (t.k === "p") throw E(`${t.n} cannot be dereferenced`, n.p);
    if (t.k === "null") throw E("<null> cannot be dereferenced", n.p);
    if (t.k === "err") return {t:T.err, f:() => null};
    const c = findCls(t.k === "v" ? "Object" : t.n);
    const f = findField(c, n.name);
    if (!f) throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.name}`, `  location: ${n.obj.k === "name" ? `variable ${n.obj.id} of type ${tname(t)}` : `class ${c.name}`}`]);
    return fieldAccess(f, q, n, cx);
  }

  /* Methoden auswählen wie JLS 15.12.2 */
  function methodsNamed(c, name) {
    const out = new Map(), seen = new Set();
    const visit = k => {
      if (!k || seen.has(k)) return;
      seen.add(k);
      for (const m of k.methods.get(name) || []) if (!out.has(m.sig)) out.set(m.sig, m);
      if (k.sup) visit(findCls(k.sup));
      for (const i of k.ifaces) visit(findCls(i));
    };
    visit(c);
    if (c.kind === "interface") visit(LIB.Object);
    return [...out.values()];
  }
  function substFor(recvT, m) {
    const s = Object.create(null), ctp = m.cls.tparams;
    if (ctp && ctp.length && !m.static) {
      const args = recvT && recvT.k === "c" && recvT.args && recvT.args.length === ctp.length ? recvT.args : null;
      ctp.forEach((p, i) => { s[p] = args ? args[i] : OBJ; });
    }
    return s;
  }
  function sub(t, s) {
    if (!s || !t) return t;
    if (t.k === "v") return s[t.n] || t;
    if (t.k === "a") return A(sub(t.of, s));
    if (t.k === "c" && t.args) return C(t.n, t.args.map(x => sub(x, s)));
    return t;
  }
  function paramsFor(m, recvT, argTs) {
    let ps = m.params.map(p => sub(p, substFor(recvT, m)));
    let b = null;
    if (m.mtv && m.mtv.length) {
      b = Object.create(null);
      const unify = (p, a) => {
        if (!p || !a) return;
        if (p.k === "v" && m.mtv.includes(p.n)) {
          const at = a.k === "p" ? boxT(a) : a.k === "null" ? null : a;
          if (!at) return;
          b[p.n] = b[p.n] ? (same(b[p.n], at) ? at : lub(b[p.n], at)) : at;
          return;
        }
        if (p.k === "a" && a.k === "a") return unify(p.of, a.of);
        if (p.k === "c" && p.args && a.k === "c") {
          let aa = a.args;
          if (aa && p.args.length === aa.length) p.args.forEach((x, i) => unify(x, aa[i]));
        }
      };
      argTs.forEach((a, i) => {
        let p = ps[Math.min(i, ps.length - 1)];
        if (m.varargs && i >= ps.length - 1 && !(i === ps.length - 1 && argTs.length === ps.length && a.k === "a")) p = ps[ps.length - 1].of;
        unify(p, a);
      });
      ps = ps.map(p => sub(p, b));
    }
    return {ps, b};
  }
  function applicable(ps, m, argTs, phase) {
    if (phase < 3) return ps.length === argTs.length && ps.every((p, i) => conv(argTs[i], p, phase === 1 ? "strict" : "loose"));
    if (!m.varargs || argTs.length < ps.length - 1) return false;
    for (let i = 0; i < ps.length - 1; i++) if (!conv(argTs[i], ps[i], "loose")) return false;
    const et = ps[ps.length - 1].of;
    for (let i = ps.length - 1; i < argTs.length; i++) if (!conv(argTs[i], et, "loose")) return false;
    return true;
  }
  function moreSpecific(a, b, phase, n) {
    const at = i => phase === 3 && i >= a.ps.length - 1 ? a.ps[a.ps.length - 1].of : a.ps[i];
    const bt = i => phase === 3 && i >= b.ps.length - 1 ? b.ps[b.ps.length - 1].of : b.ps[i];
    for (let i = 0; i < Math.max(n, phase === 3 ? Math.max(a.ps.length, b.ps.length) : 0); i++) {
      const x = at(i), y = bt(i);
      if (!x || !y) continue;
      if (!conv(x, y, "strict")) return false;
    }
    return true;
  }
  function resolve(cands, args, n, where, recvT, kind) {
    const argTs = args.map(a => a.t);
    for (const a of args) if (a.t.k === "void") throw E("'void' type not allowed here", a.pos2 !== undefined ? a.pos2 : (a.pos || n.p));
    for (let phase = 1; phase <= 3; phase++) {
      const app = [];
      for (const m of cands) {
        const {ps, b} = paramsFor(m, recvT, argTs);
        if (applicable(ps, m, argTs, phase)) app.push({m, ps, b, phase});
      }
      if (!app.length) continue;
      let best = app.filter(x => app.every(y => x === y || moreSpecific(x, y, phase, argTs.length)));
      if (best.length > 1) {
        const nonAbs = best.filter(x => !x.m.abstract);
        if (nonAbs.length === 1) best = nonAbs;
        else if (best.every(x => x.m.sig === best[0].m.sig)) best = [best[0]];
      }
      if (best.length !== 1) {
        const [x, y] = app;
        const d = z => `${z.m.isCtor ? "constructor" : "method"} ${z.m.isCtor ? z.m.cls.name : z.m.name}(${z.m.params.map(tname).join(",")}) in ${z.m.cls.name}`;
        throw E(`reference to ${kind === "ctor" ? where.name : n.name} is ambiguous`, n.p, [`  both ${d(x)} and ${d(y)} match`]);
      }
      return best[0];
    }
    const label = m => m.isCtor ? m.cls.name : m.name;
    const found = argTs.length ? argTs.map(tname).join(",") : "no arguments";
    const why = m => {
      const {ps} = paramsFor(m, recvT, argTs);
      if (!m.varargs && ps.length !== argTs.length) return "actual and formal argument lists differ in length";
      if (m.varargs && argTs.length < ps.length - 1) return "actual and formal argument lists differ in length";
      for (let i = 0; i < argTs.length; i++) {
        const p = i >= ps.length - 1 && m.varargs ? (argTs.length === ps.length && conv(argTs[i], ps[i], "loose") ? ps[i] : ps[ps.length - 1].of) : ps[i];
        if (p && !conv(argTs[i], p, "loose")) {
          const e = incompatible(argTs[i], p, 0);
          return "argument mismatch; " + e.msg.replace(/^incompatible types: /, "");
        }
      }
      return "argument mismatch";
    };
    // javac vereinfacht: Passt genau eine Methode von der Anzahl her, meldet es nur das falsche Argument
    const byArity = cands.filter(m => !m.varargs && m.params.length === argTs.length);
    if (byArity.length === 1 && argTs.length) {
      const m = byArity[0], {ps} = paramsFor(m, recvT, argTs);
      const i = argTs.findIndex((a, k) => !conv(a, ps[k], "loose"));
      if (i >= 0) { const e = incompatible(argTs[i], ps[i], args[i].pos2 !== undefined ? args[i].pos2 : (args[i].pos || n.p)); e.simplified = true; throw e; }
    }
    if (cands.length === 1) {
      const m = cands[0];
      const req = m.params.length ? m.params.map(tname).join(",").replace(/\[\]$/, m.varargs ? "..." : "[]") : "no arguments";
      throw E(`${m.isCtor ? "constructor" : "method"} ${label(m)} in ${m.cls.kind === "interface" ? "interface" : m.cls.kind === "enum" ? "enum" : m.cls.kind === "record" ? "record" : "class"} ${m.cls.name}${m.cls.tparams.length ? "<" + m.cls.tparams.join(",") + ">" : ""} cannot be applied to given types;`, n.p,
        [`  required: ${req}`, `  found:    ${found}`, `  reason: ${why(m)}`]);
    }
    const extra = [];
    for (const m of cands.slice(0, 12)) {
      extra.push(`    ${m.isCtor ? "constructor" : "method"} ${m.cls.name}.${label(m)}(${m.params.map(tname).join(",")}) is not applicable`);
      extra.push(`      (${why(m)})`);
    }
    throw E(`no suitable ${kind === "ctor" ? "constructor" : "method"} found for ${kind === "ctor" ? where.name : n.name}(${argTs.map(tname).join(",")})`, n.p, extra);
  }
  function argFns(sel, args) {
    const {m, ps, phase} = sel;
    const fs = [];
    if (phase === 3) {
      const fixed = ps.length - 1, et = ps[fixed].of;
      for (let i = 0; i < fixed; i++) fs.push(apply(args[i].f, convF(args[i].t, ps[i])));
      const rest = args.slice(fixed).map(a => apply(a.f, convF(a.t, et)));
      const etR = et.k === "v" ? OBJ : et;
      fs.push(L => new JArr(etR, rest.map(f => f(L))));
    } else args.forEach((a, i) => fs.push(apply(a.f, convF(a.t, ps[i]))));
    const n = fs.length;
    if (n === 0) return () => [];
    if (n === 1) { const f0 = fs[0]; return L => [f0(L)]; }
    if (n === 2) { const f0 = fs[0], f1 = fs[1]; return L => [f0(L), f1(L)]; }
    return L => { const r = new Array(n); for (let i = 0; i < n; i++) r[i] = fs[i](L); return r; };
  }
  function retType(sel, recvT) {
    const m = sel.m;
    let t = sub(m.ret, substFor(recvT, m));
    if (sel.b) t = sub(t, sel.b);
    if (m.name === "getClass" && m.cls === LIB.Object) t = C("Class");
    return t;
  }

  function call(n, cx) {
    let cands, where, recv = null, recvT = null, viaClass = false, superCall = false;
    if (n.obj === null) {
      for (let c = cx.cls; c; c = c.outer) {
        const ms = methodsNamed(c, n.name);
        if (ms.length) { cands = ms; where = c; break; }
      }
      if (!cands) for (const s of imp.staticCls) { const ms = (s.c.methods.get(n.name) || []).filter(m => m.static && (!s.member || s.member === n.name)); if (ms.length) { cands = ms; where = s.c; viaClass = true; break; } }
    } else if (n.obj.k === "super") {
      if (cx.st) throw E("non-static variable super cannot be referenced from a static context", n.obj.p);
      where = findCls(cx.cls.sup || "Object");
      cands = methodsNamed(where, n.name);
      superCall = true;
    } else {
      if (n.obj.k === "field") n.obj.asQual = true;
      const q = qualRef(n.obj, cx);
      if (q.pkg && q.unknown) throw E("cannot find symbol", n.obj.p, [`  symbol:   variable ${q.pkg}`, `  location: ${locOf(cx)}`]);
      if (q.pkg) throw E("cannot find symbol", n.obj.p, [`  symbol:   class ${q.pkg.split(".").pop()}`]);
      if (q.cls) { where = q.cls; cands = methodsNamed(q.cls, n.name); viaClass = true; }
      else {
        recv = q; recvT = q.t;
        if (recvT.k === "p") throw E(`${recvT.n} cannot be dereferenced`, n.p);
        if (recvT.k === "null") throw E("<null> cannot be dereferenced", n.p);
        if (recvT.k === "err") { n.args.forEach(a => X(a, cx)); return {t:T.err, f:() => null}; }
        where = recvT.k === "a" ? LIB.Object : findCls(recvT.k === "v" ? "Object" : recvT.n);
        cands = methodsNamed(where, n.name);
      }
    }
    const args = n.args.map(a => { const r = X(a, cx); r.pos = a.p; r.pos2 = epos(a); return r; });
    if (!cands || !cands.length) {
      const loc = recv ? (n.obj.k === "name" ? `variable ${n.obj.id} of type ${tname(recvT)}` : `${where.kind === "interface" ? "interface" : "class"} ${tname(recvT.k === "a" ? recvT : C(where.name, recvT.args))}`) : `${(where || cx.cls).kind === "interface" ? "interface" : "class"} ${(where || cx.cls).name}`;
      throw E("cannot find symbol", n.p, [`  symbol:   method ${n.name}(${args.map(a => tname(a.t)).join(",")})`, `  location: ${loc}`]);
    }
    const sel = resolve(cands, args, n, where, recvT, "method");
    const m = sel.m;
    if (m.priv && m.cls.top !== cx.cls.top) throw E(`${m.name}(${m.params.map(tname).join(",")}) has private access in ${m.cls.name}`, n.np || n.p);
    if (!m.static && (viaClass || (n.obj === null && (cx.st || where !== cx.cls && !isSubCls(cx.cls.name, where.name))))) {
      if (!(n.obj === null && !cx.st && isSubCls(cx.cls.name, m.cls.name)))
        throw E(`non-static method ${m.name}(${m.params.map(tname).join(",")}) cannot be referenced from a static context`, n.np || n.p);
    }
    if (superCall && m.abstract) throw E(`abstract method ${m.name}(${m.params.map(tname).join(",")}) in ${m.cls.name} cannot be accessed directly`, n.np);
    for (const t of m.throws || []) checkThrown(t, cx, n.ap || n.p);
    const af = argFns(sel, args);
    const t = retType(sel, recvT);
    n.res = `${m.cls.lib ? m.cls.fq.replace(/^java\.lang\./, "") : m.cls.name}.${m.name}(${m.params.map(erase).join(", ")})`;
    const desc = `"${m.cls.lib ? m.cls.fq.replace(/^java\.lang\./, "") : m.cls.name}.${m.name}(${m.params.map(tname).join(", ")})"`;
    let f;
    if (m.static) {
      const c = m.cls;
      if (m.lib) { const impl = m.impl; f = L => impl(null, af(L), rt); }
      else if (c === cx.cls) f = L => rt.invoke(m, null, af(L));
      else f = L => { if (!c.inited) rt.initClass(c); return rt.invoke(m, null, af(L)); };
      if (recv) { const rf = recv.f, g = f; f = L => { rf(L); return g(L); }; }
    } else {
      const sig = m.sig, direct = m.priv || superCall || (where && where.final && where.lib);
      const rf = recv ? recv.f : L => L[0];
      const why = recv ? because(n.obj) : "";
      if (direct) {
        if (m.lib) { const impl = m.impl; f = L => { const o = rf(L); if (o === null) throw rt.npe(`Cannot invoke ${desc}${why}`); return impl(o, af(L), rt); }; }
        else f = L => { const o = rf(L); if (o === null) throw rt.npe(`Cannot invoke ${desc}${why}`); return rt.invoke(m, o, af(L)); };
      } else {
        f = L => {
          const o = rf(L);
          if (o === null) throw rt.npe(`Cannot invoke ${desc}${why}`);
          const as = af(L);
          const tg = rt.lookup(o, sig) || m;
          return tg.lib ? tg.impl(o, as, rt) : rt.invoke(tg, o, as);
        };
      }
    }
    if (m.ret.k === "v" || (m.ret.k === "c" && m.ret.args && m.ret.args.some(a => a.k === "v"))) {
      if (t.k === "c" && t.n !== "Object" && !t.args) { const g = f; const tt = t; f = L => { const v = g(L); if (v !== null && !rt.isInst(v, tt)) throw rt.cce(v, (findCls(tt.n) || {fq:tt.n}).fq); return v; }; }
    }
    return {t, f};
  }

  function newObj(n, cx, want) {
    const t0 = resolveType(n.type, cx.cls, {diamond:true});
    const c = findCls(t0.n);
    let t = t0;
    if (t0.args && !t0.args.length) {
      let args = c.tparams.map(() => OBJ);
      if (want && want.k === "c" && want.args && want.args.length === c.tparams.length && isSubCls(c.name, want.n)) args = want.args;
      t = C(c.name, args);
    }
    if (c.tparams.length && !t.args) t = C(c.name, null);
    if (c.kind === "interface" || c.abstract) throw E(`${c.name} is abstract; cannot be instantiated`, n.p);
    if (c.kind === "enum") throw E("enum classes may not be instantiated", n.p);
    if (c.inner && cx.st) throw E("non-static variable this cannot be referenced from a static context", n.p);
    const args = n.args.map(a => { const r = X(a, cx); r.pos = a.p; r.pos2 = epos(a); return r; });
    if (!c.ctors.length) throw E(`cannot find symbol`, n.p, [`  symbol:   constructor ${c.name}()`]);
    const sel = resolve(c.ctors, args, {name:c.name, p:n.p}, c, t, "ctor");
    const m = sel.m;
    if (m.priv && m.cls.top !== cx.cls.top) throw E(`${c.name}(${m.params.map(tname).join(",")}) has private access in ${c.name}`, n.p);
    for (const tt of m.throws || []) checkThrown(tt, cx, n.p);
    const af = argFns(sel, args);
    let f;
    if (m.lib) { const impl = m.impl; f = L => impl(rt, af(L), c, null); }
    else f = L => rt.newObj(c, m, af(L));
    return {t, f};
  }
  function newArr(n, cx) {
    const base = resolveType(n.base, cx.cls);
    let t = base;
    for (let i = 0; i < n.total; i++) t = A(t);
    if (n.init) return arrInit(n.init, t, cx);
    const dims = n.dims.map(d => {
      const r = X(d, cx);
      const p = unaryProm(r.t);
      if (!(p.k === "p" && p.n === "int")) throw incompatible(r.t, T.int, d.p);
      return apply(r.f, convF(r.t, T.int));
    });
    if (base.k === "c" && findCls(base.n).tparams.length && n.base.args && n.base.args.length) throw E("generic array creation", n.p);
    const nd = dims.length;
    if (nd === 1) { const d0 = dims[0]; return {t, f:L => rt.newArray(t, [d0(L)])}; }
    return {t, f:L => rt.newArray(t, dims.map(d => d(L)))};
  }
  function arrInit(n, t, cx) {
    if (t.k !== "a") throw E(`illegal initializer for ${tname(t)}`, n.p);
    const et = t.of;
    const fs = n.elems.map(e => e.k === "arrinit" ? arrInit(e, et, cx).f : assignConv(X(e, cx, et), et, e.p));
    const etR = et;
    return {t, f:L => { const a = new Array(fs.length); for (let i = 0; i < fs.length; i++) a[i] = fs[i](L); return new JArr(etR, a); }};
  }

  /* Rechnen */
  const DIV0 = () => { throw rt.ex("ArithmeticException", "/ by zero"); };
  const OPS = {
    int:{"+":(a, b) => (a + b) | 0, "-":(a, b) => (a - b) | 0, "*":Math.imul, "/":(a, b) => b === 0 ? DIV0() : (a / b) | 0, "%":(a, b) => b === 0 ? DIV0() : (a % b) | 0,
      "&":(a, b) => a & b, "|":(a, b) => a | b, "^":(a, b) => a ^ b},
    long:{"+":(a, b) => BigInt.asIntN(64, a + b), "-":(a, b) => BigInt.asIntN(64, a - b), "*":(a, b) => BigInt.asIntN(64, a * b), "/":(a, b) => b === 0n ? DIV0() : BigInt.asIntN(64, a / b), "%":(a, b) => b === 0n ? DIV0() : a % b,
      "&":(a, b) => a & b, "|":(a, b) => a | b, "^":(a, b) => a ^ b},
    double:{"+":(a, b) => a + b, "-":(a, b) => a - b, "*":(a, b) => a * b, "/":(a, b) => a / b, "%":(a, b) => a % b},
    float:{"+":(a, b) => Math.fround(a + b), "-":(a, b) => Math.fround(a - b), "*":(a, b) => Math.fround(a * b), "/":(a, b) => Math.fround(a / b), "%":(a, b) => Math.fround(a % b)},
    boolean:{"&":(a, b) => a && b, "|":(a, b) => a || b, "^":(a, b) => a !== b}
  };
  const SHIFT = {
    int:{"<<":(a, n) => a << (n & 31), ">>":(a, n) => a >> (n & 31), ">>>":(a, n) => (a >>> (n & 31)) | 0},
    long:{"<<":(a, n) => BigInt.asIntN(64, a << BigInt(n & 63)), ">>":(a, n) => a >> BigInt(n & 63), ">>>":(a, n) => BigInt.asIntN(64, BigInt.asUintN(64, a) >> BigInt(n & 63))}
  };
  const CMP = {"<":(a, b) => a < b, ">":(a, b) => a > b, "<=":(a, b) => a <= b, ">=":(a, b) => a >= b, "==":(a, b) => a === b, "!=":(a, b) => a !== b};
  function badOps(op, a, b, pos) { return E(`bad operand types for binary operator '${op}'`, pos, [`  first type:  ${tname(a)}`, `  second type: ${tname(b)}`]); }
  function fold(r, fn, t) {
    if (r.every(x => x.c !== undefined)) {
      try { const v = fn(...r.map(x => x.c)); return K_(t, v); } catch (e) { if (!(e instanceof JV.JThrow)) throw e; }
    }
    return null;
  }
  function concatStr(rs) { return rs.map(r => r.t.k === "p" ? strOfPrim(r.t.n) : isStrT(r.t) ? v => v === null ? "null" : s$(v) : v => rt.toStr(v)); }
  function bin(n, cx) {
    const op = n.op;
    if (op === "&&" || op === "||") {
      const l = cond(n.l, cx), daL = daCopy(cx.da);
      const r = cond(n.r, cx);
      cx.da = op === "&&" ? daL : daL;
      const lf = l.f, rf = r.f;
      const k = fold([l, r], (a, b) => op === "&&" ? a && b : a || b, T.boolean);
      if (k) return k;
      return {t:T.boolean, f:op === "&&" ? L => lf(L) && rf(L) : L => lf(L) || rf(L)};
    }
    const l = X(n.l, cx), r = X(n.r, cx);
    if (l.t.k === "void" || r.t.k === "void") throw E("'void' type not allowed here", l.t.k === "void" ? n.l.p : n.r.p);
    if (l.t.k === "err" || r.t.k === "err") return {t:op === "+" ? T.err : T.err, f:() => null};
    if (op === "+" && (isStrT(l.t) || isStrT(r.t))) {
      const [sa, sb] = concatStr([l, r]);
      if (l.c !== undefined && r.c !== undefined) return K_(STR, sa(l.c) + sb(r.c));
      const lf = l.f, rf = r.f;
      return {t:STR, f:L => new String(sa(lf(L)) + sb(rf(L)))};
    }
    if (op === "==" || op === "!=") {
      const lp = prom(l.t), rp = prom(r.t);
      const numeric = isNumT(lp) && isNumT(rp) && (l.t.k === "p" || r.t.k === "p");
      const bools = lp.n === "boolean" && rp.n === "boolean" && lp.k === "p" && rp.k === "p" && (l.t.k === "p" || r.t.k === "p");
      if (numeric) {
        const pt = binProm(l.t, r.t);
        const lf = apply(l.f, convF(l.t, pt, l.node)), rf = apply(r.f, convF(r.t, pt, r.node)), c = CMP[op];
        const k = fold([{c:l.c === undefined ? undefined : (convF(l.t, pt) || (x => x))(l.c)}, {c:r.c === undefined ? undefined : (convF(r.t, pt) || (x => x))(r.c)}], c, T.boolean);
        if (k) return k;
        return {t:T.boolean, f:L => c(lf(L), rf(L))};
      }
      if (bools) {
        const lf = apply(l.f, convF(l.t, T.boolean)), rf = apply(r.f, convF(r.t, T.boolean)), c = CMP[op];
        const k = fold([l, r], c, T.boolean);
        if (k) return k;
        return {t:T.boolean, f:L => c(lf(L), rf(L))};
      }
      if (isRefT(l.t) && isRefT(r.t)) {
        if (!castable(l.t, r.t) && !castable(r.t, l.t)) throw E(`incomparable types: ${tname(l.t)} and ${tname(r.t)}`, n.p);
        const lf = l.f, rf = r.f;
        if (l.c !== undefined && r.c !== undefined) return K_(T.boolean, op === "==" ? l.c === r.c : l.c !== r.c);
        return {t:T.boolean, f:op === "==" ? L => lf(L) === rf(L) : L => lf(L) !== rf(L)};
      }
      throw badOps(op, l.t, r.t, n.p);
    }
    if (op === "<<" || op === ">>" || op === ">>>") {
      const lp = unaryProm(l.t), rp = unaryProm(r.t);
      if (!(isIntT(lp) && isIntT(rp))) throw badOps(op, l.t, r.t, n.p);
      const lf = apply(l.f, convF(l.t, lp)), rf0 = apply(r.f, convF(r.t, rp));
      const rf = rp.n === "long" ? L => Number(BigInt.asIntN(32, rf0(L))) : rf0;
      const sh = SHIFT[lp.n][op];
      const k = fold([{c:l.c === undefined ? undefined : (convF(l.t, lp) || (x => x))(l.c)}, {c:r.c === undefined ? undefined : (rp.n === "long" ? Number(BigInt.asIntN(32, (convF(r.t, rp) || (x => x))(r.c))) : (convF(r.t, rp) || (x => x))(r.c))}], sh, lp);
      if (k) return k;
      return {t:lp, f:L => sh(lf(L), rf(L))};
    }
    if (["<", ">", "<=", ">="].includes(op)) {
      if (!numLike(l.t) || !numLike(r.t)) throw badOps(op, l.t, r.t, n.p);
      const pt = binProm(l.t, r.t);
      const cl = convF(l.t, pt), cr = convF(r.t, pt);
      const lf = apply(l.f, convF(l.t, pt, l.node)), rf = apply(r.f, convF(r.t, pt, r.node)), c = CMP[op];
      const k = fold([{c:l.c === undefined ? undefined : (cl || (x => x))(l.c)}, {c:r.c === undefined ? undefined : (cr || (x => x))(r.c)}], c, T.boolean);
      if (k) return k;
      return {t:T.boolean, f:L => c(lf(L), rf(L))};
    }
    if (op === "&" || op === "|" || op === "^") {
      if (boolLike(l.t) && boolLike(r.t)) {
        const lf = apply(l.f, convF(l.t, T.boolean)), rf = apply(r.f, convF(r.t, T.boolean)), o = OPS.boolean[op];
        const k = fold([l, r], o, T.boolean);
        if (k) return k;
        return {t:T.boolean, f:L => { const a = lf(L), b = rf(L); return o(a, b); }};
      }
      if (!(isIntT(unaryProm(l.t)) && isIntT(unaryProm(r.t)))) throw badOps(op, l.t, r.t, n.p);
    } else if (!numLike(l.t) || !numLike(r.t)) throw badOps(op, l.t, r.t, n.p);
    const pt = binProm(l.t, r.t);
    const cl = convF(l.t, pt), cr = convF(r.t, pt);
    const lf = apply(l.f, convF(l.t, pt, l.node)), rf = apply(r.f, convF(r.t, pt, r.node)), o = OPS[pt.n][op];
    const k = fold([{c:l.c === undefined ? undefined : (cl || (x => x))(l.c)}, {c:r.c === undefined ? undefined : (cr || (x => x))(r.c)}], o, pt);
    if (k) return k;
    return {t:pt, f:L => o(lf(L), rf(L))};
  }
  function cond(n, cx) {
    const r = X(n, cx);
    if (r.t.k === "err") return r;
    if (!boolLike(r.t)) throw incompatible(r.t, T.boolean, n.p);
    return {t:T.boolean, f:apply(r.f, convF(r.t, T.boolean)), c:r.c};
  }
  function unary(n, cx) {
    if (n.op === "-" && n.e.k === "lit" && n.e.neg && n.e.tok.t === "num") {
      const t = n.e.tok;
      if (t.kind === "int") { if (t.big > 2147483648n) throw E("integer number too large", n.e.p); return K_(T.int, Number(BigInt.asIntN(32, -t.big))); }
      if (t.kind === "long") { if (t.big > 9223372036854775808n) throw E("integer number too large", n.e.p); return K_(T.long, BigInt.asIntN(64, -t.big)); }
    }
    if (n.op === "!") { cx.neg = (cx.neg || 0) + 1; let r; try { r = X(n.e, cx); if (r.t.k !== "err" && !boolLike(r.t)) throw E(`bad operand type ${tname(r.t)} for unary operator '!'`, n.p); r = {t:T.boolean, f:apply(r.f, convF(r.t, T.boolean)), c:r.c}; } finally { cx.neg--; } if (r.c !== undefined) return K_(T.boolean, !r.c); const f = r.f; return {t:T.boolean, f:L => !f(L)}; }
    const r = X(n.e, cx);
    if (r.t.k === "err") return r;
    const pt = unaryProm(r.t);
    if (n.op === "~") {
      if (!isIntT(pt)) throw E(`bad operand type ${tname(r.t)} for unary operator '~'`, n.p);
      const f = apply(r.f, convF(r.t, pt));
      const o = pt.n === "long" ? v => ~v : v => ~v;
      if (r.c !== undefined) return K_(pt, o(f()));
      return {t:pt, f:L => o(f(L))};
    }
    if (!isNumT(pt)) throw E(`bad operand type ${tname(r.t)} for unary operator '${n.op}'`, n.p);
    const f = apply(r.f, convF(r.t, pt));
    let o;
    if (n.op === "+") o = v => v;
    else o = pt.n === "int" ? v => (-v) | 0 : pt.n === "long" ? v => BigInt.asIntN(64, -v) : v => -v;
    if (r.c !== undefined) return K_(pt, o(f()));
    return {t:pt, f:L => o(f(L))};
  }

  /* Ziele für Zuweisungen */
  function LV(n, cx, compound) {
    if (n.k === "paren") return LV(n.e, cx, compound);
    if (n.k === "name") {
      const v = cx.scope.get(n.id);
      if (v) {
        if (compound && !daHas(cx.da, v)) throw E(`variable ${v.name} might not have been initialized`, n.p);
        if (v.final && (compound || daHas(cx.da, v) || v.loopy)) throw E(`cannot assign a value to final variable ${v.name}`, n.p);
        const s = v.slot;
        return {t:v.t, v, set:cf => L => (L[s] = cf(L)), upd:(fn, post) => L => { const o = L[s], nv = fn(o, L); L[s] = nv; return post ? o : nv; }};
      }
      const q = nameRef(n, cx);
      if (!q.field) throw E("unexpected type", n.p, ["  required: variable", "  found:    value"]);
      return fieldLV(q.field, null, n, cx, compound);
    }
    if (n.k === "field") {
      if (n.obj.k === "super") { const f = findField(findCls(cx.cls.sup), n.name); if (!f) throw E("cannot find symbol", n.np); return fieldLV(f, null, n, cx, compound); }
      const q = qualRef(n.obj, cx);
      if (q.cls || q.pkg) { const r = fieldRef(n, cx); if (!r.field) throw E("unexpected type", n.p); return fieldLV(r.field, null, n, cx, compound); }
      if (q.t.k === "a" && n.name === "length") throw E("cannot assign a value to final variable length", n.np);
      if (q.t.k === "p") throw E(`${q.t.n} cannot be dereferenced`, n.p);
      const c = findCls(q.t.k === "c" ? q.t.n : "Object");
      const f = c && findField(c, n.name);
      if (!f) throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.name}`, `  location: ${n.obj.k === "name" ? `variable ${n.obj.id} of type ${tname(q.t)}` : `class ${c ? c.name : "?"}`}`]);
      if (f.priv && f.cls.top !== cx.cls.top) throw E(`${f.name} has private access in ${f.cls.name}`, n.p);
      return fieldLV(f, q, n, cx, compound);
    }
    if (n.k === "index") {
      const a = X(n.arr, cx);
      if (a.t.k !== "a") { if (a.t.k === "err") return {t:T.err, set:cf => cf, upd:fn => () => null}; throw E(`array required, but ${tname(a.t)} found`, n.p); }
      const i = X(n.i, cx);
      if (unaryProm(i.t).n !== "int") throw incompatible(i.t, T.int, n.i.p);
      const af = a.f, xf = apply(i.f, convF(i.t, T.int)), why = because(n.arr), et = a.t.of;
      const chk = (arr, ix) => { if (arr === null) throw rt.npe(`Cannot store to ${tname(et)} array${why}`); if (ix < 0 || ix >= arr.a.length) throw rt.ex("ArrayIndexOutOfBoundsException", `Index ${ix} out of bounds for length ${arr.a.length}`); };
      return {t:et,
        set:cf => L => { const arr = af(L), ix = xf(L), v = cf(L); chk(arr, ix); if (et.k !== "p" && v !== null && !rt.isInst(v, arr.et)) throw rt.ex("ArrayStoreException", rt.className(v)); return (arr.a[ix] = v); },
        upd:(fn, post) => L => { const arr = af(L), ix = xf(L); chk(arr, ix); const o = arr.a[ix], nv = fn(o, L); arr.a[ix] = nv; return post ? o : nv; }};
    }
    throw E("unexpected type", n.p, ["  required: variable", "  found:    value"]);
  }
  function fieldLV(f, q, n, cx, compound) {
    if (f.final) {
      const own = f.cls === cx.cls && ((f.static && cx.kind === "init" && cx.st) || (!f.static && (cx.kind === "ctor" || (cx.kind === "init" && !cx.st))));
      const hasInit = f.decl && f.decl.init;
      const viaThis = !q || (n.obj && n.obj.k === "this");
      if (!own || hasInit || f.cls.lib || f.enumConst || compound || !viaThis || (cx.finalFields && cx.da !== null && cx.da.has(f))) throw E(`cannot assign a value to final variable ${f.name}`, n.np || n.p);
    }
    if (f.static) {
      const c = f.cls, H = c.statics, name = f.name;
      const pre = q ? q.f : null;
      const initC = L => { if (pre) pre(L); if (!c.inited) rt.initClass(c); };
      return {t:f.t, field:f, set:cf => L => { initC(L); return (H[name] = cf(L)); }, upd:(fn, post) => L => { initC(L); const o = H[name], nv = fn(o, L); H[name] = nv; return post ? o : nv; }};
    }
    if (!q && cx.st) throw E(`non-static variable ${f.name} cannot be referenced from a static context`, n.p);
    const key = f.key, of = q ? q.f : L => L[0], why = q ? because(n.obj) : "";
    return {t:f.t, field:f,
      set:cf => L => { const o = of(L), v = cf(L); if (o === null) throw rt.npe(`Cannot assign field "${f.name}"${why}`); return (o.f[key] = v); },
      upd:(fn, post) => L => { const o = of(L); if (o === null) throw rt.npe(`Cannot read field "${f.name}"${why}`); const old = o.f[key], nv = fn(old, L); o.f[key] = nv; return post ? old : nv; }};
  }
  function assign(n, cx) {
    if (n.op === "=") {
      const lv = LV(n.l, cx, false);
      if (n.r.k === "arrinit") throw E("illegal start of expression", n.r.p);
      const r = X(n.r, cx, lv.t);
      const cf = assignConv(r, lv.t, epos(n.r));
      if (lv.v && cx.da) cx.da.add(lv.v);
      if (lv.field && lv.field.final && cx.da) cx.da.add(lv.field);
      return {t:lv.t, f:lv.set(cf)};
    }
    const op = n.op.slice(0, -1);
    const lv = LV(n.l, cx, true);
    const r = X(n.r, cx);
    if (r.t.k === "void") throw E("'void' type not allowed here", n.r.p);
    if (lv.t.k === "err" || r.t.k === "err") return {t:T.err, f:() => null};
    const rf = r.f;
    if (op === "+" && isStrT(lv.t)) {
      const sb = concatStr([r])[0];
      return {t:lv.t, f:lv.upd((o, L) => new String((o === null ? "null" : s$(o)) + sb(rf(L))))};
    }
    const lt = prom(lv.t);
    let pt;
    if ((op === "&" || op === "|" || op === "^") && boolLike(lv.t) && boolLike(r.t)) pt = T.boolean;
    else if (op === "<<" || op === ">>" || op === ">>>") {
      if (!isIntT(unaryProm(lv.t)) || !isIntT(unaryProm(r.t))) throw badOps(op, lv.t, r.t, n.p);
      pt = unaryProm(lv.t);
      const rp = unaryProm(r.t), sh = SHIFT[pt.n][op];
      const toP = convF(lv.t, pt) || (x => x), back = convF(pt, lv.t) || (x => x);
      const rc0 = apply(rf, convF(r.t, rp)), rc = rp.n === "long" ? L => Number(BigInt.asIntN(32, rc0(L))) : rc0;
      return {t:lv.t, f:lv.upd((o, L) => back(sh(toP(o), rc(L))))};
    } else {
      if (!numLike(lv.t) || !numLike(r.t)) throw badOps(op, lv.t, r.t, n.p);
      if ((op === "&" || op === "|" || op === "^") && !(isIntT(unaryProm(lv.t)) && isIntT(unaryProm(r.t)))) throw badOps(op, lv.t, r.t, n.p);
      pt = binProm(lv.t, r.t);
    }
    const o = (OPS[pt.n] || {})[op];
    const toP = convF(lv.t, pt) || (x => x);
    const rc = apply(rf, convF(r.t, pt));
    const back = lv.t.k === "p" ? (primConv(pt.n, lv.t.n) || (x => x)) : (v => rt.box(lv.t.n, (primConv(pt.n, lt.n) || (x => x))(v)));
    return {t:lv.t, f:lv.upd((old, L) => back(o(toP(old), rc(L))))};
  }
  function incdec(n, cx, post) {
    const lv = LV(n.e, cx, true);
    if (lv.t.k === "err") return {t:T.err, f:() => null};
    const lt = prom(lv.t);
    if (!isNumT(lt)) throw E(`bad operand type ${tname(lv.t)} for unary operator '${n.op}'`, n.p);
    const d = n.op === "++" ? 1 : -1;
    let fn;
    switch (lt.n) {
      case "int": fn = v => (v + d) | 0; break;
      case "long": fn = v => BigInt.asIntN(64, v + BigInt(d)); break;
      case "double": fn = v => v + d; break;
      case "float": fn = v => Math.fround(v + d); break;
      case "char": fn = v => (v + d) & 0xFFFF; break;
      case "byte": fn = v => ((v + d) << 24) >> 24; break;
      case "short": fn = v => ((v + d) << 16) >> 16; break;
    }
    if (lv.t.k !== "p") { const g = fn, bn = lv.t.n; fn = v => { if (v === null) throw rt.npe(); return rt.box(bn, g(v.v)); }; }
    return {t:lv.t, f:lv.upd(fn, post)};
  }
  function ternary(n, cx) {
    const c = cond(n.c, cx);
    const daC = daCopy(cx.da);
    const a = X(n.a, cx);
    const daA = cx.da; cx.da = daCopy(daC);
    const b = X(n.b, cx);
    cx.da = daMeet(daA, cx.da);
    if (a.t.k === "void" || b.t.k === "void") throw E("'void' type not allowed here", a.t.k === "void" ? n.a.p : n.b.p);
    let t;
    const ap = prom(a.t), bp = prom(b.t);
    if (same(a.t, b.t)) t = a.t;
    else if (a.t.k === "err" || b.t.k === "err") t = T.err;
    else if (boolLike(a.t) && boolLike(b.t)) t = T.boolean;
    else if (isNumT(ap) && isNumT(bp) && a.t.k !== "null" && b.t.k !== "null") {
      if (ap.n === bp.n) t = ap;
      else {
        const fits = (r, tt) => r.c !== undefined && r.t.n === "int" && ({byte:[-128, 127], short:[-32768, 32767], char:[0, 65535]}[tt.n] || [1, 0])[0] <= r.c && r.c <= ({byte:[-128, 127], short:[-32768, 32767], char:[0, 65535]}[tt.n] || [1, 0])[1];
        if (["byte", "short", "char"].includes(bp.n) && fits(a, bp)) t = bp;
        else if (["byte", "short", "char"].includes(ap.n) && fits(b, ap)) t = ap;
        else t = binProm(ap, bp);
      }
    } else {
      const ra = a.t.k === "p" ? boxT(a.t) : a.t, rb = b.t.k === "p" ? boxT(b.t) : b.t;
      t = ra.k === "null" ? rb : rb.k === "null" ? ra : lub(ra, rb);
    }
    const af = apply(a.f, convF(a.t, t)), bf = apply(b.f, convF(b.t, t)), cf = c.f;
    if (c.c !== undefined && a.c !== undefined && b.c !== undefined) { const v = c.c ? af() : bf(); return K_(t, v); }
    return {t, f:L => cf(L) ? af(L) : bf(L)};
  }
  function cast(n, cx) {
    const t = resolveType(n.type, cx.cls);
    const r = X(n.e, cx);
    if (r.t.k === "err") return {t, f:r.f};
    if (r.t.k === "void") throw E("'void' type not allowed here", n.e.p);
    if (!castable(r.t, t)) throw E(`incompatible types: ${tname(r.t)} cannot be converted to ${tname(t)}`, n.e.p);
    if (t.k === "p" && r.t.k === "p") {
      const g = primConv(r.t.n, t.n);
      if (r.c !== undefined) return K_(t, g ? g(r.c) : r.c);
      return {t, f:apply(r.f, g)};
    }
    if (t.k === "p" || r.t.k === "p") return {t, f:apply(r.f, convF(r.t, t))};
    if (subtype(r.t, t)) return {t, f:r.f, c:r.c};
    const rf = r.f, tc = t.k === "c" ? (findCls(t.n) || {fq:t.n}).fq : "[" + rt.arrCode(t.of);
    return {t, f:L => { const v = rf(L); if (v !== null && !rt.isInst(v, t)) throw rt.cce(v, tc); return v; }};
  }
  function instOf(n, cx) {
    const r = X(n.e, cx);
    const t = resolveType(n.type, cx.cls);
    if (r.t.k === "p") throw E(`unexpected type`, n.e.p, ["  required: reference", `  found:    ${r.t.n}`]);
    if (t.k === "p") throw E("unexpected type", n.type.p, ["  required: class or array", `  found:    ${t.n}`]);
    if (!castable(r.t, t)) throw E(`incompatible types: ${tname(r.t)} cannot be converted to ${tname(t)}`, n.p);
    const rf = r.f;
    if (n.bind) {
      const v = declareVar(cx, n.bind, t, false, n.bp);
      if (cx.da) cx.da.add(v);
      if (cx.binds) cx.binds.push({v, pol:(cx.neg || 0) % 2 === 0});
      const s = v.slot;
      return {t:T.boolean, f:L => { const x = rf(L); if (x !== null && rt.isInst(x, t)) { L[s] = x; return true; } return false; }};
    }
    return {t:T.boolean, f:L => rt.isInst(rf(L), t)};
  }
  function index(n, cx) {
    const a = X(n.arr, cx);
    if (a.t.k === "err") { X(n.i, cx); return {t:T.err, f:() => null}; }
    if (a.t.k !== "a") throw E(`array required, but ${tname(a.t)} found`, n.p);
    const i = X(n.i, cx);
    if (unaryProm(i.t).n !== "int") throw incompatible(i.t, T.int, n.i.p);
    const af = a.f, xf = apply(i.f, convF(i.t, T.int)), why = because(n.arr), et = a.t.of;
    return {t:et, f:L => {
      const arr = af(L), ix = xf(L);
      if (arr === null) throw rt.npe(`Cannot load from ${et.k === "p" ? et.n : "object"} array${why}`);
      if (ix < 0 || ix >= arr.a.length) throw rt.ex("ArrayIndexOutOfBoundsException", `Index ${ix} out of bounds for length ${arr.a.length}`);
      return arr.a[ix];
    }};
  }
  function lit(n) {
    const t = n.tok;
    if (t.t === "num") {
      if (t.kind === "int") {
        if (t.big > (t.radix === 10 ? 2147483647n : 4294967295n)) throw E("integer number too large", n.p);
        return K_(T.int, Number(BigInt.asIntN(32, t.big)));
      }
      if (t.kind === "long") {
        if (t.big > (t.radix === 10 ? 9223372036854775807n : 18446744073709551615n)) throw E("integer number too large", n.p);
        return K_(T.long, BigInt.asIntN(64, t.big));
      }
      return K_(t.kind === "float" ? T.float : T.double, t.num);
    }
    if (t.t === "str") return K_(STR, t.v);
    if (t.t === "chr") return K_(T.char, t.v);
    if (t.v === "true" || t.v === "false") return K_(T.boolean, t.v === "true");
    return {t:T.null, f:() => null};
  }

  function X(n, cx, want) {
    const r = X0(n, cx, want);
    if (r && r.t && !r.node) r.node = n;
    return r;
  }
  function X0(n, cx, want) {
    switch (n.k) {
      case "lit": return lit(n);
      case "paren": { const r = X(n.e, cx, want); return {t:r.t, f:r.f, c:r.c}; }
      case "name": { const q = nameRef(n, cx); if (q.cls || q.pkg) throw E("cannot find symbol", n.p, [`  symbol:   variable ${n.id}`, `  location: ${locOf(cx)}`]); return q; }
      case "field": { const q = fieldRef(n, cx); if (q.cls || q.pkg) throw E("cannot find symbol", n.np || n.p, [`  symbol:   variable ${n.name}`, `  location: ${locOf(cx)}`]); return q; }
      case "this":
        if (cx.st) throw E("non-static variable this cannot be referenced from a static context", n.p);
        return {t:C(cx.cls.name), f:L => L[0]};
      case "super": throw E("'.' expected", n.p);
      case "call": return call(n, cx);
      case "new": return newObj(n, cx, want);
      case "newarr": return newArr(n, cx);
      case "arrinit": if (want && want.k === "a") return arrInit(n, want, cx); throw E("illegal start of expression", n.p);
      case "index": return index(n, cx);
      case "un": return unary(n, cx);
      case "preinc": return incdec(n, cx, false);
      case "postinc": return incdec(n, cx, true);
      case "bin": return bin(n, cx);
      case "assign": return assign(n, cx);
      case "cond": return ternary(n, cx);
      case "cast": return cast(n, cx);
      case "instanceof": return instOf(n, cx);
      case "switchx": return switchExpr(n, cx);
      case "ctorcall": throw E(cx.kind === "ctor" ? "explicit constructor invocation not allowed here" : "explicit constructor invocation may only appear within a constructor body", n.p);
    }
    throw E("illegal start of expression", n.p);
  }

  /* ---------- Anweisungen ---------- */
  const NOOP = () => undefined;
  function seq(fs) {
    const n = fs.length;
    if (n === 0) return NOOP;
    if (n === 1) return fs[0];
    if (n === 2) { const a = fs[0], b = fs[1]; return L => { const r = a(L); if (r !== undefined) return r; return b(L); }; }
    return L => { for (let i = 0; i < n; i++) { const r = fs[i](L); if (r !== undefined) return r; } return undefined; };
  }
  function block(stmts, cx, newScope = true) {
    const saved = cx.scope;
    if (newScope) cx.scope = new Scope(saved);
    const parts = [];
    let cc = true, reported = false;
    for (const s of stmts) {
      if (!cc && !reported) { errors.push(E("unreachable statement", s.p)); reported = true; }
      try {
        const r = S(s, cx);
        parts.push(r.f);
        cc = r.cc || reported;
        if (!r.cc && !reported) cc = false;
      } catch (e) { if (!(e instanceof CompileError)) throw e; errors.push(e); if (["return", "throw", "break", "continue", "yield"].includes(s.k)) { cc = false; reported = true; } }
    }
    cx.scope = saved;
    return {f:seq(parts), cc};
  }
  function S(n, cx) {
    const line = lineAt(n.p);
    const r = S0(n, cx);
    if (n.k === "block" || n.k === "label" || n.k === "empty") return r;
    const f = r.f;
    r.f = L => { rt.line = line; return f(L); };
    return r;
  }
  function notDecl(s) { if (s.k === "local") throw E("variable declaration not allowed here", s.vars ? s.vars[0].p : s.p); }
  function loopBody(n, cx, target) {
    notDecl(n);
    cx.targets.push(target);
    const saved = cx.scope;
    cx.scope = new Scope(saved);
    let r;
    try { r = S(n, cx); } finally { cx.targets.pop(); cx.scope = saved; }
    return r;
  }
  function handleLoopSig(r, label) {
    // liefert: 0 = weiter, 1 = Schleife verlassen, 2 = Signal nach außen geben
    if (r.k === BRK) return (r.l === null || r.l === label) ? 1 : 2;
    if (r.k === CNT) return (r.l === null || r.l === label) ? 0 : 2;
    return 2;
  }
  function S0(n, cx) {
    switch (n.k) {
      case "block": return block(n.body, cx);
      case "empty": return {f:NOOP, cc:true};
      case "local": {
        const fs = [];
        for (const d of n.vars) {
          let t;
          if (n.type.name === "var") {
            if (n.vars.length > 1) throw E("'var' is not allowed in a compound declaration", d.p);
            if (!d.init) throw E(`cannot infer type for local variable ${d.name}`, d.p, ["  (cannot use 'var' on variable without initializer)"]);
            if (d.init.k === "arrinit") throw E(`cannot infer type for local variable ${d.name}`, d.p, ["  (array initializer needs an explicit target-type)"]);
            if (d.dims) throw E("'var' is not allowed as an element type of an array", d.p);
            const r = X(d.init, cx);
            if (r.t.k === "null") throw E(`cannot infer type for local variable ${d.name}`, d.p, ["  (variable initializer is 'null')"]);
            if (r.t.k === "void") throw E(`cannot infer type for local variable ${d.name}`, d.p, ["  (variable initializer is 'void')"]);
            t = r.t;
            const v = declareVar(cx, d.name, t, n.final, d.p);
            if (cx.da) cx.da.add(v);
            const s = v.slot, f = r.f;
            fs.push(L => { L[s] = f(L); });
            continue;
          }
          t = resolveType(n.type, cx.cls);
          for (let i = 0; i < d.dims; i++) t = A(t);
          const v = declareVar(cx, d.name, t, n.final, d.p);
          if (d.init) {
            let cf, r;
            try {
              r = d.init.k === "arrinit" ? arrInit(d.init, t, cx) : X(d.init, cx, t);
              cf = assignConv(r, t, epos(d.init));
            } catch (e) { if (cx.da) cx.da.add(v); throw e; }
            if (n.final && r.c !== undefined && (t.k === "p" || isStrT(t))) { const g = convF(r.t, t); v.cv = g ? g(r.c) : r.c; }
            if (cx.da) cx.da.add(v);
            const s = v.slot;
            fs.push(L => { L[s] = cf(L); });
          }
        }
        return {f:seq(fs), cc:true};
      }
      case "expr": {
        const r = X(n.e, cx);
        const f = r.f;
        return {f:L => { f(L); }, cc:true};
      }
      case "if": {
        // Mustervariablen aus instanceof gelten nur dort, wo das Muster sicher passt (JLS 6.3.1)
        const saved = cx.scope, outerBinds = cx.binds;
        cx.scope = new Scope(saved);
        cx.binds = [];
        let c;
        try { c = cond(n.c, cx); } finally { cx.scope = saved; }
        const binds = cx.binds;
        cx.binds = outerBinds;
        const withBinds = pol => { const s = new Scope(saved); for (const b of binds) if (b.pol === pol) s.v.set(b.v.name, b.v); return s; };
        const before = daCopy(cx.da);
        notDecl(n.t);
        cx.scope = withBinds(true);
        const t = S(n.t, cx);
        cx.scope = saved;
        const daT = t.cc ? cx.da : null;
        cx.da = daCopy(before);
        let e = null;
        if (n.f) { notDecl(n.f); cx.scope = withBinds(false); e = S(n.f, cx); cx.scope = saved; }
        const daE = !e || e.cc ? cx.da : null;
        cx.da = daMeet(daT, daE);
        if (cx.da === null && (t.cc || !e || e.cc)) cx.da = daCopy(before);
        if (!n.f && !t.cc) for (const b of binds) if (!b.pol) saved.v.set(b.v.name, b.v);
        const cf = c.f, tf = t.f, ef = e ? e.f : null;
        return {f:ef ? L => cf(L) ? tf(L) : ef(L) : L => cf(L) ? tf(L) : undefined, cc:!e || t.cc || e.cc};
      }
      case "while": {
        const label = cx.pendingLabel; cx.pendingLabel = null;
        const c = cond(n.c, cx);
        const before = daCopy(cx.da);
        const tg = {kind:"loop", label, broke:false, daBreaks:[]};
        if (c.c === false) errors.push(E("unreachable statement", n.body.p));
        const b = loopBody(n.body, cx, tg);
        cx.da = c.c === true ? tg.daBreaks.reduce((acc, d) => acc === undefined ? daCopy(d) : daMeet(acc, d), undefined) ?? null : tg.daBreaks.reduce((acc, d) => daMeet(acc, d), before);
        const cf = c.f, bf = b.f, line = lineAt(n.p);
        return {f:L => {
          for (;;) {
            rt.line = line;
            if (!cf(L)) return undefined;
            const r = bf(L);
            if (r !== undefined) { const h = handleLoopSig(r, label); if (h === 1) return undefined; if (h === 2) return r; }
            if (++rt.steps > rt.lim) rt.check();
          }
        }, cc:c.c !== true || tg.broke};
      }
      case "do": {
        const label = cx.pendingLabel; cx.pendingLabel = null;
        const tg = {kind:"loop", label, broke:false, daBreaks:[]};
        const b = loopBody(n.body, cx, tg);
        const c = cond(n.c, cx);
        const after = daCopy(cx.da);
        cx.da = c.c === true ? (tg.daBreaks.reduce((acc, d) => acc === undefined ? daCopy(d) : daMeet(acc, d), undefined) ?? null) : tg.daBreaks.reduce((acc, d) => daMeet(acc, d), after);
        const cf = c.f, bf = b.f;
        return {f:L => {
          for (;;) {
            const r = bf(L);
            if (r !== undefined) { const h = handleLoopSig(r, label); if (h === 1) return undefined; if (h === 2) return r; }
            if (!cf(L)) return undefined;
            if (++rt.steps > rt.lim) rt.check();
          }
        }, cc:(c.c !== true && (b.cc || true)) || tg.broke};
      }
      case "for": {
        const label = cx.pendingLabel; cx.pendingLabel = null;
        const saved = cx.scope;
        cx.scope = new Scope(saved);
        const init = [];
        for (const s of n.init) init.push(S(s, cx).f);
        const c = n.c ? cond(n.c, cx) : {f:() => true, c:true};
        const before = daCopy(cx.da);
        const tg = {kind:"loop", label, broke:false, daBreaks:[]};
        if (c.c === false) errors.push(E("unreachable statement", n.body.p));
        const b = loopBody(n.body, cx, tg);
        const upd = n.upd.map(e => X(e, cx).f);
        cx.scope = saved;
        cx.da = c.c === true ? (tg.daBreaks.reduce((acc, d) => acc === undefined ? daCopy(d) : daMeet(acc, d), undefined) ?? null) : tg.daBreaks.reduce((acc, d) => daMeet(acc, d), before);
        const inf = seq(init), cf = c.f, bf = b.f, uf = upd.length === 1 ? upd[0] : L => { for (const u of upd) u(L); }, line = lineAt(n.p);
        return {f:L => {
          inf(L);
          for (;;) {
            rt.line = line;
            if (!cf(L)) return undefined;
            const r = bf(L);
            if (r !== undefined) { const h = handleLoopSig(r, label); if (h === 1) return undefined; if (h === 2) return r; }
            rt.line = line;
            uf(L);
            if (++rt.steps > rt.lim) rt.check();
          }
        }, cc:c.c !== true || tg.broke};
      }
      case "foreach": {
        const label = cx.pendingLabel; cx.pendingLabel = null;
        const it = X(n.iter, cx);
        let et;
        if (it.t.k === "a") et = it.t.of;
        else if (it.t.k === "c" && isSubCls(it.t.n, "Iterable")) {
          const c = findCls(it.t.n);
          et = it.t.args && it.t.args.length ? it.t.args[0] : OBJ;
          if (c.name === "Map" || isSubCls(c.name, "Map")) et = OBJ;
        } else if (it.t.k === "err") et = T.err;
        else throw E("for-each not applicable to expression type", n.iter.p, ["  required: array or java.lang.Iterable", `  found:    ${tname(it.t)}`]);
        const saved = cx.scope;
        cx.scope = new Scope(saved);
        let vt;
        if (n.type.name === "var") vt = et; else vt = resolveType(n.type, cx.cls);
        if (!conv(et, vt, "loose")) { cx.scope = saved; throw incompatible(et, vt, n.iter.p); }
        const v = declareVar(cx, n.name, vt, n.final, n.np);
        if (cx.da) cx.da.add(v);
        v.loopy = n.final;
        const cv = convF(et, vt) || (x => x);
        const before = daCopy(cx.da);
        const tg = {kind:"loop", label, broke:false, daBreaks:[]};
        const b = loopBody(n.body, cx, tg);
        cx.scope = saved;
        cx.da = tg.daBreaks.reduce((acc, d) => daMeet(acc, d), before);
        const itf = it.f, bf = b.f, s = v.slot, why = because(n.iter), isArr = it.t.k === "a", line = lineAt(n.p);
        return {f:L => {
          const src = itf(L);
          if (src === null) throw rt.npe(isArr ? `Cannot read the array length${why}` : `Cannot invoke "java.lang.Iterable.iterator()"${why}`);
          if (isArr) {
            const a = src.a;
            for (let i = 0; i < a.length; i++) {
              L[s] = cv(a[i]);
              const r = bf(L);
              if (r !== undefined) { const h = handleLoopSig(r, label); if (h === 1) return undefined; if (h === 2) return r; }
              if (++rt.steps > rt.lim) rt.check();
            }
            return undefined;
          }
          const iter = rt.iterator(src);
          for (;;) {
            rt.line = line;
            if (!iter.hasNext()) return undefined;
            L[s] = cv(iter.next());
            const r = bf(L);
            if (r !== undefined) { const h = handleLoopSig(r, label); if (h === 1) return undefined; if (h === 2) return r; }
            if (++rt.steps > rt.lim) rt.check();
          }
        }, cc:true};
      }
      case "label": {
        if (cx.targets.some(t => t.label === n.label)) throw E(`label ${n.label} already in use`, n.p);
        const loop = ["while", "do", "for", "foreach"].includes(n.body.k);
        if (loop) { cx.pendingLabel = n.label; return S(n.body, cx); }
        const tg = {kind:"label", label:n.label, broke:false, daBreaks:[]};
        cx.targets.push(tg);
        let b;
        try { b = S(n.body, cx); } finally { cx.targets.pop(); }
        const bf = b.f, lb = n.label;
        return {f:L => { const r = bf(L); if (r !== undefined && r.k === BRK && r.l === lb) return undefined; return r; }, cc:b.cc || tg.broke};
      }
      case "break": {
        let tg = null;
        for (let i = cx.targets.length - 1; i >= 0; i--) {
          const t = cx.targets[i];
          if (t.kind === "swx" && !n.label) throw E("attempt to break out of a switch expression", n.p);
          if (n.label ? t.label === n.label : (t.kind === "loop" || t.kind === "switch")) { tg = t; break; }
        }
        if (!tg) throw n.label ? E(`undefined label: ${n.label}`, n.p) : E("break outside switch or loop", n.p);
        tg.broke = true;
        tg.daBreaks.push(daCopy(cx.da));
        cx.da = null;
        const sig = n.label ? {k:BRK, l:n.label} : BRK0;
        return {f:() => sig, cc:false};
      }
      case "continue": {
        let tg = null;
        for (let i = cx.targets.length - 1; i >= 0; i--) {
          const t = cx.targets[i];
          if (t.kind === "swx") throw E("attempting to continue out of a switch expression", n.p);
          if (t.kind === "loop" && (!n.label || t.label === n.label)) { tg = t; break; }
        }
        if (!tg) throw n.label ? E(`undefined label: ${n.label}`, n.p) : E("continue outside of loop", n.p);
        cx.da = null;
        const sig = n.label ? {k:CNT, l:n.label} : CNT0;
        return {f:() => sig, cc:false};
      }
      case "return": {
        if (cx.kind === "init") throw E("return outside method", n.p);
        if (cx.targets.some(t => t.kind === "swx")) throw E("attempting to return out of a switch expression", n.p);
        if (!n.e) {
          if (cx.ret.k !== "void") throw E("incompatible types: missing return value", n.p, [], "Die Methode muss hier einen Wert zurückgeben, zum Beispiel return ergebnis;.");
          cx.da = null;
          const sig = {k:RET, v:undefined};
          return {f:() => sig, cc:false};
        }
        if (cx.ret.k === "void") throw E("incompatible types: unexpected return value", n.e.p, [], "Eine void-Methode gibt keinen Wert zurück. Lass den Wert hinter return weg oder gib der Methode einen Rückgabetyp.");
        const r = X(n.e, cx, cx.ret);
        const f = assignConv(r, cx.ret, epos(n.e));
        cx.da = null;
        return {f:L => ({k:RET, v:f(L)}), cc:false};
      }
      case "yield": {
        const sw = cx.swx;
        if (!sw) throw E("yield outside of switch expression", n.p);
        const r = X(n.e, cx);
        sw.yields.push(r);
        cx.da = null;
        const f = r.f;
        return {f:L => ({k:YLD, v:f(L), r}), cc:false};
      }
      case "throw": {
        const r = X(n.e, cx);
        if (r.t.k !== "err" && !(r.t.k === "c" && isSubCls(r.t.n, "Throwable")) && r.t.k !== "null") throw incompatible(r.t, C("Throwable"), n.e.p);
        if (r.t.k === "c") checkThrown(r.t, cx, n.p);
        cx.da = null;
        const f = r.f, why = because(n.e);
        return {f:L => { const o = f(L); if (o === null) throw rt.npe(`Cannot throw exception${why}`); throw new JThrow(o); }, cc:false};
      }
      case "try": return tryStmt(n, cx);
      case "switch": return switchStmt(n, cx);
      case "assert": { cond(n.c, cx); if (n.m) X(n.m, cx); return {f:NOOP, cc:true}; }
    }
    throw E("not a statement", n.p);
  }
  function tryStmt(n, cx) {
    const before = daCopy(cx.da);
    const saved = cx.scope;
    cx.scope = new Scope(saved);
    const res = [];
    const h = {types:n.catches.flatMap(c => { try { return c.types.map(t => resolveType(t, cx.cls)); } catch (e) { if (e instanceof CompileError) { errors.push(e); return []; } throw e; } }), thrown:[]};
    cx.handlers.push(h);
    let tb;
    try {
      for (const r of n.res) {
        const s = S(r, cx);
        const v = cx.scope.get(r.vars[0].name);
        if (v && !(v.t.k === "c" && isSubCls(v.t.n, "AutoCloseable"))) errors.push(E("incompatible types: try-with-resources not applicable to variable type", r.p, [`    (${tname(v.t)} cannot be converted to AutoCloseable)`]));
        res.push({f:s.f, slot:v ? v.slot : 0});
      }
      tb = block(n.block.body, cx);
    } finally { cx.handlers.pop(); }
    cx.scope = saved;
    const daTry = tb.cc ? cx.da : null;
    let daAll = daTry;
    const catches = [];
    const seen = [];
    for (const c of n.catches) {
      cx.da = daCopy(before);
      cx.scope = new Scope(saved);
      try {
        const types = c.types.map(t => resolveType(t, cx.cls));
        for (const t of types) {
          if (!(t.k === "c" && isSubCls(t.n, "Throwable"))) throw incompatible(t, C("Throwable"), c.types[0].p);
          const prev = seen.find(s => subtype(t, s));
          if (prev) throw E(`exception ${tname(t)} has already been caught`, c.p);
          if (isChecked(t) && !["Exception", "Throwable"].includes(t.n) && !h.thrown.some(x => subtype(x, t) || subtype(t, x))) throw E(`exception ${tname(t)} is never thrown in body of corresponding try statement`, c.p);
        }
        if (types.length > 1) for (let i = 0; i < types.length; i++) for (let j = 0; j < types.length; j++) if (i !== j && subtype(types[i], types[j])) throw E("Alternatives in a multi-catch statement cannot be related by subclassing", c.types[i].p, [`  Alternative ${tname(types[i])} is a subclass of alternative ${tname(types[j])}`]);
        seen.push(...types);
        const v = declareVar(cx, c.name, types.length === 1 ? types[0] : C("Exception"), c.final || types.length > 1, c.np);
        if (cx.da) cx.da.add(v);
        const b = block(c.body.body, cx);
        catches.push({types, slot:v.slot, f:b.f});
        daAll = daMeet(daAll, b.cc ? cx.da : null);
        if (b.cc) tb.cc = true;
      } catch (e) { if (!(e instanceof CompileError)) throw e; errors.push(e); }
      cx.scope = saved;
    }
    let fin = null, finCc = true;
    if (n.fin) {
      cx.da = daCopy(before);
      const fb = block(n.fin.body, cx);
      fin = fb.f; finCc = fb.cc;
      const added = cx.da === null ? null : [...cx.da].filter(x => !before || !before.has(x));
      cx.da = daAll === null ? (added === null ? null : null) : new Set([...daAll, ...(added || [])]);
    } else cx.da = daAll;
    if (cx.da === null && (tb.cc || catches.length)) cx.da = daCopy(before);
    const tf = tb.f;
    const f = L => {
      let pending = null, sig;
      try {
        for (const r of res) r.f(L);
        try { sig = tf(L); }
        finally {
          for (let i = res.length - 1; i >= 0; i--) { const o = L[res[i].slot]; if (o !== null && o !== undefined) rt.call(o, "close()", []); }
        }
      } catch (e) {
        if (e instanceof Halt) throw e;
        let je = e;
        if (e instanceof RangeError) je = rt.ex("StackOverflowError", null);
        if (!(je instanceof JThrow)) throw e;
        const c = catches.find(c => c.types.some(t => rt.isInst(je.obj, t)));
        if (!c) pending = je;
        else {
          L[c.slot] = je.obj;
          try { sig = c.f(L); }
          catch (e2) { if (e2 instanceof Halt || !fin) throw e2; pending = e2; }
        }
      }
      if (fin) { const fs = fin(L); if (fs !== undefined) return fs; }
      if (pending) throw pending;
      return sig;
    };
    return {f, cc:(tb.cc) && finCc};
  }
  function switchSetup(n, cx) {
    const sel = X(n.sel, cx);
    let st = sel.t, kind;
    const u = unb(st);
    if (u && ["int", "char", "short", "byte"].includes(u.n)) { kind = "num"; }
    else if (st.k === "p" && ["int", "char", "short", "byte"].includes(st.n)) kind = "num";
    else if (isStrT(st)) kind = "str";
    else if (st.k === "c" && findCls(st.n) && findCls(st.n).kind === "enum") kind = "enum";
    else if (st.k === "err") kind = "num";
    else throw E(st.k === "p" ? `constant label of type ${st.n} is not compatible with switch selector type ${st.n}` : `patterns in switch statements are a preview feature`, n.sel.p, [], "switch funktioniert mit int, char, String und enum. Für andere Typen nimm if-else.");
    const selT = kind === "num" ? (u || st) : st;
    const sf = apply(sel.f, kind === "num" && u ? convF(st, u) : null);
    const why = because(n.sel);
    const keyOf = kind === "str" ? v => s$(v) : v => v;
    const map = new Map();
    let def = -1;
    const enumCls = kind === "enum" ? findCls(st.n) : null;
    n.cases.forEach((c, i) => {
      if (!c.labels) { if (def >= 0) errors.push(E("duplicate default label", c.p)); def = i; return; }
      for (const lab of c.labels) {
        if (lab.k === "default") { def = i; continue; }
        let key;
        try {
          if (kind === "enum") {
            const nm = lab.k === "name" ? lab.id : lab.k === "field" ? lab.name : null;
            const f = nm && enumCls.fields.get(nm);
            if (!f || !f.enumConst) throw E(`an enum switch case label must be the unqualified name of an enumeration constant`, lab.p);
            key = "E:" + nm;
          } else {
            const r = X(lab, cx);
            if (r.c === undefined) throw E("constant expression required", lab.p);
            if (kind === "str") { if (!isStrT(r.t)) throw incompatible(r.t, STR, lab.p); key = r.c; }
            else {
              if (!isNumT(r.t) || r.t.n === "long" || r.t.n === "double" || r.t.n === "float") throw E(`constant label of type ${tname(r.t)} is not compatible with switch selector type ${tname(selT)}`, lab.p);
              const g = convF(r.t, selT) || (x => x);
              const ok = conv(r.t, selT, "strict") || (r.t.n === "int" && ({char:[0, 65535], byte:[-128, 127], short:[-32768, 32767]}[selT.n] || [-Infinity, Infinity])[0] <= r.c && r.c <= ({char:[0, 65535], byte:[-128, 127], short:[-32768, 32767]}[selT.n] || [-Infinity, Infinity])[1]);
              if (!ok) throw incompatible(r.t, selT, lab.p);
              key = g(r.c);
            }
          }
          if (map.has(key)) throw E("duplicate case label", c.p);
          map.set(key, i);
        } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
      }
    });
    const pick = kind === "enum" ? v => { if (v === null) throw rt.npe(); const i = map.get("E:" + v.f["Enum#name"]); return i === undefined ? def : i; }
      : L0 => L0;
    const choose = L => {
      const v = sf(L);
      if (v === null) throw rt.npe(`Cannot invoke "${kind === "str" ? "String.hashCode()" : "Object.ordinal()"}"${why}`);
      if (kind === "enum") return pick(v);
      const i = map.get(keyOf(v));
      return i === undefined ? def : i;
    };
    const exhaustive = def >= 0 || (enumCls && enumCls.decl.enumConsts.every(ec => map.has("E:" + ec.name)));
    return {choose, def, exhaustive};
  }
  function switchStmt(n, cx) {
    const label = cx.pendingLabel; cx.pendingLabel = null;
    const {choose, def, exhaustive} = switchSetup(n, cx);
    const before = daCopy(cx.da);
    const tg = {kind:"switch", label, broke:false, daBreaks:[]};
    cx.targets.push(tg);
    const saved = cx.scope;
    let groups = [], lastCc = true, anyCc = false;
    try {
      if (n.arrow) {
        let daEnd = null;
        for (const c of n.cases) {
          cx.da = daCopy(before);
          cx.scope = new Scope(saved);
          let r;
          try {
            if (c.block) r = S(c.block, cx);
            else { const e = X(c.e, cx); if (!["assign", "preinc", "postinc", "call", "new"].includes(c.e.k)) throw E("not a statement", c.e.p); const f = e.f; r = {f:L => { f(L); }, cc:true}; }
          } catch (e) { if (!(e instanceof CompileError)) throw e; errors.push(e); r = {f:NOOP, cc:true}; }
          if (r.cc) { anyCc = true; daEnd = daEnd === null ? daCopy(cx.da) : daMeet(daEnd, cx.da); }
          groups.push(r.f);
          cx.scope = saved;
        }
        cx.da = tg.daBreaks.reduce((a, d) => daMeet(a, d), exhaustive ? daEnd : daMeet(daEnd, before));
        if (cx.da === null && (anyCc || !exhaustive || tg.broke)) cx.da = daCopy(before);
      } else {
        cx.scope = new Scope(saved);
        let reported = false;
        for (const c of n.cases) {
          cx.da = lastCc && groups.length ? daMeet(cx.da, before) : daCopy(before);
          const parts = [];
          let cc = true;
          for (const s of c.body) {
            if (!cc && !reported) { errors.push(E("unreachable statement", s.p)); reported = true; }
            try { const r = S(s, cx); parts.push(r.f); cc = r.cc || reported; } catch (e) { if (!(e instanceof CompileError)) throw e; errors.push(e); }
          }
          groups.push(seq(parts));
          lastCc = cc;
        }
        const daEnd = lastCc ? cx.da : null;
        cx.da = tg.daBreaks.reduce((a, d) => daMeet(a, d), def >= 0 ? daEnd : daMeet(daEnd, before));
        if (cx.da === null && (lastCc || def < 0 || tg.broke)) cx.da = daCopy(before);
      }
    } finally { cx.targets.pop(); cx.scope = saved; }
    const arrow = n.arrow, gl = groups.length;
    const f = L => {
      let i = choose(L);
      if (i < 0) return undefined;
      if (arrow) {
        const r = groups[i](L);
        if (r !== undefined && r.k === BRK && (r.l === null || r.l === label)) return undefined;
        return r;
      }
      for (; i < gl; i++) {
        const r = groups[i](L);
        if (r !== undefined) { if (r.k === BRK && (r.l === null || r.l === label)) return undefined; return r; }
      }
      return undefined;
    };
    const cc = arrow ? (anyCc || !exhaustive || tg.broke) : (lastCc || def < 0 || tg.broke);
    return {f, cc};
  }
  function switchExpr(n, cx) {
    const {choose, exhaustive} = switchSetup(n, cx);
    if (!exhaustive) throw E("the switch expression does not cover all possible input values", n.p);
    const before = daCopy(cx.da);
    const prevSw = cx.swx;
    const sw = {yields:[]};
    cx.swx = sw;
    const tg = {kind:"swx", label:null, broke:false, daBreaks:[]};
    cx.targets.push(tg);
    const saved = cx.scope;
    const arms = [];
    let daEnd = null;
    try {
      if (n.arrow) {
        for (const c of n.cases) {
          cx.da = daCopy(before);
          cx.scope = new Scope(saved);
          if (c.e) { const r = X(c.e, cx); sw.yields.push(r); arms.push({e:r}); daEnd = daEnd === null ? daCopy(cx.da) : daMeet(daEnd, cx.da); }
          else {
            const r = S(c.block, cx);
            if (r.cc && c.block.k === "block") throw E("switch rule completes without providing a value", c.block.endP || c.p, ["  (switch rules in switch expressions should either provide a value or throw)"]);
            arms.push({s:r.f});
          }
          cx.scope = saved;
        }
      } else {
        cx.scope = new Scope(saved);
        const groups = [];
        for (const c of n.cases) {
          cx.da = daCopy(before);
          const parts = c.body.map(s => S(s, cx).f);
          groups.push(seq(parts));
        }
        arms.push({groups});
      }
    } finally { cx.targets.pop(); cx.swx = prevSw; cx.scope = saved; }
    cx.da = daEnd || daCopy(before);
    let t = null;
    for (const r of sw.yields) {
      if (r.t.k === "void") throw E("'void' type not allowed here", n.p);
      if (!t) t = r.t;
      else if (!same(t, r.t)) {
        if (isNumT(prom(t)) && isNumT(prom(r.t))) t = binProm(t, r.t);
        else if (boolLike(t) && boolLike(r.t)) t = T.boolean;
        else t = lub(t.k === "p" ? boxT(t) : t, r.t.k === "p" ? boxT(r.t) : r.t);
      }
    }
    t = t || OBJ;
    const tt = t;
    const conv1 = r => apply(r.f, convF(r.t, tt));
    const fs = arms.map(a => a.e ? conv1(a.e) : a.s ? (L => { const r = a.s(L); if (r && r.k === YLD) return (convF(r.r.t, tt) || (x => x))(r.v); throw new Error("switch ohne Wert"); }) : null);
    if (!n.arrow) {
      const groups = arms[0].groups;
      return {t, f:L => {
        for (let i = choose(L); i < groups.length; i++) {
          const r = groups[i](L);
          if (r !== undefined) { if (r.k === YLD) return (convF(r.r.t, tt) || (x => x))(r.v); return r; }
        }
        throw rt.ex("MatchException", null);
      }};
    }
    return {t, f:L => fs[choose(L)](L)};
  }

  /* ---------- Klassenrümpfe übersetzen ---------- */
  function compileClass(c) {
    const d = c.decl;
    const statics = [], insts = [];
    const clinitM = {name:"<clinit>", cls:c, clinit:true, static:true, lib:false, params:[], ret:T.void, line:lineOf(d.p), nSlots:0, throws:[]};
    const iinitM = {name:"<init>", cls:c, isCtor:true, static:false, lib:false, params:[], ret:T.void, line:lineOf(d.p), nSlots:1, throws:[]};
    const scx = newCtx(c, clinitM, true, "init"), icx = newCtx(c, iinitM, false, "init");
    if (c.kind === "enum") {
      const ct = C(c.name);
      c.enumValues = [];
      d.enumConsts.forEach((ec, i) => {
        try {
          const args = ec.args.map(a => { const r = X(a, scx); r.pos = a.p; return r; });
          const sel = resolve(c.ctors, args, {name:c.name, p:ec.p}, c, ct, "ctor");
          const af = argFns(sel, args), m = sel.m, line = lineOf(ec.p);
          statics.push(L => {
            rt.line = line;
            const o = new JObj(c);
            for (const [k, v] of c.defaults) o.f[k] = v;
            o.f["Enum#name"] = ec.name; o.f["Enum#ordinal"] = i;
            c.statics[ec.name] = o;
            c.enumValues.push(o);
            rt.invoke(m, o, af(L));
          });
        } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
      });
    }
    for (const mb of d.members) {
      if (mb.k === "field") {
        for (const v of mb.vars) {
          const f = c.fields.get(v.name);
          if (!f || f.decl !== v || !v.init) continue;
          const cx = f.static ? scx : icx;
          try {
            const r = v.init.k === "arrinit" ? arrInit(v.init, f.t, cx) : X(v.init, cx, f.t);
            const cf = assignConv(r, f.t, epos(v.init));
            const line = lineOf(v.p);
            if (f.static) { const H = c.statics, name = f.name; statics.push(L => { rt.line = line; H[name] = cf(L); }); }
            else { const key = f.key; insts.push(L => { rt.line = line; L[0].f[key] = cf(L); }); }
          } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
        }
      } else if (mb.k === "init") {
        const cx = mb.static ? scx : icx;
        const b = block(mb.body.body, cx);
        (mb.static ? statics : insts).push(b.f);
      }
    }
    clinitM.body = seq(statics); clinitM.nSlots = scx.max;
    c.clinitM = statics.length ? clinitM : null;
    iinitM.body = seq(insts); iinitM.nSlots = icx.max;
    c.iinit = insts.length ? iinitM : null;
    for (const ms of c.methods.values()) for (const m of ms) if (!m.lib && m.decl && m.decl.body) compileMethod(m);
    for (const m of c.ctors) compileCtor(m);
  }
  function compileMethod(m) {
    const d = m.decl;
    const cx = newCtx(m.cls, m, m.static, "method");
    d.params.forEach((p, i) => { try { const v = declareVar(cx, p.name, m.params[i], p.final, p.p); cx.da.add(v); } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; } });
    const b = block(d.body.body, cx, true);
    if (m.ret.k !== "void" && m.ret.k !== "err" && b.cc) errors.push(E("missing return statement", d.body.endP));
    m.body = b.f;
    m.nSlots = cx.max;
  }
  function compileCtor(m) {
    const c = m.cls, d = m.decl;
    const cx = newCtx(c, m, false, "ctor");
    const finals = [...c.fields.values()].filter(f => !f.static && f.final && !(f.decl && f.decl.init) && !f.comp);
    cx.finalFields = new Set(finals);
    const params = [];
    (m.pnames || []).forEach((name, i) => { try { const v = declareVar(cx, name, m.params[i], false, d ? d.p : 0); cx.da.add(v); params.push(v); } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; } });
    const parts = [];
    let body = d ? d.body.body : [];
    // Seit Java 25 (JEP 513) dürfen vor super(...) oder this(...) schon Anweisungen stehen
    const callAt = body.findIndex(s => s.k === "expr" && s.e.k === "ctorcall");
    if (callAt > 0) { const pro = block(body.slice(0, callAt), cx, false); parts.push(pro.f); body = body.slice(callAt); }
    let first = body[0];
    let delegates = false;
    const sup = c.sup ? findCls(c.sup) : null;
    const superCall = (args, pos) => {
      if (!sup || c.kind === "enum" || c.kind === "record") return null;
      if (!sup.ctors.length) return null;
      const sel = resolve(sup.ctors, args, {name:sup.name, p:pos}, sup, C(sup.name), "ctor");
      const sm = sel.m;
      if (sm.priv && sm.cls.top !== c.top) throw E(`${sup.name}(${sm.params.map(tname).join(",")}) has private access in ${sup.name}`, pos);
      for (const tt of sm.throws || []) checkThrown(tt, cx, pos);
      const af = argFns(sel, args);
      if (sm.lib) { const impl = sm.impl; return L => { impl(rt, af(L), c, L[0]); }; }
      return L => { rt.invoke(sm, L[0], af(L)); };
    };
    try {
      if (first && first.k === "expr" && first.e.k === "ctorcall") {
        const cc = first.e;
        const args = cc.args.map(a => { const r = X(a, Object.assign(cx, {st:false})); r.pos = a.p; return r; });
        if (cc.which === "this") {
          const sel = resolve(c.ctors, args, {name:c.name, p:cc.p}, c, C(c.name), "ctor");
          if (sel.m === m) errors.push(E("recursive constructor invocation", d.p));
          const af = argFns(sel, args), tm = sel.m;
          parts.push(L => { rt.invoke(tm, L[0], af(L)); });
          delegates = true;
          for (const f of finals) cx.da.add(f);
        } else {
          if (c.kind === "enum") throw E("call to super not allowed in enum constructor", cc.p);
          const f = superCall(args, cc.p);
          if (f) parts.push(f);
        }
        body = body.slice(1);
      } else if (c.kind !== "record" || !m.canonical) {
        const f = superCall([], d ? d.body.p : c.decl.p);
        if (f) parts.push(f);
      }
    } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
    if (!delegates && c.iinit) { const ii = c.iinit; parts.push(L => { rt.invoke(ii, L[0], []); }); }
    if (c.kind === "record" && (m.canonical || m.compact)) {
      const comps = [...c.fields.values()].filter(f => f.comp);
      if (m.compact && d) { const b = block(body, cx, true); parts.push(b.f); body = []; }
      if (m.canonical || m.compact) parts.push(L => { comps.forEach((f, i) => { L[0].f[f.key] = L[1 + i]; }); });
      for (const f of comps) cx.da.add(f);
    }
    if (body.length) {
      const b = block(body, cx, true);
      parts.push(b.f);
    }
    if (!delegates && finals.length && cx.da !== null) {
      for (const f of finals) if (!cx.da.has(f)) {
        if (m.dflt) errors.push(E(`variable ${f.name} not initialized in the default constructor`, f.decl.p));
        else errors.push(E(`variable ${f.name} might not have been initialized`, d.body.endP));
      }
    }
    const all = seq(parts);
    m.body = all;
    m.nSlots = cx.max;
  }
  for (const c of decls) {
    try { compileClass(c); } catch (e) { if (e instanceof CompileError) errors.push(e); else throw e; }
  }

  /* main suchen: zuerst static void main(String[]), dann die vereinfachten Formen aus Java 25 */
  const target = (publics.length ? K.get(publics[0].name) : null) || implicitCls || decls.find(c => (c.methods.get("main") || []).length && !c.outer) || decls.find(c => !c.outer) || decls[0];
  prog.cls = target;
  if (target) {
    const ms = methodsNamed(target, "main").filter(m => !m.priv && !m.lib);
    const strArr = m => m.params.length === 1 && m.params[0].k === "a" && isStrT(m.params[0].of);
    prog.main = ms.find(m => m.static && strArr(m)) || ms.find(m => m.static && !m.params.length) || ms.find(m => !m.static && strArr(m)) || ms.find(m => !m.static && !m.params.length) || null;
  }
  errors.sort((a, b) => a.pos - b.pos);
  return prog;
}

/* ---------- Fehlertext wie javac ---------- */
function formatErrors(errs, src, file, lang) {
  const de = lang === "de" && JV.de;
  const lines = src.split("\n");
  let out = "";
  const shown = errs.slice(0, 100);
  for (const e of shown) {
    let p = Math.min(Math.max(0, e.pos), src.length);
    let ln = 0, start = 0;
    for (let i = 0; i < p; i++) if (src.charCodeAt(i) === 10) { ln++; start = i + 1; }
    const text = (lines[ln] || "").replace(/\r$/, "");
    const col = p - start;
    const caret = text.slice(0, col).replace(/[^\t]/g, " ") + "^";
    out += `${file}:${ln + 1}: ${de ? de.error : "error"}: ${de ? de.msg(e.msg) : e.msg}\n${text}\n${caret}\n`;
    for (const x of e.extra) out += (de ? de.extra(x) : x) + "\n";
  }
  if (shown.some(e => e.simplified)) out += (de ? de.note : "Note: Some messages have been simplified; recompile with -Xdiags:verbose to get full output") + "\n";
  out += de ? de.count(shown.length) + "\n" : `${shown.length} error${shown.length === 1 ? "" : "s"}\n`;
  return out;
}
function errorList(errs, src) {
  return errs.slice(0, 100).map(e => {
    let ln = 1, col = 0;
    for (let i = 0; i < e.pos && i < src.length; i++) { if (src.charCodeAt(i) === 10) { ln++; col = 0; } else col++; }
    return {line:ln, col, msg:e.msg, hint:hintFor(e)};
  });
}
const RUNTIME_HINTS = {
  "java.lang.ArithmeticException": "Du teilst eine ganze Zahl durch 0. Prüfe den Teiler vorher mit if.",
  "java.lang.ArrayIndexOutOfBoundsException": "Der Index liegt außerhalb des Arrays. Gültig sind die Indizes 0 bis length - 1.",
  "java.lang.StringIndexOutOfBoundsException": "Die Position liegt außerhalb des Textes. Gültig sind 0 bis length() - 1.",
  "java.lang.IndexOutOfBoundsException": "Den Index gibt es in der Liste nicht. Gültig sind 0 bis size() - 1.",
  "java.lang.NullPointerException": "Eine Variable zeigt auf kein Objekt (null). Prüfe, ob sie vorher einen Wert bekommen hat.",
  "java.lang.NumberFormatException": "Der Text lässt sich nicht in eine Zahl umwandeln. Leerzeichen, Buchstaben oder Kommas verhindern das.",
  "java.util.InputMismatchException": "Die Eingabe passt nicht zum erwarteten Typ, zum Beispiel Text statt einer ganzen Zahl.",
  "java.util.NoSuchElementException": "Es gibt keine weitere Eingabe oder kein weiteres Element mehr.",
  "java.lang.ClassCastException": "Das Objekt ist nicht vom Typ, in den du es umwandeln willst. Prüfe vorher mit instanceof.",
  "java.lang.StackOverflowError": "Eine Methode ruft sich ohne Ende selbst auf. Fehlt die Abbruchbedingung der Rekursion?",
  "java.util.ConcurrentModificationException": "Die Liste wurde verändert, während eine for-each-Schleife über sie läuft. Nimm einen Iterator mit remove() oder eine normale for-Schleife.",
  "java.lang.UnsupportedOperationException": "Diese Liste oder Map lässt sich nicht verändern, zum Beispiel weil sie mit List.of erzeugt wurde.",
  "java.lang.NegativeArraySizeException": "Die Größe eines Arrays kann nicht negativ sein.",
  "java.util.IllegalFormatConversionException": "Platzhalter und Wert passen nicht zusammen: %d ist für ganze Zahlen, %f für Kommazahlen, %s für Text.",
  "java.util.MissingFormatArgumentException": "Im Text stehen mehr Platzhalter als Werte übergeben wurden.",
  "java.lang.IllegalArgumentException": "Ein Argument hat einen ungültigen Wert.",
  "java.lang.IllegalStateException": "Das Objekt ist gerade nicht in einem passenden Zustand, zum Beispiel ein geschlossener Scanner."
};

function run(src, opts = {}) {
  const t0 = now();
  const rt = makeRT(opts, null);
  let prog;
  try { prog = compileProgram(src, rt, opts); }
  catch (e) { if (e instanceof CompileError) prog = {errors:[e], file:"Main.java"}; else throw e; }
  const file = prog.file || "Main.java";
  const clsName = prog.cls ? prog.cls.name : "Main";
  const res = {file, cls:clsName, cmd:`javac ${file} && java ${clsName}`};
  if (prog.errors.length) {
    rt.chunks = [];
    rt.add("err", formatErrors(prog.errors, src, file, opts.lang));
    return Object.assign(res, {status:"compile", code:1, out:rt.chunks, errors:errorList(prog.errors, src), ms:now() - t0});
  }
  if (!prog.main) {
    rt.add("err", `Fehler: In der Klasse ${clsName} gibt es keine main-Methode.\nSchreibe zum Beispiel: public static void main(String[] args) { ... }\n`);
    return Object.assign(res, {status:"nomain", code:1, out:rt.chunks, ms:now() - t0});
  }
  rt.t0 = now();
  let status = "ok", code = 0, hint = "";
  try {
    const c = prog.main.cls;
    rt.initClass(c);
    const args = prog.main.params.length ? [new JArr(STR, [])] : [];
    if (prog.main.static) rt.invoke(prog.main, null, args);
    else {
      const ctor = c.ctors.find(m => !m.params.length);
      if (!ctor) throw new Halt("noctor");
      const o = rt.newObj(c, ctor, []);
      rt.invoke(prog.main, o, args);
    }
  } catch (e) {
    let ex = e;
    if (e instanceof RangeError && /call stack/i.test(e.message)) { rt.stack.length = 0; ex = rt.ex("StackOverflowError", null); ex.obj.trace = []; }
    if (ex instanceof JThrow) {
      status = "exception"; code = 1;
      try { rt.chunks.push({k:"err", s:rt.stackText(ex.obj, "Exception in thread \"main\" ")}); }
      catch (e2) { rt.chunks.push({k:"err", s:`Exception in thread "main" ${ex.obj.cls.fq}\n`}); }
      hint = RUNTIME_HINTS[ex.obj.cls.fq] || "";
    } else if (e instanceof Halt) {
      if (e.kind === "exit") { status = "exit"; code = e.data; }
      else if (e.kind === "input") status = "input";
      else if (e.kind === "timeout") status = "timeout";
      else if (e.kind === "outlimit") status = "outlimit";
      else if (e.kind === "noctor") { status = "nomain"; code = 1; }
    } else throw e;
  }
  return Object.assign(res, {status, code, out:rt.chunks, ms:now() - t0, hint});
}
JV.run = run;
JV.formatErrors = formatErrors;
})(typeof self !== "undefined" ? self : globalThis);
