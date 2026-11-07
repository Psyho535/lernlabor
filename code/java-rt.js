/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Java-Übungsterminal, Teil 2: Laufzeit. Werte, Zahlenformate, Hashwerte, Listen, Maps, Zufall und Scanner
   verhalten sich wie im OpenJDK, damit die Ausgaben mit einem echten Java übereinstimmen. */
(function (G) {
"use strict";
const JV = G.JV = G.JV || {};

class JObj { constructor(cls) { this.cls = cls; this.f = {}; this.h = 0; } }
class JArr { constructor(et, a) { this.et = et; this.a = a; this.h = 0; } }
class JBox { constructor(t, v) { this.t = t; this.v = v; } }
class JThrow { constructor(obj) { this.obj = obj; } }
class Halt { constructor(kind, data) { this.kind = kind; this.data = data; } }
const isStr = v => typeof v === "string" || v instanceof String;
Object.assign(JV, {JObj, JArr, JBox, JThrow, Halt, isStr});

/* ---------- Zahlen als Text, wie Double.toString und Float.toString ---------- */
function sciParts(s) {
  // "1.2345e+3" -> ziffern "12345", exponent 3
  const [m, e] = s.split(/e/i);
  return {d:m.replace(".", "").replace(/^-/, ""), e:+e};
}
function layout(neg, d, e) {
  d = d.replace(/0+$/, "") || "0";
  const a = Math.abs(e);
  let s;
  if (e >= -3 && e < 7) {
    if (e >= 0) s = d.slice(0, e + 1).padEnd(e + 1, "0") + "." + (d.slice(e + 1) || "0");
    else s = "0." + "0".repeat(-e - 1) + d;
  } else s = d[0] + "." + (d.slice(1) || "0") + "E" + (e < 0 ? "-" : "") + a;
  return (neg ? "-" : "") + s;
}
function javaDouble(x) {
  if (x !== x) return "NaN";
  if (x === Infinity) return "Infinity";
  if (x === -Infinity) return "-Infinity";
  if (x === 0) return Object.is(x, -0) ? "-0.0" : "0.0";
  const {d, e} = sciParts(Math.abs(x).toExponential());
  return layout(x < 0, d, e);
}
function javaFloat(x) {
  if (x !== x || !isFinite(x) || x === 0) return javaDouble(x);
  const a = Math.abs(x);
  for (let p = 1; p <= 9; p++) {
    const s = a.toExponential(p - 1);
    if (Math.fround(Number(s)) === a) { const {d, e} = sciParts(s); return layout(x < 0, d, e); }
  }
  return javaDouble(x);
}
JV.javaDouble = javaDouble; JV.javaFloat = javaFloat;

/* Dezimal runden wie java.util.Formatter: kürzeste Ziffernfolge, dann HALF_UP */
function decimalDigits(x) {
  const {d, e} = sciParts(Math.abs(x).toExponential());
  return {d, e};
}
function roundHalfUp(digits, keep) {
  // digits: Ziffernstring, keep: Anzahl zu behaltender Ziffern (>= 0). Liefert {d, carry}
  if (keep >= digits.length) return {d:digits.padEnd(keep, "0"), carry:false};
  if (keep < 0) return {d:"", carry:false};
  let head = digits.slice(0, keep);
  const up = digits[keep] >= "5";
  if (!up) return {d:head, carry:false};
  const arr = head.split("").map(Number);
  let i = arr.length - 1;
  while (i >= 0) { if (arr[i] < 9) { arr[i]++; break; } arr[i] = 0; i--; }
  if (i < 0) return {d:"1" + arr.join(""), carry:true};
  return {d:arr.join(""), carry:false};
}
function fixedJava(x, prec) {
  // x endlich, >= 0
  if (x === 0) return prec ? "0." + "0".repeat(prec) : "0";
  let {d, e} = decimalDigits(x);
  // Wert = 0.d * 10^(e+1); Ziffern vor dem Komma: e+1
  const intLen = e + 1;
  const keep = intLen + prec;
  let r;
  if (keep < 0) r = {d:"", carry:false};
  else if (keep === 0) r = d[0] >= "5" ? {d:"1", carry:true} : {d:"", carry:false};
  else r = roundHalfUp(d, keep);
  let digits = r.d, il = intLen + (r.carry ? 1 : 0);
  let ip, fp;
  if (il <= 0) { ip = "0"; fp = ("0".repeat(-il) + digits).padEnd(prec, "0").slice(0, prec); }
  else { ip = digits.slice(0, il).padEnd(il, "0"); fp = digits.slice(il).padEnd(prec, "0").slice(0, prec); }
  ip = ip.replace(/^0+(?=\d)/, "");
  return prec ? ip + "." + fp : ip;
}
function sciJava(x, prec, upper) {
  if (x === 0) return (prec ? "0." + "0".repeat(prec) : "0") + (upper ? "E+00" : "e+00");
  let {d, e} = decimalDigits(x);
  let r = roundHalfUp(d, prec + 1);
  let digits = r.d;
  if (r.carry) { e++; digits = digits.slice(0, prec + 1); }
  const m = digits[0] + (prec ? "." + digits.slice(1).padEnd(prec, "0") : "");
  const ex = (e < 0 ? "-" : "+") + String(Math.abs(e)).padStart(2, "0");
  return m + (upper ? "E" : "e") + ex;
}
JV.fixedJava = fixedJava;

/* ---------- Hashwerte wie im JDK ---------- */
const dv = new DataView(new ArrayBuffer(8));
function strHash(s) { s = String(s); let h = 0; for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; return h; }
function longHash(v) { return Number(BigInt.asIntN(32, v ^ (BigInt.asUintN(64, v) >> 32n))); }
function doubleBits(x) { dv.setFloat64(0, x); return BigInt.asIntN(64, dv.getBigUint64(0)); }
function doubleHash(x) { if (x !== x) x = NaN; return longHash(doubleBits(x)); }
function floatHash(x) { dv.setFloat32(0, x); return dv.getInt32(0); }
JV.strHash = strHash;

/* ---------- Formatter (String.format, printf) mit Locale en_US ---------- */
const FMT = /%(\d+\$)?([-#+ 0,(<]*)?(\d+)?(\.\d+)?([a-zA-Z%])/g;
function group(intStr) { return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function format(rt, fmt, args) {
  fmt = String(fmt);
  let out = "", last = 0, ord = 0, m;
  FMT.lastIndex = 0;
  const unknownAt = idx => {
    const rest = fmt.slice(idx + 1);
    throw rt.ex("UnknownFormatConversionException", `Conversion = '${rest[0] === undefined ? "%" : rest[0]}'`);
  };
  // Wie java.util.Formatter: erst den ganzen Formattext prüfen, dann schreiben
  let pe = 0;
  for (let mm; (mm = FMT.exec(fmt)) !== null; pe = FMT.lastIndex) {
    const stray = fmt.slice(pe, mm.index).indexOf("%");
    if (stray >= 0) unknownAt(pe + stray);
    if (!"bBhHsScCdoxXeEfgGn%".includes(mm[5])) unknownAt(mm.index + mm[0].length - 2);
  }
  if (fmt.slice(pe).includes("%")) unknownAt(pe + fmt.slice(pe).indexOf("%"));
  FMT.lastIndex = 0;
  try {
  while ((m = FMT.exec(fmt)) !== null) {
    const between = fmt.slice(last, m.index);
    const stray = between.indexOf("%");
    if (stray >= 0) unknownAt(last + stray);
    out += between;
    last = FMT.lastIndex;
    const [spec, idxS, flagsS = "", widthS, precS, conv] = m;
    const flags = flagsS, width = widthS ? +widthS : 0, prec = precS ? +precS.slice(1) : -1;
    if (conv === "n") { out += "\n"; continue; }
    if (conv === "%") { out += pad("%", width, flags.includes("-"), false); continue; }
    let arg;
    if (flags.includes("<")) arg = args[ord - 1];
    else if (idxS) { const k = parseInt(idxS) - 1; if (k >= args.length) throw rt.ex("MissingFormatArgumentException", `Format specifier '${spec}'`); arg = args[k]; }
    else { if (ord >= args.length) throw rt.ex("MissingFormatArgumentException", `Format specifier '${spec}'`); arg = args[ord++]; }
    const lc = conv.toLowerCase(), upper = conv !== lc;
    const badConv = () => { throw rt.ex("IllegalFormatConversionException", `${lc} != ${rt.javaClassName(arg)}`); };
    let s;
    switch (lc) {
      case "s": s = arg === null ? "null" : rt.toStr(arg); if (prec >= 0) s = s.slice(0, prec); break;
      case "b": s = arg === null ? "false" : (arg instanceof JBox && arg.t === "Boolean") ? String(arg.v) : "true"; if (prec >= 0) s = s.slice(0, prec); break;
      case "h": s = arg === null ? "null" : (rt.hash(arg) >>> 0).toString(16); break;
      case "c":
        if (arg === null) s = "null";
        else if (arg instanceof JBox && arg.t === "Character") s = String.fromCharCode(arg.v);
        else if (arg instanceof JBox && (arg.t === "Integer" || arg.t === "Short" || arg.t === "Byte")) s = String.fromCodePoint(arg.v);
        else badConv();
        break;
      case "d": case "x": case "o": {
        if (arg === null) { s = "null"; break; }
        if (!(arg instanceof JBox) || !["Integer", "Long", "Short", "Byte"].includes(arg.t)) badConv();
        if (prec >= 0) throw rt.ex("IllegalFormatPrecisionException", String(prec));
        let v = arg.t === "Long" ? arg.v : BigInt(arg.v);
        if (lc === "d") {
          const neg = v < 0n;
          let digits = (neg ? -v : v).toString();
          if (flags.includes(",")) digits = group(digits);
          s = signed(digits, neg, flags, width);
        } else {
          const bits = arg.t === "Long" ? 64 : arg.t === "Short" ? 16 : arg.t === "Byte" ? 8 : 32;
          if (v < 0n) v = BigInt.asUintN(bits, v);
          s = v.toString(lc === "x" ? 16 : 8);
          if (flags.includes("#")) s = (lc === "x" ? "0x" : "0") + s;
          if (flags.includes("0") && width > s.length) s = s.padStart(width, "0");
        }
        break;
      }
      case "f": case "e": case "g": {
        if (arg === null) { s = "null"; break; }
        if (!(arg instanceof JBox) || !["Double", "Float"].includes(arg.t)) badConv();
        const x = arg.v;
        if (x !== x || !isFinite(x)) { s = x !== x ? "NaN" : (x < 0 ? (flags.includes("(") ? "(Infinity)" : "-Infinity") : (flags.includes("+") ? "+Infinity" : "Infinity")); break; }
        const neg = x < 0 || Object.is(x, -0), a = Math.abs(x);
        let body;
        const p = prec < 0 ? 6 : prec;
        if (lc === "f") { body = fixedJava(a, p); if (flags.includes(",")) { const [i, f] = body.split("."); body = group(i) + (f !== undefined ? "." + f : ""); } }
        else if (lc === "e") body = sciJava(a, p, false);
        else {
          const pp = p === 0 ? 1 : p;
          const r = a === 0 ? 0 : Number(a.toPrecision(pp));
          if (r !== 0 && (r < 1e-4 || r >= Math.pow(10, pp))) body = sciJava(a, pp - 1, false);
          else body = fixedJava(a, Math.max(0, pp - 1 - (r === 0 ? 0 : Math.floor(Math.log10(r)))));
        }
        s = signed(body, neg, flags, width);
        break;
      }
      default: unknownAt(m.index + spec.length - 2);
    }
    if (upper) s = s.toUpperCase();
    out += pad(s, width, flags.includes("-"), false);
  }
  } catch (e) { if (e instanceof JThrow) e.partial = out; throw e; }
  const tail = fmt.slice(last);
  const stray = tail.indexOf("%");
  if (stray >= 0) unknownAt(last + stray);
  return out + tail;
}
function signed(digits, neg, flags, width) {
  let pre = neg ? "-" : flags.includes("+") ? "+" : flags.includes(" ") ? " " : "";
  let post = "";
  if (neg && flags.includes("(")) { pre = "("; post = ")"; }
  if (flags.includes("0") && width > pre.length + digits.length + post.length) digits = digits.padStart(width - pre.length - post.length, "0");
  return pre + digits + post;
}
function pad(s, width, left) { if (s.length >= width) return s; return left ? s.padEnd(width) : s.padStart(width); }
JV.format = format;

/* ---------- Listen und Maps ---------- */
class JList extends JObj { constructor(cls, a = [], ro = 0) { super(cls); this.a = a; this.mod = 0; this.ro = ro; } }
class HNode { constructor(h, k, v, next) { this.h = h; this.k = k; this.v = v; this.next = next; } }
/* HashMap mit derselben Bucket-Reihenfolge wie java.util.HashMap (Startgröße 16, Ladefaktor 0,75) */
class JMap extends JObj {
  constructor(cls, rt, kind = "hash") { super(cls); this.rt = rt; this.kind = kind; this.tab = null; this.size = 0; this.thr = 0; this.mod = 0; this.ord = kind === "linked" ? [] : null; this.sorted = kind === "tree" ? [] : null; this.ro = false; }
  spread(k) { const h = k === null ? 0 : this.rt.hash(k); return h ^ (h >>> 16); }
  resize() {
    const old = this.tab, oldCap = old ? old.length : 0;
    const cap = oldCap ? oldCap * 2 : 16;
    this.thr = Math.floor(cap * 0.75);
    const tab = new Array(cap).fill(null);
    if (old) for (let j = 0; j < oldCap; j++) {
      let e = old[j];
      if (!e) continue;
      let loH = null, loT = null, hiH = null, hiT = null;
      while (e) {
        const nx = e.next;
        e.next = null;
        if ((e.h & oldCap) === 0) { if (loT) loT.next = e; else loH = e; loT = e; }
        else { if (hiT) hiT.next = e; else hiH = e; hiT = e; }
        e = nx;
      }
      tab[j] = loH; tab[j + oldCap] = hiH;
    }
    this.tab = tab;
  }
  find(k) {
    if (this.kind === "tree") { const i = this.tIndex(k); return i.found ? this.sorted[i.i] : null; }
    if (!this.tab) return null;
    const h = this.spread(k);
    for (let e = this.tab[h & (this.tab.length - 1)]; e; e = e.next) if (e.h === h && this.rt.equals(e.k, k)) return e;
    return null;
  }
  tIndex(k) {
    const a = this.sorted;
    if (k === null) throw this.rt.ex("NullPointerException", null);
    let lo = 0, hi = a.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1, c = this.rt.compare(a[mid].k, k);
      if (c === 0) return {found:true, i:mid};
      if (c < 0) lo = mid + 1; else hi = mid - 1;
    }
    return {found:false, i:lo};
  }
  put(k, v) {
    if (this.ro) throw this.rt.ex("UnsupportedOperationException", null);
    if (this.kind === "tree") {
      if (!this.sorted.length) this.rt.compare(k, k);
      const r = this.tIndex(k);
      if (r.found) { const old = this.sorted[r.i].v; this.sorted[r.i].v = v; return old; }
      this.sorted.splice(r.i, 0, new HNode(0, k, v, null)); this.size++; this.mod++;
      return null;
    }
    if (!this.tab) this.resize();
    const h = this.spread(k), n = this.tab.length, i = h & (n - 1);
    let e = this.tab[i], count = 0;
    if (!e) this.tab[i] = new HNode(h, k, v, null);
    else {
      for (;;) {
        if (e.h === h && this.rt.equals(e.k, k)) { const old = e.v; e.v = v; return old; }
        if (!e.next) break;
        e = e.next; count++;
      }
      const node = new HNode(h, k, v, null);
      e.next = node;
      if (count + 1 >= 7 && n < 64) { this.mod++; this.size++; if (this.ord) this.ord.push(node); this.resize(); if (this.size > this.thr) this.resize(); return null; }
    }
    const node = this.ord ? this.find(k) : null;
    if (this.ord) this.ord.push(node);
    this.mod++;
    if (++this.size > this.thr) this.resize();
    return null;
  }
  remove(k) {
    if (this.ro) throw this.rt.ex("UnsupportedOperationException", null);
    if (this.kind === "tree") { const r = this.tIndex(k); if (!r.found) return null; const [n] = this.sorted.splice(r.i, 1); this.size--; this.mod++; return n; }
    if (!this.tab) return null;
    const h = this.spread(k), i = h & (this.tab.length - 1);
    let e = this.tab[i], prev = null;
    while (e) {
      if (e.h === h && this.rt.equals(e.k, k)) {
        if (prev) prev.next = e.next; else this.tab[i] = e.next;
        this.size--; this.mod++;
        if (this.ord) this.ord.splice(this.ord.indexOf(e), 1);
        return e;
      }
      prev = e; e = e.next;
    }
    return null;
  }
  clear() { if (this.ro) throw this.rt.ex("UnsupportedOperationException", null); if (this.tab) this.tab.fill(null); if (this.ord) this.ord.length = 0; if (this.sorted) this.sorted.length = 0; if (this.size) this.mod++; this.size = 0; }
  nodes() {
    if (this.kind === "tree") return this.sorted.slice();
    if (this.ord) return this.ord.slice();
    const r = [];
    if (this.tab) for (const b of this.tab) for (let e = b; e; e = e.next) r.push(e);
    return r;
  }
}
/* Sichten auf eine Map: keySet, values, entrySet. Sie bleiben mit der Map verbunden. */
class JView extends JObj { constructor(cls, map, kind) { super(cls); this.map = map; this.kind = kind; } }
class JSet extends JObj { constructor(cls, map) { super(cls); this.map = map; } }
class JEntry extends JObj { constructor(cls, node, map) { super(cls); this.node = node; this.map = map; } }
class JBuilder extends JObj { constructor(cls, s = "") { super(cls); this.s = s; } }
Object.assign(JV, {JList, JMap, JView, JSet, JEntry, JBuilder, HNode});

/* ---------- java.util.Random, gleicher Algorithmus wie im JDK ---------- */
const MASK48 = (1n << 48n) - 1n;
class JRandom extends JObj {
  constructor(cls, seed) { super(cls); this.setSeed(seed); }
  setSeed(seed) { this.seed = (BigInt.asIntN(64, seed) ^ 0x5DEECE66Dn) & MASK48; }
  next(bits) { this.seed = (this.seed * 0x5DEECE66Dn + 0xBn) & MASK48; return Number(BigInt.asIntN(32, this.seed >> BigInt(48 - bits))); }
  nextInt() { return this.next(32); }
  nextIntBound(rt, bound) {
    if (bound <= 0) throw rt.ex("IllegalArgumentException", "bound must be positive");
    let r = this.next(31);
    const m = bound - 1;
    if ((bound & m) === 0) return Number((BigInt(bound) * BigInt(r)) >> 31n);
    for (let u = r; ((u - (r = u % bound) + m) | 0) < 0; u = this.next(31));
    return r;
  }
  nextIntRange(rt, origin, bound) {
    if (origin >= bound) throw rt.ex("IllegalArgumentException", "bound must be greater than origin");
    let r = this.nextInt();
    const n = (bound - origin) | 0, m = (n - 1) | 0;
    if ((n & m) === 0) return ((r & m) + origin) | 0;
    if (n > 0) {
      for (let u = r >>> 1; ((u + m - (r = u % n)) | 0) < 0; u = this.nextInt() >>> 1);
      return (r + origin) | 0;
    }
    while (r < origin || r >= bound) r = this.nextInt();
    return r;
  }
  nextDouble() { return (this.next(26) * 134217728 + this.next(27)) * Math.pow(2, -53); }
  nextBoolean() { return this.next(1) !== 0; }
  nextLong() { return BigInt.asIntN(64, (BigInt(this.next(32)) << 32n) + BigInt(this.next(32))); }
}
JV.JRandom = JRandom;

/* ---------- Scanner: liest Zeile für Zeile, die Eingaben kommen aus dem Terminal ---------- */
const WS = /[\s\u0085\u001C-\u001F]/;
class JScanner extends JObj {
  constructor(cls, rt, text) { super(cls); this.rt = rt; this.std = text === undefined; this.buf = this.std ? "" : String(text); this.pos = 0; this.closed = false; }
  fill() {
    if (!this.std) return false;
    const line = this.rt.readLine();
    if (line === null) return false;
    this.buf = this.buf.slice(this.pos) + line + "\n";
    this.pos = 0;
    return true;
  }
  check() { if (this.closed) throw this.rt.ex("IllegalStateException", "Scanner closed"); }
  peekToken() {
    this.check();
    for (;;) {
      while (this.pos < this.buf.length && WS.test(this.buf[this.pos])) this.pos++;
      if (this.pos < this.buf.length) break;
      if (!this.fill()) return null;
    }
    let j = this.pos;
    for (;;) {
      while (j < this.buf.length && !WS.test(this.buf[j])) j++;
      if (j < this.buf.length) break;
      const off = j - this.pos;
      if (!this.fill()) break;
      j = off;
    }
    return {tok:this.buf.slice(this.pos, j), end:j};
  }
  next() { const t = this.peekToken(); if (!t) throw this.rt.ex("NoSuchElementException", null); this.pos = t.end; return this.rt.S(t.tok); }
  nextTyped(test, parse) {
    const t = this.peekToken();
    if (!t) throw this.rt.ex("NoSuchElementException", null);
    if (!test(t.tok)) throw this.rt.ex("InputMismatchException", null);
    const v = parse(t.tok);
    this.pos = t.end;
    return v;
  }
  hasNext(test) { const t = this.peekToken(); return !!t && (!test || test(t.tok)); }
  nextLine() {
    this.check();
    if (this.pos >= this.buf.length && !this.fill()) throw this.rt.ex("NoSuchElementException", "No line found");
    let j = this.buf.indexOf("\n", this.pos);
    while (j < 0) { const off = this.buf.length - this.pos; if (!this.fill()) break; j = this.buf.indexOf("\n", off); }
    if (j < 0) { const s = this.buf.slice(this.pos); this.pos = this.buf.length; return this.rt.S(s); }
    let s = this.buf.slice(this.pos, j);
    if (s.endsWith("\r")) s = s.slice(0, -1);
    this.pos = j + 1;
    return this.rt.S(s);
  }
  hasNextLine() { this.check(); if (this.pos < this.buf.length) return true; return this.fill(); }
}
JV.JScanner = JScanner;
const INT_RE = /^[+-]?(\d+|\d{1,3}(,\d{3})+)$/;
const DBL_RE = /^[+-]?((\d+|\d{1,3}(,\d{3})+)(\.\d*)?|\.\d+)([eE][+-]?\d+)?$|^[+-]?(NaN|Infinity)$/;
JV.INT_RE = INT_RE; JV.DBL_RE = DBL_RE;

/* ---------- String.split nach Java-Regeln ---------- */
function jsRegex(rt, re, flags = "g") {
  try { return new RegExp(String(re), flags); }
  catch (e) { throw rt.ex("PatternSyntaxException", `${e.message.replace(/^Invalid regular expression: /, "")}`); }
}
function split(rt, s, re, limit = 0) {
  s = String(s);
  const R = jsRegex(rt, re), res = [];
  let idx = 0, m;
  while ((m = R.exec(s)) !== null) {
    if (m[0].length === 0) {
      if (m.index === 0 || m.index >= s.length) { R.lastIndex++; if (m.index >= s.length) break; continue; }
    }
    if (limit > 0 && res.length === limit - 1) break;
    res.push(s.slice(idx, m.index));
    idx = m.index + m[0].length;
    if (m[0].length === 0) R.lastIndex++;
  }
  if (!res.length) return [s];
  res.push(s.slice(idx));
  if (limit === 0) while (res.length && res[res.length - 1] === "") res.pop();
  return res;
}
JV.split = split; JV.jsRegex = jsRegex;
JV.hashes = {strHash, longHash, doubleHash, floatHash, doubleBits};
})(typeof self !== "undefined" ? self : globalThis);
