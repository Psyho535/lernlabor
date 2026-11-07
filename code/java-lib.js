/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Java-Übungsterminal, Teil 3: Typen und die Standardbibliothek, soweit sie für die Grundlagen gebraucht wird.
   Jede Methode hat dieselbe Signatur wie im JDK, damit Überladungen und Typfehler genauso erkannt werden. */
(function (G) {
"use strict";
const JV = G.JV;
const {JObj, JArr, JBox, isStr, JList, JMap, JView, JSet, JEntry, JBuilder, JRandom, JScanner, javaDouble, javaFloat, format, split, jsRegex, hashes, INT_RE, DBL_RE} = JV;

/* ---------- Typen ---------- */
const P = n => ({k:"p", n});
const T = {int:P("int"), long:P("long"), double:P("double"), float:P("float"), boolean:P("boolean"), char:P("char"), byte:P("byte"), short:P("short"), void:{k:"void"}, null:{k:"null"}, err:{k:"err"}};
const C = (n, args = null) => ({k:"c", n, args});
const A = of => ({k:"a", of});
const TV = n => ({k:"v", n});
const BOX = {int:"Integer", long:"Long", double:"Double", float:"Float", char:"Character", boolean:"Boolean", byte:"Byte", short:"Short"};
const UNBOX = Object.fromEntries(Object.entries(BOX).map(([a, b]) => [b, a]));
function tname(t) {
  switch (t.k) {
    case "p": return t.n;
    case "c": return (JV.displayName ? JV.displayName(t.n) : t.n) + (t.args && t.args.length ? "<" + t.args.map(tname).join(",") + ">" : "");
    case "a": return tname(t.of) + "[]";
    case "v": return t.n;
    case "null": return "<null>";
    case "void": return "void";
    default: return "?";
  }
}
function erase(t) { return t.k === "v" ? "Object" : t.k === "c" ? t.n : t.k === "a" ? erase(t.of) + "[]" : t.k === "p" ? t.n : "Object"; }
Object.assign(JV, {P, T, C, A, TV, BOX, UNBOX, tname, erase});

class ClassInfo {
  constructor(name, o = {}) {
    this.name = name; this.fq = o.fq || name; this.pkg = o.pkg || "";
    this.kind = o.kind || "class";
    this.sup = o.sup !== undefined ? o.sup : (name === "Object" || this.kind === "interface" ? null : "Object");
    this.ifaces = o.ifaces || []; this.tparams = o.tparams || [];
    this.fields = new Map(); this.methods = new Map(); this.ctors = [];
    this.lib = !!o.lib; this.abstract = !!o.abstract || this.kind === "interface"; this.final = !!o.final;
    this.vt = null; this.inited = !!o.lib; this.statics = Object.create(null);
    this.outer = null; this.inner = false; this.nested = new Map();
  }
}
JV.ClassInfo = ClassInfo;

function splitTop(s) {
  const out = [];
  let d = 0, cur = "";
  for (const ch of s) {
    if (ch === "<") d++;
    if (ch === ">") d--;
    if (ch === "," && !d) { out.push(cur); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
function sigType(s, tv) {
  s = s.trim();
  let dims = 0;
  while (s.endsWith("[]")) { s = s.slice(0, -2); dims++; }
  let t;
  const lt = s.indexOf("<");
  if (lt >= 0) t = C(s.slice(0, lt), splitTop(s.slice(lt + 1, -1)).map(x => sigType(x, tv)));
  else if (T[s]) t = T[s];
  else if (tv.includes(s)) t = TV(s);
  else t = C(s);
  while (dims--) t = A(t);
  return t;
}
function parseSig(str, ctp) {
  let s = str.trim(), stat = false, mtv = [];
  if (s.startsWith("static ")) { stat = true; s = s.slice(7).trim(); }
  if (s.startsWith("<")) { const e = s.indexOf(">"); mtv = s.slice(1, e).split(",").map(x => x.trim()); s = s.slice(e + 1).trim(); }
  const po = s.indexOf("("), head = s.slice(0, po).trim(), params = s.slice(po + 1, s.lastIndexOf(")")).trim();
  const tv = [...ctp, ...mtv], sp = head.lastIndexOf(" ");
  let ret = null, name;
  if (sp < 0) name = head;
  else { ret = sigType(head.slice(0, sp), tv); name = head.slice(sp + 1); }
  let varargs = false;
  const ps = params ? splitTop(params).map(p => {
    p = p.trim();
    if (p.endsWith("...")) { varargs = true; return A(sigType(p.slice(0, -3), tv)); }
    return sigType(p, tv);
  }) : [];
  return {stat, mtv, ret, name, params:ps, varargs};
}
const LIB = Object.create(null);
JV.LIB = LIB;
function sigKey(name, params) { return name + "(" + params.map(erase).join(",") + ")"; }
JV.sigKey = sigKey;
function lib(name, o, members = {}) {
  const c = LIB[name] || (LIB[name] = new ClassInfo(name, Object.assign({lib:true}, o)));
  for (const [key, val] of Object.entries(members)) {
    if (!key.includes("(")) {
      const parts = key.trim().split(/\s+/), fname = parts.pop(), type = sigType(parts.filter(x => x !== "static" && x !== "final").join(" "), c.tparams);
      c.fields.set(fname, {name:fname, t:type, static:parts.includes("static"), final:parts.includes("final"), cls:c, key:fname, lib:true, value:val});
      if (parts.includes("static")) c.statics[fname] = typeof val === "function" ? undefined : val;
      continue;
    }
    for (const one of key.split(";")) {
      const s = parseSig(one, c.tparams);
      const m = {name:s.name, cls:c, params:s.params, ret:s.ret, static:s.stat, varargs:s.varargs, mtv:s.mtv, impl:val, lib:true, sig:sigKey(s.name, s.params), abstract:false};
      if (s.name === "new") { m.isCtor = true; m.ret = T.void; c.ctors.push(m); continue; }
      if (!c.methods.has(s.name)) c.methods.set(s.name, []);
      c.methods.get(s.name).push(m);
    }
  }
  return c;
}
JV.lib = lib;

/* ---------- Hilfen für die Implementierungen ---------- */
const s$ = v => typeof v === "string" ? v : v.valueOf();
const oob = (rt, i, len, ex = "IndexOutOfBoundsException") => { throw rt.ex(ex, `Index ${i} out of bounds for length ${len}`); };
const isWs = c => c <= 32;
const jTrim = s => { let a = 0, b = s.length; while (a < b && isWs(s.charCodeAt(a))) a++; while (b > a && isWs(s.charCodeAt(b - 1))) b--; return s.slice(a, b); };
const JAVA_WS = /[\t\n\u000B\f\r\u001C-\u001F\p{Zs}\p{Zl}\p{Zp}]/u;
const isJavaWs = c => JAVA_WS.test(c) && c !== " " && c !== " " && c !== " ";
const javaStrip = s => { let a = 0, b = s.length; while (a < b && isJavaWs(s[a])) a++; while (b > a && isJavaWs(s[b - 1])) b--; return s.slice(a, b); };
function cmpStr(a, b) {
  a = s$(a); b = s$(b);
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) { const d = a.charCodeAt(i) - b.charCodeAt(i); if (d) return d; }
  return a.length - b.length;
}
const fold = c => String.fromCharCode(c).toUpperCase().length === 1 ? String.fromCharCode(c).toUpperCase().toLowerCase().charCodeAt(0) : c;
function cmpIgnoreCase(a, b) {
  a = s$(a); b = s$(b);
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    let x = a.charCodeAt(i), y = b.charCodeAt(i);
    if (x !== y) { x = fold(x); y = fold(y); if (x !== y) return x - y; }
  }
  return a.length - b.length;
}
JV.cmpStr = cmpStr;
function parseIntJava(rt, s, radix, bits) {
  if (s === null) throw rt.ex("NumberFormatException", "Cannot parse null string: null");
  s = s$(s);
  const suffix = radix === 10 ? "" : ` under radix ${radix}`;
  const bad = () => { throw rt.ex("NumberFormatException", `For input string: "${s}"${suffix}`); };
  if (radix < 2 || radix > 36) throw rt.ex("NumberFormatException", `radix ${radix} ${radix < 2 ? "less than Character.MIN_RADIX" : "greater than Character.MAX_RADIX"}`);
  if (!s.length) bad();
  let i = 0, neg = false;
  if (s[0] === "-" || s[0] === "+") { neg = s[0] === "-"; i = 1; if (s.length === 1) bad(); }
  let v = 0n;
  const R = BigInt(radix);
  for (; i < s.length; i++) {
    const d = digitOf(s.charCodeAt(i), radix);
    if (d < 0) bad();
    v = v * R + BigInt(d);
  }
  if (neg) v = -v;
  const lim = 1n << BigInt(bits - 1);
  if (v >= lim || v < -lim) bad();
  return bits === 64 ? v : Number(v);
}
function digitOf(c, radix) {
  let d = -1;
  const ch = String.fromCharCode(c);
  if (c >= 48 && c <= 57) d = c - 48;
  else if (c >= 97 && c <= 122) d = c - 87;
  else if (c >= 65 && c <= 90) d = c - 55;
  else if (/\p{Nd}/u.test(ch)) { const m = ch.normalize("NFKD"); d = /^\d$/.test(m) ? +m : -1; }
  return d < radix ? d : -1;
}
function parseDoubleJava(rt, s) {
  if (s === null) throw rt.ex("NullPointerException", null);
  s = s$(s);
  const t = jTrim(s);
  if (!t.length) throw rt.ex("NumberFormatException", "empty String");
  if (!/^[+-]?(NaN|Infinity|((\d+\.?\d*|\.\d+)([eE][+-]?\d+)?)[fFdD]?)$/.test(t)) throw rt.ex("NumberFormatException", `For input string: "${s}"`);
  return Number(t.replace(/[fFdD]$/, ""));
}
const toRadix = (v, r) => v.toString(r);
const unsigned = (v, bits) => bits === 64 ? BigInt.asUintN(64, v) : (v >>> 0);
const charStr = c => String.fromCharCode(c);
const upperChar = c => { const u = charStr(c).toUpperCase(); return u.length === 1 ? u.charCodeAt(0) : c; };
const lowerChar = c => { const u = charStr(c).toLowerCase(); return u.length === 1 ? u.charCodeAt(0) : c; };
const CH = {
  digit: c => /\p{Nd}/u.test(charStr(c)),
  letter: c => /\p{L}/u.test(charStr(c)),
  upper: c => /\p{Uppercase}/u.test(charStr(c)),
  lower: c => /\p{Lowercase}/u.test(charStr(c)),
  ws: c => isJavaWs(charStr(c)),
  alpha: c => /\p{Alphabetic}/u.test(charStr(c))
};
function numericValue(c) {
  if (c >= 48 && c <= 57) return c - 48;
  if (c >= 97 && c <= 122) return c - 87;
  if (c >= 65 && c <= 90) return c - 55;
  const ch = charStr(c);
  if (/\p{Nd}/u.test(ch)) { const m = ch.normalize("NFKD"); return /^\d$/.test(m) ? +m : -1; }
  return -1;
}
function boxNum(b) { return b.t === "Long" ? Number(b.v) : b.v; }
function arrToString(rt, arr, et) {
  if (arr === null) return rt.S("null");
  const parts = arr.a.map(v => et ? rt.primStr(v, et) : rt.toStr(v));
  return rt.S("[" + parts.join(", ") + "]");
}
function needArr(rt, a) { if (a === null) throw rt.ex("NullPointerException", null); return a; }
const dblCmp = (a, b) => a < b ? -1 : a > b ? 1 : (Object.is(a, b) ? 0 : (a !== a ? (b !== b ? 0 : 1) : b !== b ? -1 : (Object.is(a, -0) ? -1 : 1)));
JV.dblCmp = dblCmp;
function rangeChk(rt, len, from, to) {
  if (from > to) throw rt.ex("IllegalArgumentException", `fromIndex(${from}) > toIndex(${to})`);
  if (from < 0) throw rt.ex("ArrayIndexOutOfBoundsException", `Array index out of range: ${from}`);
  if (to > len) throw rt.ex("ArrayIndexOutOfBoundsException", `Array index out of range: ${to}`);
}

/* ---------- java.lang ---------- */
const L = {pkg:"java.lang"};
const U = {pkg:"java.util"};
lib("Object", Object.assign({fq:"java.lang.Object"}, L), {
  "new()": (rt, a, cls, self) => self || new JObj(cls),
  "String toString()": (o, a, rt) => rt.S(rt.defaultToString(o)),
  "boolean equals(Object)": (o, [x]) => o === x,
  "int hashCode()": (o, a, rt) => rt.idHash(o),
  "Class getClass()": (o, a, rt) => rt.classObj(o)
});
lib("Class", Object.assign({fq:"java.lang.Class", final:true, tparams:["T"]}, L), {
  "String getName()": (o, a, rt) => rt.S(o.info.name),
  "String getSimpleName()": (o, a, rt) => rt.S(o.info.simple),
  "String toString()": (o, a, rt) => rt.S((o.info.iface ? "interface " : "class ") + o.info.name)
});
lib("Comparable", Object.assign({fq:"java.lang.Comparable", kind:"interface", tparams:["T"]}, L), {
  "int compareTo(T)": (o, [x], rt) => rt.compare(o, x)
});
lib("CharSequence", Object.assign({fq:"java.lang.CharSequence", kind:"interface"}, L), {
  "int length()": (o, a, rt) => isStr(o) ? o.length : o.s.length,
  "char charAt(int)": (o, [i], rt) => { const s = isStr(o) ? s$(o) : o.s; if (i < 0 || i >= s.length) oob(rt, i, s.length, "StringIndexOutOfBoundsException"); return s.charCodeAt(i); },
  "boolean isEmpty()": (o) => (isStr(o) ? o.length : o.s.length) === 0
});
lib("Iterable", Object.assign({fq:"java.lang.Iterable", kind:"interface", tparams:["T"]}, L), {
  "Iterator<T> iterator()": (o, a, rt) => rt.iterator(o)
});
lib("AutoCloseable", Object.assign({fq:"java.lang.AutoCloseable", kind:"interface"}, L), {"void close()": () => {}});

const strMethods = {
  "new()": (rt) => rt.S(""),
  "new(String)": (rt, [s]) => { if (s === null) throw rt.ex("NullPointerException", null); return rt.S(s$(s)); },
  "new(char[])": (rt, [a]) => rt.S(needArr(rt, a).a.map(charStr).join("")),
  "new(char[],int,int)": (rt, [a, off, n]) => { needArr(rt, a); if (off < 0 || n < 0 || off + n > a.a.length) throw rt.ex("StringIndexOutOfBoundsException", `offset ${off}, count ${n}, length ${a.a.length}`); return rt.S(a.a.slice(off, off + n).map(charStr).join("")); },
  "int length()": s => s.length,
  "char charAt(int)": (s, [i], rt) => { if (i < 0 || i >= s.length) throw rt.ex("StringIndexOutOfBoundsException", `Index ${i} out of bounds for length ${s.length}`); return s$(s).charCodeAt(i); },
  "boolean isEmpty()": s => s.length === 0,
  "boolean isBlank()": s => javaStrip(s$(s)).length === 0,
  "String substring(int)": (s, [b], rt) => { const n = s.length; if (b < 0 || b > n) throw rt.ex("StringIndexOutOfBoundsException", `begin ${b}, end ${n}, length ${n}`); return b === 0 ? s : rt.S(s$(s).slice(b)); },
  "String substring(int,int)": (s, [b, e], rt) => { const n = s.length; if (b < 0 || b > e || e > n) throw rt.ex("StringIndexOutOfBoundsException", `Range [${b}, ${e}) out of bounds for length ${n}`); return b === 0 && e === n ? s : rt.S(s$(s).slice(b, e)); },
  "int indexOf(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).indexOf(s$(x)); },
  "int indexOf(int)": (s, [c]) => s$(s).indexOf(String.fromCodePoint(c)),
  "int indexOf(String,int)": (s, [x, f], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).indexOf(s$(x), Math.max(0, f)); },
  "int indexOf(int,int)": (s, [c, f]) => s$(s).indexOf(String.fromCodePoint(c), Math.max(0, f)),
  "int lastIndexOf(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).lastIndexOf(s$(x)); },
  "int lastIndexOf(int)": (s, [c]) => s$(s).lastIndexOf(String.fromCodePoint(c)),
  "boolean contains(CharSequence)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).includes(rt.toStr(x)); },
  "boolean startsWith(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).startsWith(s$(x)); },
  "boolean startsWith(String,int)": (s, [x, i]) => i >= 0 && s$(s).startsWith(s$(x), i),
  "boolean endsWith(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return s$(s).endsWith(s$(x)); },
  "boolean equals(Object)": (s, [x]) => isStr(x) && s$(s) === s$(x),
  "boolean equalsIgnoreCase(String)": (s, [x]) => x !== null && s.length === x.length && cmpIgnoreCase(s, x) === 0,
  "int compareTo(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return cmpStr(s, x); },
  "int compareToIgnoreCase(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return cmpIgnoreCase(s, x); },
  "String toUpperCase()": (s, a, rt) => { const u = s$(s).toUpperCase(); return u === s$(s) ? s : rt.S(u); },
  "String toLowerCase()": (s, a, rt) => { const u = s$(s).toLowerCase(); return u === s$(s) ? s : rt.S(u); },
  "String trim()": (s, a, rt) => { const t = jTrim(s$(s)); return t.length === s.length ? s : rt.S(t); },
  "String strip()": (s, a, rt) => { const t = javaStrip(s$(s)); return t.length === s.length ? s : rt.S(t); },
  "String stripLeading()": (s, a, rt) => { let i = 0; const v = s$(s); while (i < v.length && isJavaWs(v[i])) i++; return i ? rt.S(v.slice(i)) : s; },
  "String stripTrailing()": (s, a, rt) => { const v = s$(s); let i = v.length; while (i > 0 && isJavaWs(v[i - 1])) i--; return i < v.length ? rt.S(v.slice(0, i)) : s; },
  "String replace(char,char)": (s, [a, b], rt) => { const v = s$(s); if (!v.includes(charStr(a)) || a === b) return s; return rt.S(v.split(charStr(a)).join(charStr(b))); },
  "String replace(CharSequence,CharSequence)": (s, [a, b], rt) => { if (a === null || b === null) throw rt.ex("NullPointerException", null); const v = s$(s), x = rt.toStr(a); if (!v.includes(x)) return s; return rt.S(x === "" ? v.split("").join(rt.toStr(b)).replace(/^/, rt.toStr(b)) + rt.toStr(b) : v.split(x).join(rt.toStr(b))); },
  "String replaceAll(String,String)": (s, [re, by], rt) => rt.S(s$(s).replace(jsRegex(rt, re), rt.jsReplacement(by))),
  "String replaceFirst(String,String)": (s, [re, by], rt) => rt.S(s$(s).replace(jsRegex(rt, re, ""), rt.jsReplacement(by))),
  "boolean matches(String)": (s, [re], rt) => jsRegex(rt, "^(?:" + s$(re) + ")$", "").test(s$(s)),
  "String[] split(String)": (s, [re], rt) => rt.strArr(split(rt, s, s$(re), 0)),
  "String[] split(String,int)": (s, [re, n], rt) => rt.strArr(split(rt, s, s$(re), n)),
  "String repeat(int)": (s, [n], rt) => { if (n < 0) throw rt.ex("IllegalArgumentException", "count is negative: " + n); if (n === 1) return s; if (n === 0 || !s.length) return ""; return rt.S(s$(s).repeat(n)); },
  "char[] toCharArray()": (s, a, rt) => rt.arr("char", Array.from(s$(s), c => c.charCodeAt(0)).flatMap((c, i, all) => c), s),
  "String concat(String)": (s, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return x.length ? rt.S(s$(s) + s$(x)) : s; },
  "String toString()": s => s,
  "int hashCode()": s => hashes.strHash(s),
  "String intern()": s => s$(s),
  "String formatted(Object...)": (s, [args], rt) => rt.S(format(rt, s, args.a)),
  "int codePointAt(int)": (s, [i], rt) => { if (i < 0 || i >= s.length) oob(rt, i, s.length, "StringIndexOutOfBoundsException"); return s$(s).codePointAt(i); },
  "static String valueOf(Object)": (n, [x], rt) => x === null ? "null" : isStr(x) ? x : rt.S(rt.toStr(x)),
  "static String valueOf(int)": (n, [x], rt) => rt.S(String(x)),
  "static String valueOf(long)": (n, [x], rt) => rt.S(String(x)),
  "static String valueOf(double)": (n, [x], rt) => rt.S(javaDouble(x)),
  "static String valueOf(float)": (n, [x], rt) => rt.S(javaFloat(x)),
  "static String valueOf(char)": (n, [x], rt) => rt.S(charStr(x)),
  "static String valueOf(boolean)": (n, [x]) => x ? "true" : "false",
  "static String valueOf(char[])": (n, [x], rt) => rt.S(needArr(rt, x).a.map(charStr).join("")),
  "static String copyValueOf(char[])": (n, [x], rt) => rt.S(needArr(rt, x).a.map(charStr).join("")),
  "static String format(String,Object...)": (n, [f, args], rt) => rt.S(format(rt, f, args.a)),
  "static String format(Locale,String,Object...)": (n, [l, f, args], rt) => rt.S(format(rt, f, args.a, l)),
  "static String join(CharSequence,CharSequence...)": (n, [d, parts], rt) => rt.S(parts.a.map(x => rt.toStr(x)).join(rt.toStr(d))),
  "static String join(CharSequence,Iterable<CharSequence>)": (n, [d, it], rt) => rt.S(rt.toArray(it).map(x => rt.toStr(x)).join(rt.toStr(d)))
};
strMethods["char[] toCharArray()"] = (s, a, rt) => rt.arr("char", Array.from({length:s.length}, (_, i) => s$(s).charCodeAt(i)));
lib("String", Object.assign({fq:"java.lang.String", final:true, ifaces:["CharSequence", "Comparable"]}, L), strMethods);

lib("StringBuilder", Object.assign({fq:"java.lang.StringBuilder", final:true, ifaces:["CharSequence"]}, L), {
  "new()": (rt, a, cls) => new JBuilder(cls),
  "new(String)": (rt, [s], cls) => { if (s === null) throw rt.ex("NullPointerException", null); return new JBuilder(cls, s$(s)); },
  "new(int)": (rt, [n], cls) => { if (n < 0) throw rt.ex("NegativeArraySizeException", String(n)); return new JBuilder(cls); },
  "new(CharSequence)": (rt, [s], cls) => new JBuilder(cls, rt.toStr(s)),
  "StringBuilder append(String)": (b, [x]) => { b.s += x === null ? "null" : s$(x); return b; },
  "StringBuilder append(char)": (b, [x]) => { b.s += charStr(x); return b; },
  "StringBuilder append(int)": (b, [x]) => { b.s += String(x); return b; },
  "StringBuilder append(long)": (b, [x]) => { b.s += String(x); return b; },
  "StringBuilder append(double)": (b, [x]) => { b.s += javaDouble(x); return b; },
  "StringBuilder append(float)": (b, [x]) => { b.s += javaFloat(x); return b; },
  "StringBuilder append(boolean)": (b, [x]) => { b.s += x ? "true" : "false"; return b; },
  "StringBuilder append(char[])": (b, [x], rt) => { b.s += needArr(rt, x).a.map(charStr).join(""); return b; },
  "StringBuilder append(Object)": (b, [x], rt) => { b.s += rt.toStr(x); return b; },
  "StringBuilder append(CharSequence)": (b, [x], rt) => { b.s += rt.toStr(x); return b; },
  "StringBuilder insert(int,String)": (b, [i, x], rt) => { if (i < 0 || i > b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `offset ${i}, length ${b.s.length}`); b.s = b.s.slice(0, i) + (x === null ? "null" : s$(x)) + b.s.slice(i); return b; },
  "StringBuilder insert(int,char)": (b, [i, x], rt) => { if (i < 0 || i > b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `offset ${i}, length ${b.s.length}`); b.s = b.s.slice(0, i) + charStr(x) + b.s.slice(i); return b; },
  "StringBuilder insert(int,int)": (b, [i, x], rt) => { if (i < 0 || i > b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `offset ${i}, length ${b.s.length}`); b.s = b.s.slice(0, i) + String(x) + b.s.slice(i); return b; },
  "StringBuilder insert(int,Object)": (b, [i, x], rt) => { if (i < 0 || i > b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `offset ${i}, length ${b.s.length}`); b.s = b.s.slice(0, i) + rt.toStr(x) + b.s.slice(i); return b; },
  "StringBuilder reverse()": b => { b.s = Array.from(b.s).reverse().join(""); return b; },
  "String toString()": (b, a, rt) => rt.S(b.s),
  "int length()": b => b.s.length,
  "boolean isEmpty()": b => b.s.length === 0,
  "char charAt(int)": (b, [i], rt) => { if (i < 0 || i >= b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `index ${i},length ${b.s.length}`); return b.s.charCodeAt(i); },
  "void setCharAt(int,char)": (b, [i, c], rt) => { if (i < 0 || i >= b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `index ${i},length ${b.s.length}`); b.s = b.s.slice(0, i) + charStr(c) + b.s.slice(i + 1); },
  "StringBuilder deleteCharAt(int)": (b, [i], rt) => { if (i < 0 || i >= b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `index ${i},length ${b.s.length}`); b.s = b.s.slice(0, i) + b.s.slice(i + 1); return b; },
  "StringBuilder delete(int,int)": (b, [s, e], rt) => { const n = b.s.length; if (e > n) e = n; if (s < 0 || s > e) throw rt.ex("StringIndexOutOfBoundsException", `start ${s}, end ${e}, length ${n}`); b.s = b.s.slice(0, s) + b.s.slice(e); return b; },
  "StringBuilder replace(int,int,String)": (b, [s, e, x], rt) => { const n = b.s.length; if (s < 0 || s > n || s > e) throw rt.ex("StringIndexOutOfBoundsException", `start ${s}, end ${e}, length ${n}`); b.s = b.s.slice(0, s) + s$(x) + b.s.slice(Math.min(e, n)); return b; },
  "int indexOf(String)": (b, [x]) => b.s.indexOf(s$(x)),
  "int lastIndexOf(String)": (b, [x]) => b.s.lastIndexOf(s$(x)),
  "String substring(int)": (b, [s], rt) => { if (s < 0 || s > b.s.length) throw rt.ex("StringIndexOutOfBoundsException", `start ${s}, end ${b.s.length}, length ${b.s.length}`); return rt.S(b.s.slice(s)); },
  "String substring(int,int)": (b, [s, e], rt) => { if (s < 0 || e > b.s.length || s > e) throw rt.ex("StringIndexOutOfBoundsException", `start ${s}, end ${e}, length ${b.s.length}`); return rt.S(b.s.slice(s, e)); },
  "void setLength(int)": (b, [n], rt) => { if (n < 0) throw rt.ex("StringIndexOutOfBoundsException", `String index out of range: ${n}`); b.s = n <= b.s.length ? b.s.slice(0, n) : b.s + "\u0000".repeat(n - b.s.length); },
  "int compareTo(StringBuilder)": (b, [x]) => cmpStr(b.s, x.s)
});

lib("Math", Object.assign({fq:"java.lang.Math", final:true}, L), {
  "static final double PI": Math.PI, "static final double E": Math.E,
  "static int abs(int)": (n, [x]) => x < 0 ? (-x) | 0 : x,
  "static long abs(long)": (n, [x]) => x < 0n ? BigInt.asIntN(64, -x) : x,
  "static double abs(double)": (n, [x]) => Math.abs(x),
  "static float abs(float)": (n, [x]) => Math.abs(x),
  "static int max(int,int)": (n, [a, b]) => a >= b ? a : b,
  "static long max(long,long)": (n, [a, b]) => a >= b ? a : b,
  "static double max(double,double)": (n, [a, b]) => (a !== a || b !== b) ? NaN : (a === 0 && b === 0) ? (Object.is(a, -0) ? b : a) : Math.max(a, b),
  "static float max(float,float)": (n, [a, b]) => (a !== a || b !== b) ? NaN : (a === 0 && b === 0) ? (Object.is(a, -0) ? b : a) : Math.max(a, b),
  "static int min(int,int)": (n, [a, b]) => a <= b ? a : b,
  "static long min(long,long)": (n, [a, b]) => a <= b ? a : b,
  "static double min(double,double)": (n, [a, b]) => (a !== a || b !== b) ? NaN : (a === 0 && b === 0) ? (Object.is(a, -0) ? a : b) : Math.min(a, b),
  "static float min(float,float)": (n, [a, b]) => (a !== a || b !== b) ? NaN : (a === 0 && b === 0) ? (Object.is(a, -0) ? a : b) : Math.min(a, b),
  "static double pow(double,double)": (n, [a, b]) => Math.pow(a, b),
  "static double sqrt(double)": (n, [a]) => Math.sqrt(a),
  "static double cbrt(double)": (n, [a]) => Math.cbrt(a),
  "static long round(double)": (n, [a]) => a !== a ? 0n : a >= 9223372036854775807 ? 9223372036854775807n : a <= -9223372036854775808 ? -9223372036854775808n : BigInt(Math.floor(a + 0.5) === a + 0.5 && Math.abs(a) >= 4503599627370496 ? a : Math.round(a)),
  "static int round(float)": (n, [a]) => a !== a ? 0 : a >= 2147483647 ? 2147483647 : a <= -2147483648 ? -2147483648 : Math.round(a),
  "static double floor(double)": (n, [a]) => Math.floor(a),
  "static double ceil(double)": (n, [a]) => Math.ceil(a),
  "static double rint(double)": (n, [a]) => { const f = Math.floor(a), d = a - f; if (d < 0.5) return f; if (d > 0.5) return f + 1; return f % 2 === 0 ? f : f + 1; },
  "static double random()": (n, a, rt) => rt.random(),
  "static double sin(double)": (n, [a]) => Math.sin(a), "static double cos(double)": (n, [a]) => Math.cos(a), "static double tan(double)": (n, [a]) => Math.tan(a),
  "static double asin(double)": (n, [a]) => Math.asin(a), "static double acos(double)": (n, [a]) => Math.acos(a), "static double atan(double)": (n, [a]) => Math.atan(a),
  "static double atan2(double,double)": (n, [a, b]) => Math.atan2(a, b),
  "static double toRadians(double)": (n, [a]) => a * 0.017453292519943295, "static double toDegrees(double)": (n, [a]) => a * 57.29577951308232,
  "static double log(double)": (n, [a]) => Math.log(a), "static double log10(double)": (n, [a]) => Math.log10(a), "static double exp(double)": (n, [a]) => Math.exp(a),
  "static double hypot(double,double)": (n, [a, b]) => Math.hypot(a, b),
  "static double signum(double)": (n, [a]) => Math.sign(a), "static float signum(float)": (n, [a]) => Math.sign(a),
  "static int floorDiv(int,int)": (n, [a, b], rt) => { if (b === 0) throw rt.ex("ArithmeticException", "/ by zero"); return Math.floor(a / b) | 0; },
  "static int floorMod(int,int)": (n, [a, b], rt) => { if (b === 0) throw rt.ex("ArithmeticException", "/ by zero"); return ((a % b) + b) % b | 0; },
  "static long floorDiv(long,long)": (n, [a, b], rt) => { if (b === 0n) throw rt.ex("ArithmeticException", "/ by zero"); let q = a / b; if ((a % b !== 0n) && ((a < 0n) !== (b < 0n))) q -= 1n; return BigInt.asIntN(64, q); },
  "static long floorMod(long,long)": (n, [a, b], rt) => { if (b === 0n) throw rt.ex("ArithmeticException", "/ by zero"); return ((a % b) + b) % b; },
  "static int addExact(int,int)": (n, [a, b], rt) => { const r = a + b; if (r > 2147483647 || r < -2147483648) throw rt.ex("ArithmeticException", "integer overflow"); return r; },
  "static int subtractExact(int,int)": (n, [a, b], rt) => { const r = a - b; if (r > 2147483647 || r < -2147483648) throw rt.ex("ArithmeticException", "integer overflow"); return r; },
  "static int multiplyExact(int,int)": (n, [a, b], rt) => { const r = a * b; if (r > 2147483647 || r < -2147483648) throw rt.ex("ArithmeticException", "integer overflow"); return r; },
  "static long multiplyExact(long,long)": (n, [a, b], rt) => { const r = a * b; if (r !== BigInt.asIntN(64, r)) throw rt.ex("ArithmeticException", "long overflow"); return r; },
  "static int toIntExact(long)": (n, [a], rt) => { if (a !== BigInt.asIntN(32, a)) throw rt.ex("ArithmeticException", "integer overflow"); return Number(a); }
});

function boxClass(name, prim, extra) {
  const isInt = ["Integer", "Short", "Byte"].includes(name), isLong = name === "Long", isFp = name === "Double" || name === "Float";
  const m = {
    "String toString()": (b, a, rt) => rt.S(rt.primStr(b.v, prim)),
    "int hashCode()": (b, a, rt) => rt.hash(b),
    "boolean equals(Object)": (b, [x]) => x instanceof JBox && x.t === b.t && (isFp ? Object.is(x.v, b.v) || (x.v !== x.v && b.v !== b.v) : x.v === b.v)
  };
  m[`int compareTo(${name})`] = (b, [x], rt) => { if (x === null) throw rt.ex("NullPointerException", null); return rt.compare(b, x); };
  if (prim !== "boolean" && prim !== "char") {
    m["int intValue()"] = b => isLong ? Number(BigInt.asIntN(32, b.v)) : isFp ? (b.v !== b.v ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(b.v)))) : b.v;
    m["long longValue()"] = b => isLong ? b.v : isFp ? (b.v !== b.v ? 0n : BigInt(Math.trunc(Math.max(-9223372036854775808, Math.min(9223372036854775807, b.v))))) : BigInt(b.v);
    m["double doubleValue()"] = b => isLong ? Number(b.v) : b.v;
    m["float floatValue()"] = b => Math.fround(isLong ? Number(b.v) : b.v);
  }
  m[`${prim} ${prim}Value()`] = b => b.v;
  m[`static ${name} valueOf(${prim})`] = (n, [v], rt) => rt.box(name, v);
  m[`static String toString(${prim})`] = (n, [v], rt) => rt.S(rt.primStr(v, prim));
  if (prim !== "boolean") m[`static int compare(${prim},${prim})`] = (n, [a, b]) => isFp ? dblCmp(a, b) : a < b ? -1 : a > b ? 1 : 0;
  Object.assign(m, extra);
  return lib(name, Object.assign({fq:"java.lang." + name, final:true, sup:["Boolean", "Character"].includes(name) ? "Object" : "Number", ifaces:["Comparable"]}, L), m);
}
lib("Number", Object.assign({fq:"java.lang.Number", abstract:true}, L), {
  "int intValue()": (b, a, rt) => rt.call(b, "intValue()", []),
  "long longValue()": (b, a, rt) => rt.call(b, "longValue()", []),
  "double doubleValue()": (b, a, rt) => rt.call(b, "doubleValue()", []),
  "float floatValue()": (b, a, rt) => rt.call(b, "floatValue()", [])
});
boxClass("Integer", "int", {
  "static final int MAX_VALUE": 2147483647, "static final int MIN_VALUE": -2147483648, "static final int SIZE": 32, "static final int BYTES": 4,
  "static int parseInt(String)": (n, [s], rt) => parseIntJava(rt, s, 10, 32),
  "static int parseInt(String,int)": (n, [s, r], rt) => parseIntJava(rt, s, r, 32),
  "static Integer valueOf(String)": (n, [s], rt) => rt.box("Integer", parseIntJava(rt, s, 10, 32)),
  "static Integer valueOf(String,int)": (n, [s, r], rt) => rt.box("Integer", parseIntJava(rt, s, r, 32)),
  "static String toString(int,int)": (n, [v, r], rt) => rt.S(toRadix(v, r < 2 || r > 36 ? 10 : r)),
  "static String toBinaryString(int)": (n, [v], rt) => rt.S(toRadix(unsigned(v, 32), 2)),
  "static String toHexString(int)": (n, [v], rt) => rt.S(toRadix(unsigned(v, 32), 16)),
  "static String toOctalString(int)": (n, [v], rt) => rt.S(toRadix(unsigned(v, 32), 8)),
  "static int sum(int,int)": (n, [a, b]) => (a + b) | 0,
  "static int max(int,int)": (n, [a, b]) => Math.max(a, b), "static int min(int,int)": (n, [a, b]) => Math.min(a, b),
  "static int signum(int)": (n, [a]) => Math.sign(a),
  "static int bitCount(int)": (n, [a]) => { let c = 0, v = a >>> 0; while (v) { c += v & 1; v >>>= 1; } return c; },
  "static int reverse(int)": (n, [a]) => parseInt((a >>> 0).toString(2).padStart(32, "0").split("").reverse().join(""), 2) | 0,
  "static int parseUnsignedInt(String)": (n, [s], rt) => parseIntJava(rt, s, 10, 33) | 0
});
boxClass("Long", "long", {
  "static final long MAX_VALUE": 9223372036854775807n, "static final long MIN_VALUE": -9223372036854775808n,
  "static long parseLong(String)": (n, [s], rt) => parseIntJava(rt, s, 10, 64),
  "static long parseLong(String,int)": (n, [s, r], rt) => parseIntJava(rt, s, r, 64),
  "static Long valueOf(String)": (n, [s], rt) => rt.box("Long", parseIntJava(rt, s, 10, 64)),
  "static String toBinaryString(long)": (n, [v], rt) => rt.S(toRadix(unsigned(v, 64), 2)),
  "static String toHexString(long)": (n, [v], rt) => rt.S(toRadix(unsigned(v, 64), 16)),
  "static long sum(long,long)": (n, [a, b]) => BigInt.asIntN(64, a + b),
  "static long max(long,long)": (n, [a, b]) => a > b ? a : b, "static long min(long,long)": (n, [a, b]) => a < b ? a : b
});
boxClass("Double", "double", {
  "static final double MAX_VALUE": Number.MAX_VALUE, "static final double MIN_VALUE": Number.MIN_VALUE,
  "static final double POSITIVE_INFINITY": Infinity, "static final double NEGATIVE_INFINITY": -Infinity, "static final double NaN": NaN,
  "static double parseDouble(String)": (n, [s], rt) => parseDoubleJava(rt, s),
  "static Double valueOf(String)": (n, [s], rt) => rt.box("Double", parseDoubleJava(rt, s)),
  "static boolean isNaN(double)": (n, [v]) => v !== v,
  "static boolean isInfinite(double)": (n, [v]) => v === Infinity || v === -Infinity,
  "static boolean isFinite(double)": (n, [v]) => isFinite(v),
  "boolean isNaN()": b => b.v !== b.v,
  "static double sum(double,double)": (n, [a, b]) => a + b,
  "static double max(double,double)": (n, [a, b]) => Math.max(a, b), "static double min(double,double)": (n, [a, b]) => Math.min(a, b)
});
boxClass("Float", "float", {
  "static final float MAX_VALUE": 3.4028234663852886e38, "static final float MIN_VALUE": 1.401298464324817e-45,
  "static float parseFloat(String)": (n, [s], rt) => Math.fround(parseDoubleJava(rt, s)),
  "static boolean isNaN(float)": (n, [v]) => v !== v
});
boxClass("Short", "short", {"static final short MAX_VALUE": 32767, "static final short MIN_VALUE": -32768, "static short parseShort(String)": (n, [s], rt) => { const v = parseIntJava(rt, s, 10, 32); if (v < -32768 || v > 32767) throw rt.ex("NumberFormatException", `Value out of range. Value:"${s$(s)}" Radix:10`); return v; }});
boxClass("Byte", "byte", {"static final byte MAX_VALUE": 127, "static final byte MIN_VALUE": -128, "static byte parseByte(String)": (n, [s], rt) => { const v = parseIntJava(rt, s, 10, 32); if (v < -128 || v > 127) throw rt.ex("NumberFormatException", `Value out of range. Value:"${s$(s)}" Radix:10`); return v; }});
boxClass("Boolean", "boolean", {
  "static final Boolean TRUE": () => null, "static final Boolean FALSE": () => null,
  "static boolean parseBoolean(String)": (n, [s]) => s !== null && s$(s).toLowerCase() === "true",
  "static Boolean valueOf(String)": (n, [s], rt) => rt.box("Boolean", s !== null && s$(s).toLowerCase() === "true"),
  "static int compare(boolean,boolean)": (n, [a, b]) => a === b ? 0 : a ? 1 : -1,
  "static boolean logicalAnd(boolean,boolean)": (n, [a, b]) => a && b, "static boolean logicalOr(boolean,boolean)": (n, [a, b]) => a || b, "static boolean logicalXor(boolean,boolean)": (n, [a, b]) => a !== b
});
boxClass("Character", "char", {
  "static final char MIN_VALUE": 0, "static final char MAX_VALUE": 65535,
  "static boolean isDigit(char)": (n, [c]) => CH.digit(c), "static boolean isLetter(char)": (n, [c]) => CH.letter(c),
  "static boolean isLetterOrDigit(char)": (n, [c]) => CH.letter(c) || CH.digit(c), "static boolean isAlphabetic(int)": (n, [c]) => CH.alpha(c),
  "static boolean isUpperCase(char)": (n, [c]) => CH.upper(c), "static boolean isLowerCase(char)": (n, [c]) => CH.lower(c),
  "static boolean isWhitespace(char)": (n, [c]) => CH.ws(c), "static boolean isSpaceChar(char)": (n, [c]) => /[\p{Zs}\p{Zl}\p{Zp}]/u.test(charStr(c)),
  "static char toUpperCase(char)": (n, [c]) => upperChar(c), "static char toLowerCase(char)": (n, [c]) => lowerChar(c),
  "static int getNumericValue(char)": (n, [c]) => numericValue(c),
  "static int digit(char,int)": (n, [c, r]) => digitOf(c, r),
  "static char forDigit(int,int)": (n, [d, r]) => (r < 2 || r > 36 || d < 0 || d >= r) ? 0 : (d < 10 ? 48 + d : 87 + d),
  "static boolean isDigit(int)": (n, [c]) => CH.digit(c), "static boolean isLetter(int)": (n, [c]) => CH.letter(c)
});

lib("System", Object.assign({fq:"java.lang.System", final:true}, L), {
  "static final PrintStream out": () => null, "static final PrintStream err": () => null, "static final InputStream in": () => null,
  "static long currentTimeMillis()": (n, a, rt) => BigInt(Date.now() + rt.sleptMs),
  "static long nanoTime()": (n, a, rt) => BigInt(Math.round((rt.now() + rt.sleptMs) * 1e6)),
  "static void exit(int)": (n, [c], rt) => rt.exit(c),
  "static String lineSeparator()": () => "\n",
  "static int identityHashCode(Object)": (n, [o], rt) => o === null ? 0 : rt.idHash(o),
  "static void arraycopy(Object,int,Object,int,int)": (n, [s, sp, d, dp, len], rt) => {
    if (s === null || d === null) throw rt.ex("NullPointerException", null);
    if (sp < 0 || dp < 0 || len < 0 || sp + len > s.a.length || dp + len > d.a.length) {
      const which = sp + len > s.a.length || sp < 0 ? `source index ${sp} out of bounds for ${rt.arrKind(s)}[${s.a.length}]` : `destination index ${dp} out of bounds for ${rt.arrKind(d)}[${d.a.length}]`;
      throw rt.ex("ArrayIndexOutOfBoundsException", len < 0 ? `length ${len} is negative` : `arraycopy: last ${which.replace("index " + (sp + len > s.a.length ? sp : dp), "index " + ((sp + len > s.a.length ? sp : dp) + len))}`);
    }
    const part = s.a.slice(sp, sp + len);
    for (let i = 0; i < len; i++) d.a[dp + i] = part[i];
  }
});
lib("InputStream", {fq:"java.io.InputStream", pkg:"java.io", abstract:true}, {"int read()": (o, a, rt) => { const l = rt.readChar(); return l; }});
const pr = (rt, o, s) => { if (o.isErr) rt.err(s); else rt.out(s); };
lib("PrintStream", {fq:"java.io.PrintStream", pkg:"java.io"}, {
  "void println()": (o, a, rt) => pr(rt, o, "\n"),
  "void println(boolean)": (o, [x], rt) => pr(rt, o, (x ? "true" : "false") + "\n"),
  "void println(char)": (o, [x], rt) => pr(rt, o, charStr(x) + "\n"),
  "void println(int)": (o, [x], rt) => pr(rt, o, x + "\n"),
  "void println(long)": (o, [x], rt) => pr(rt, o, x + "\n"),
  "void println(float)": (o, [x], rt) => pr(rt, o, javaFloat(x) + "\n"),
  "void println(double)": (o, [x], rt) => pr(rt, o, javaDouble(x) + "\n"),
  "void println(char[])": (o, [x], rt) => pr(rt, o, needArr(rt, x).a.map(charStr).join("") + "\n"),
  "void println(String)": (o, [x], rt) => pr(rt, o, (x === null ? "null" : s$(x)) + "\n"),
  "void println(Object)": (o, [x], rt) => pr(rt, o, rt.toStr(x) + "\n"),
  "void print(boolean)": (o, [x], rt) => pr(rt, o, x ? "true" : "false"),
  "void print(char)": (o, [x], rt) => pr(rt, o, charStr(x)),
  "void print(int)": (o, [x], rt) => pr(rt, o, String(x)),
  "void print(long)": (o, [x], rt) => pr(rt, o, String(x)),
  "void print(float)": (o, [x], rt) => pr(rt, o, javaFloat(x)),
  "void print(double)": (o, [x], rt) => pr(rt, o, javaDouble(x)),
  "void print(char[])": (o, [x], rt) => pr(rt, o, needArr(rt, x).a.map(charStr).join("")),
  "void print(String)": (o, [x], rt) => pr(rt, o, x === null ? "null" : s$(x)),
  "void print(Object)": (o, [x], rt) => pr(rt, o, rt.toStr(x)),
  "PrintStream printf(String,Object...)": (o, [f, args], rt) => { if (f === null) throw rt.ex("NullPointerException", null); let s; try { s = format(rt, f, args.a); } catch (e) { if (e.partial) pr(rt, o, e.partial); throw e; } pr(rt, o, s); return o; },
  "PrintStream format(String,Object...)": (o, [f, args], rt) => { pr(rt, o, format(rt, f, args.a)); return o; },
  "PrintStream printf(Locale,String,Object...)": (o, [l, f, args], rt) => { if (f === null) throw rt.ex("NullPointerException", null); let s; try { s = format(rt, f, args.a, l); } catch (e) { if (e.partial) pr(rt, o, e.partial); throw e; } pr(rt, o, s); return o; },
  "PrintStream format(Locale,String,Object...)": (o, [l, f, args], rt) => { pr(rt, o, format(rt, f, args.a, l)); return o; },
  "void flush()": () => {}
});
lib("IO", Object.assign({fq:"java.lang.IO", final:true}, L), {
  "static void println(Object)": (n, [x], rt) => rt.out(rt.toStr(x) + "\n"),
  "static void println()": (n, a, rt) => rt.out("\n"),
  "static void print(Object)": (n, [x], rt) => rt.out(rt.toStr(x)),
  "static String readln()": (n, a, rt) => { const l = rt.readLine(); return l === null ? null : rt.S(l); },
  "static String readln(String)": (n, [p], rt) => { rt.out(rt.toStr(p)); const l = rt.readLine(); return l === null ? null : rt.S(l); }
});
lib("Thread", Object.assign({fq:"java.lang.Thread"}, L), {
  "static void sleep(long)": (n, [ms], rt) => { if (ms < 0n) throw rt.ex("IllegalArgumentException", "timeout value is negative"); rt.sleep(Number(ms)); }
});
lib("Objects", Object.assign({fq:"java.util.Objects", final:true}, U), {
  "static boolean equals(Object,Object)": (n, [a, b], rt) => a === b || (a !== null && rt.equals(a, b)),
  "static boolean isNull(Object)": (n, [a]) => a === null, "static boolean nonNull(Object)": (n, [a]) => a !== null,
  "static String toString(Object)": (n, [a], rt) => rt.S(rt.toStr(a)),
  "static int hashCode(Object)": (n, [a], rt) => a === null ? 0 : rt.hash(a),
  "static int hash(Object...)": (n, [a], rt) => { let h = 1; for (const x of a.a) h = (Math.imul(31, h) + (x === null ? 0 : rt.hash(x))) | 0; return h; },
  "static <T> T requireNonNull(T)": (n, [a], rt) => { if (a === null) throw rt.ex("NullPointerException", null); return a; },
  "static <T> T requireNonNull(T,String)": (n, [a, m], rt) => { if (a === null) throw rt.ex("NullPointerException", m === null ? null : s$(m)); return a; }
});

/* ---------- Ausnahmen ---------- */
const THROWABLE = {
  "new()": (rt, a, cls, self) => rt.initThrowable(self || new JObj(cls), null, null),
  "new(String)": (rt, [m], cls, self) => rt.initThrowable(self || new JObj(cls), m, null),
  "new(String,Throwable)": (rt, [m, c], cls, self) => rt.initThrowable(self || new JObj(cls), m, c),
  "new(Throwable)": (rt, [c], cls, self) => rt.initThrowable(self || new JObj(cls), c === null ? null : rt.S(rt.toStr(c)), c),
  "String getMessage()": o => o.f["Throwable#message"],
  "String getLocalizedMessage()": (o, a, rt) => rt.call(o, "getMessage()", []),
  "Throwable getCause()": o => o.f["Throwable#cause"] || null,
  "String toString()": (o, a, rt) => { const m = rt.call(o, "getLocalizedMessage()", []); return rt.S(o.cls.fq + (m !== null ? ": " + s$(m) : "")); },
  "void printStackTrace()": (o, a, rt) => rt.err(rt.stackText(o))
};
const exc = (name, sup, pkg = "java.lang") => lib(name, {fq:pkg + "." + name, pkg, sup}, Object.fromEntries(Object.entries(THROWABLE).filter(([k]) => k.startsWith("new"))));
lib("Throwable", Object.assign({fq:"java.lang.Throwable"}, L), THROWABLE);
exc("Exception", "Throwable"); exc("Error", "Throwable"); exc("RuntimeException", "Exception");
exc("ArithmeticException", "RuntimeException"); exc("IndexOutOfBoundsException", "RuntimeException");
exc("ArrayIndexOutOfBoundsException", "IndexOutOfBoundsException"); exc("StringIndexOutOfBoundsException", "IndexOutOfBoundsException");
exc("NullPointerException", "RuntimeException"); exc("IllegalArgumentException", "RuntimeException"); exc("NumberFormatException", "IllegalArgumentException");
exc("IllegalStateException", "RuntimeException"); exc("ClassCastException", "RuntimeException"); exc("UnsupportedOperationException", "RuntimeException");
exc("NegativeArraySizeException", "RuntimeException"); exc("ArrayStoreException", "RuntimeException"); exc("CloneNotSupportedException", "Exception");
exc("InterruptedException", "Exception"); exc("ReflectiveOperationException", "Exception");
exc("VirtualMachineError", "Error"); exc("StackOverflowError", "VirtualMachineError"); exc("OutOfMemoryError", "VirtualMachineError");
exc("NoSuchElementException", "RuntimeException", "java.util"); exc("InputMismatchException", "NoSuchElementException", "java.util");
exc("ConcurrentModificationException", "RuntimeException", "java.util");
exc("IllegalFormatException", "IllegalArgumentException", "java.util"); exc("IllegalFormatConversionException", "IllegalFormatException", "java.util");
exc("UnknownFormatConversionException", "IllegalFormatException", "java.util"); exc("MissingFormatArgumentException", "IllegalFormatException", "java.util");
exc("IllegalFormatPrecisionException", "IllegalFormatException", "java.util");
exc("IOException", "Exception", "java.io"); exc("FileNotFoundException", "IOException", "java.io");
exc("PatternSyntaxException", "IllegalArgumentException", "java.util.regex");
exc("DateTimeException", "RuntimeException", "java.time");

/* ---------- java.util: Sammlungen ---------- */
const listChk = (rt, l) => { if (l.ro) throw rt.ex("UnsupportedOperationException", null); };
const listAdd = (rt, l) => { if (l.ro) throw rt.ex("UnsupportedOperationException", null); };
const COLL = {
  "int size()": (c, a, rt) => rt.size(c),
  "boolean isEmpty()": (c, a, rt) => rt.size(c) === 0,
  "boolean contains(Object)": (c, [x], rt) => rt.contains(c, x),
  "Iterator<E> iterator()": (c, a, rt) => rt.iterator(c),
  "String toString()": (c, a, rt) => rt.S(rt.collStr(c)),
  "boolean equals(Object)": (c, [x], rt) => rt.collEquals(c, x),
  "int hashCode()": (c, a, rt) => rt.collHash(c),
  "Object[] toArray()": (c, a, rt) => rt.arr(JV.C("Object"), rt.toArray(c))
};
lib("Collection", Object.assign({fq:"java.util.Collection", kind:"interface", tparams:["E"], ifaces:["Iterable"]}, U), Object.assign({}, COLL, {
  "boolean add(E)": (c, [x], rt) => rt.call(c, "add(Object)", [x]),
  "boolean remove(Object)": (c, [x], rt) => rt.call(c, "remove(Object)", [x]),
  "boolean addAll(Collection<E>)": (c, [x], rt) => { let ch = false; for (const v of rt.toArray(x)) ch = rt.call(c, "add(Object)", [v]) || ch; return ch; },
  "void clear()": (c, a, rt) => rt.call(c, "clear()", [])
}));
const LIST = Object.assign({}, COLL, {
  "boolean add(E)": (l, [x], rt) => { listAdd(rt, l); if (l.ro === 2 && x === null) throw rt.ex("NullPointerException", null); l.a.push(x); l.mod++; return true; },
  "void add(int,E)": (l, [i, x], rt) => { listAdd(rt, l); if (i < 0 || i > l.a.length) throw rt.ex("IndexOutOfBoundsException", `Index: ${i}, Size: ${l.a.length}`); l.a.splice(i, 0, x); l.mod++; },
  "boolean addAll(Collection<E>)": (l, [c], rt) => { listAdd(rt, l); const v = rt.toArray(c); l.a.push(...v); l.mod++; return v.length > 0; },
  "E get(int)": (l, [i], rt) => { if (i < 0 || i >= l.a.length) oob(rt, i, l.a.length); return l.a[i]; },
  "E set(int,E)": (l, [i, x], rt) => { if (l.ro === 2) throw rt.ex("UnsupportedOperationException", null); if (i < 0 || i >= l.a.length) oob(rt, i, l.a.length); const o = l.a[i]; l.a[i] = x; return o; },
  "E remove(int)": (l, [i], rt) => { listChk(rt, l); if (i < 0 || i >= l.a.length) oob(rt, i, l.a.length); l.mod++; return l.a.splice(i, 1)[0]; },
  "boolean remove(Object)": (l, [x], rt) => { listChk(rt, l); const i = l.a.findIndex(v => v === x || (v !== null && x !== null && rt.equals(x, v)) || (x === null && v === null)); if (i < 0) return false; l.a.splice(i, 1); l.mod++; return true; },
  "int indexOf(Object)": (l, [x], rt) => l.a.findIndex(v => x === null ? v === null : rt.equals(x, v)),
  "int lastIndexOf(Object)": (l, [x], rt) => { for (let i = l.a.length - 1; i >= 0; i--) if (x === null ? l.a[i] === null : rt.equals(x, l.a[i])) return i; return -1; },
  "void clear()": (l, a, rt) => { listChk(rt, l); l.a.length = 0; l.mod++; },
  "E getFirst()": (l, a, rt) => { if (!l.a.length) throw rt.ex("NoSuchElementException", null); return l.a[0]; },
  "E getLast()": (l, a, rt) => { if (!l.a.length) throw rt.ex("NoSuchElementException", null); return l.a[l.a.length - 1]; },
  "E removeFirst()": (l, a, rt) => { listChk(rt, l); if (!l.a.length) throw rt.ex("NoSuchElementException", null); l.mod++; return l.a.shift(); },
  "E removeLast()": (l, a, rt) => { listChk(rt, l); if (!l.a.length) throw rt.ex("NoSuchElementException", null); l.mod++; return l.a.pop(); },
  "void addFirst(E)": (l, [x], rt) => { listAdd(rt, l); l.a.unshift(x); l.mod++; },
  "void addLast(E)": (l, [x], rt) => { listAdd(rt, l); l.a.push(x); l.mod++; },
  "List<E> subList(int,int)": (l, [a, b], rt) => { if (a < 0 || b > l.a.length || a > b) throw rt.ex("IndexOutOfBoundsException", `fromIndex: ${a}, toIndex: ${b}, size: ${l.a.length}`); return new JList(rt.cls("ArrayList"), l.a.slice(a, b)); },
  "static <E> List<E> of(E...)": (n, [arr], rt) => { if (arr.a.some(x => x === null)) throw rt.ex("NullPointerException", null); return new JList(rt.cls("ImmutableList"), arr.a.slice(), 2); },
  "static <E> List<E> copyOf(Collection<E>)": (n, [c], rt) => new JList(rt.cls("ImmutableList"), rt.toArray(c), 2)
});
lib("List", Object.assign({fq:"java.util.List", kind:"interface", tparams:["E"], ifaces:["Collection"]}, U), LIST);
const listCtors = name => ({
  "new()": (rt, a, cls) => new JList(cls),
  "new(int)": (rt, [n], cls) => { if (n < 0) throw rt.ex("IllegalArgumentException", "Illegal Capacity: " + n); return new JList(cls); },
  "new(Collection<E>)": (rt, [c], cls) => { if (c === null) throw rt.ex("NullPointerException", null); return new JList(cls, rt.toArray(c)); }
});
lib("ArrayList", Object.assign({fq:"java.util.ArrayList", tparams:["E"], ifaces:["List"]}, U), Object.assign({}, LIST, listCtors("ArrayList")));
lib("LinkedList", Object.assign({fq:"java.util.LinkedList", tparams:["E"], ifaces:["List"]}, U), Object.assign({}, LIST, listCtors("LinkedList"), {
  "E peek()": l => l.a.length ? l.a[0] : null,
  "E poll()": l => l.a.length ? (l.mod++, l.a.shift()) : null,
  "void push(E)": (l, [x]) => { l.a.unshift(x); l.mod++; },
  "E pop()": (l, a, rt) => { if (!l.a.length) throw rt.ex("NoSuchElementException", null); l.mod++; return l.a.shift(); },
  "boolean offer(E)": (l, [x]) => { l.a.push(x); l.mod++; return true; }
}));
lib("ImmutableList", Object.assign({fq:"java.util.ImmutableCollections$ListN", tparams:["E"], ifaces:["List"]}, U), LIST);
lib("Iterator", Object.assign({fq:"java.util.Iterator", kind:"interface", tparams:["E"]}, U), {
  "boolean hasNext()": it => it.hasNext(),
  "E next()": it => it.next(),
  "void remove()": it => it.remove()
});

const SET = Object.assign({}, COLL, {
  "boolean add(E)": (s, [x], rt) => { if (s.map.ro) throw rt.ex("UnsupportedOperationException", null); if (s.map.find(x)) return false; s.map.put(x, true); return true; },
  "boolean remove(Object)": (s, [x], rt) => !!s.map.remove(x),
  "boolean addAll(Collection<E>)": (s, [c], rt) => { let ch = false; for (const v of rt.toArray(c)) if (!s.map.find(v)) { s.map.put(v, true); ch = true; } return ch; },
  "void clear()": s => s.map.clear(),
  "static <E> Set<E> of(E...)": (n, [arr], rt) => { const s = new JSet(rt.cls("HashSet"), new JMap(rt.cls("HashMap"), rt, "linked")); for (const x of arr.a) { if (x === null) throw rt.ex("NullPointerException", null); if (s.map.find(x)) throw rt.ex("IllegalArgumentException", "duplicate element: " + rt.toStr(x)); s.map.put(x, true); } s.map.ro = true; return s; }
});
lib("Set", Object.assign({fq:"java.util.Set", kind:"interface", tparams:["E"], ifaces:["Collection"]}, U), SET);
const setCtors = kind => ({
  "new()": (rt, a, cls) => new JSet(cls, new JMap(rt.cls("HashMap"), rt, kind)),
  "new(Collection<E>)": (rt, [c], cls) => { const s = new JSet(cls, new JMap(rt.cls("HashMap"), rt, kind)); for (const v of rt.toArray(c)) s.map.put(v, true); return s; }
});
lib("HashSet", Object.assign({fq:"java.util.HashSet", tparams:["E"], ifaces:["Set"]}, U), Object.assign({}, SET, setCtors("hash")));
lib("LinkedHashSet", Object.assign({fq:"java.util.LinkedHashSet", tparams:["E"], sup:"HashSet", ifaces:["Set"]}, U), Object.assign({}, SET, setCtors("linked")));
lib("TreeSet", Object.assign({fq:"java.util.TreeSet", tparams:["E"], ifaces:["Set"]}, U), Object.assign({}, SET, setCtors("tree"), {
  "E first()": (s, a, rt) => { const n = s.map.nodes(); if (!n.length) throw rt.ex("NoSuchElementException", null); return n[0].k; },
  "E last()": (s, a, rt) => { const n = s.map.nodes(); if (!n.length) throw rt.ex("NoSuchElementException", null); return n[n.length - 1].k; }
}));

const MAP = {
  "V put(K,V)": (m, [k, v], rt) => { if (m.kind === "tree" && k === null) throw rt.ex("NullPointerException", null); return m.put(k, v); },
  "V get(Object)": (m, [k]) => { const n = m.find(k); return n ? n.v : null; },
  "V getOrDefault(Object,V)": (m, [k, d]) => { const n = m.find(k); return n ? n.v : d; },
  "boolean containsKey(Object)": (m, [k]) => !!m.find(k),
  "boolean containsValue(Object)": (m, [v], rt) => m.nodes().some(n => v === null ? n.v === null : rt.equals(v, n.v)),
  "V remove(Object)": (m, [k]) => { const n = m.remove(k); return n ? n.v : null; },
  "V putIfAbsent(K,V)": (m, [k, v]) => { const n = m.find(k); if (n && n.v !== null) return n.v; m.put(k, v); return null; },
  "V replace(K,V)": (m, [k, v]) => { const n = m.find(k); if (!n) return null; const o = n.v; n.v = v; return o; },
  "int size()": m => m.size,
  "boolean isEmpty()": m => m.size === 0,
  "void clear()": m => m.clear(),
  "Set<K> keySet()": (m, a, rt) => new JView(rt.cls("KeySetView"), m, "k"),
  "Collection<V> values()": (m, a, rt) => new JView(rt.cls("ValuesView"), m, "v"),
  "Set<Map.Entry<K,V>> entrySet()": (m, a, rt) => new JView(rt.cls("EntrySetView"), m, "e"),
  "void putAll(Map<K,V>)": (m, [o]) => { for (const n of o.nodes()) m.put(n.k, n.v); },
  "String toString()": (m, a, rt) => rt.S("{" + m.nodes().map(n => (n.k === m ? "(this Map)" : rt.toStr(n.k)) + "=" + (n.v === m ? "(this Map)" : rt.toStr(n.v))).join(", ") + "}"),
  "boolean equals(Object)": (m, [o], rt) => o instanceof JMap && o.size === m.size && m.nodes().every(n => { const x = o.find(n.k); return x && (n.v === null ? x.v === null : rt.equals(n.v, x.v)); }),
  "int hashCode()": (m, a, rt) => m.nodes().reduce((h, n) => (h + ((n.k === null ? 0 : rt.hash(n.k)) ^ (n.v === null ? 0 : rt.hash(n.v)))) | 0, 0),
  "static <K,V> Map<K,V> of()": (n, a, rt) => { const m = new JMap(rt.cls("HashMap"), rt, "linked"); m.ro = true; return m; },
  "static <K,V> Map<K,V> of(K,V)": (n, a, rt) => rt.mapOf(a),
  "static <K,V> Map<K,V> of(K,V,K,V)": (n, a, rt) => rt.mapOf(a),
  "static <K,V> Map<K,V> of(K,V,K,V,K,V)": (n, a, rt) => rt.mapOf(a),
  "static <K,V> Map<K,V> of(K,V,K,V,K,V,K,V)": (n, a, rt) => rt.mapOf(a),
  "static <K,V> Map<K,V> of(K,V,K,V,K,V,K,V,K,V)": (n, a, rt) => rt.mapOf(a)
};
lib("Map", Object.assign({fq:"java.util.Map", kind:"interface", tparams:["K", "V"]}, U), MAP);
lib("Map.Entry", Object.assign({fq:"java.util.Map$Entry", kind:"interface", tparams:["K", "V"]}, U), {
  "K getKey()": e => e.node.k,
  "V getValue()": e => e.node.v,
  "V setValue(V)": (e, [v]) => { const o = e.node.v; e.node.v = v; return o; },
  "String toString()": (e, a, rt) => rt.S(rt.toStr(e.node.k) + "=" + rt.toStr(e.node.v)),
  "boolean equals(Object)": (e, [o], rt) => o instanceof JEntry && rt.equalsN(e.node.k, o.node.k) && rt.equalsN(e.node.v, o.node.v),
  "int hashCode()": (e, a, rt) => (e.node.k === null ? 0 : rt.hash(e.node.k)) ^ (e.node.v === null ? 0 : rt.hash(e.node.v))
});
const mapCtors = kind => ({
  "new()": (rt, a, cls) => new JMap(cls, rt, kind),
  "new(int)": (rt, [n], cls) => { if (n < 0) throw rt.ex("IllegalArgumentException", "Illegal initial capacity: " + n); const m = new JMap(cls, rt, kind); if (kind === "hash" && n > 12) { let cap = 1; while (cap < n) cap *= 2; m.initCap = cap; } return m; },
  "new(Map<K,V>)": (rt, [o], cls) => { const m = new JMap(cls, rt, kind); for (const n of o.nodes()) m.put(n.k, n.v); return m; }
});
lib("HashMap", Object.assign({fq:"java.util.HashMap", tparams:["K", "V"], ifaces:["Map"]}, U), Object.assign({}, MAP, mapCtors("hash")));
lib("LinkedHashMap", Object.assign({fq:"java.util.LinkedHashMap", tparams:["K", "V"], sup:"HashMap", ifaces:["Map"]}, U), Object.assign({}, MAP, mapCtors("linked")));
lib("TreeMap", Object.assign({fq:"java.util.TreeMap", tparams:["K", "V"], ifaces:["Map"]}, U), Object.assign({}, MAP, mapCtors("tree"), {
  "K firstKey()": (m, a, rt) => { const n = m.nodes(); if (!n.length) throw rt.ex("NoSuchElementException", null); return n[0].k; },
  "K lastKey()": (m, a, rt) => { const n = m.nodes(); if (!n.length) throw rt.ex("NoSuchElementException", null); return n[n.length - 1].k; }
}));
const VIEW = Object.assign({}, COLL, {
  "boolean remove(Object)": (v, [x], rt) => { if (v.kind !== "k") throw rt.ex("UnsupportedOperationException", null); return !!v.map.remove(x); },
  "void clear()": v => v.map.clear()
});
lib("KeySetView", Object.assign({fq:"java.util.HashMap$KeySet", tparams:["E"], ifaces:["Set"]}, U), VIEW);
lib("ValuesView", Object.assign({fq:"java.util.HashMap$Values", tparams:["E"], ifaces:["Collection"]}, U), VIEW);
lib("EntrySetView", Object.assign({fq:"java.util.HashMap$EntrySet", tparams:["E"], ifaces:["Set"]}, U), VIEW);
lib("MapEntry", Object.assign({fq:"java.util.HashMap$Node", tparams:["K", "V"], ifaces:["Map.Entry"]}, U), {});

lib("Collections", Object.assign({fq:"java.util.Collections", final:true}, U), {
  "static <T> void sort(List<T>)": (n, [l], rt) => { listChk(rt, l); if (l.ro === 2) throw rt.ex("UnsupportedOperationException", null); l.a.sort((x, y) => rt.compare(x, y)); l.mod++; },
  "static <T> void reverse(List<T>)": (n, [l], rt) => { if (l.ro === 2) throw rt.ex("UnsupportedOperationException", null); l.a.reverse(); },
  "static <T> void shuffle(List<T>)": (n, [l], rt) => { const r = rt.newRandom(); for (let i = l.a.length; i > 1; i--) { const j = r.nextIntBound(rt, i); [l.a[i - 1], l.a[j]] = [l.a[j], l.a[i - 1]]; } },
  "static <T> T max(Collection<T>)": (n, [c], rt) => { const a = rt.toArray(c); if (!a.length) throw rt.ex("NoSuchElementException", null); return a.reduce((m, x) => rt.compare(x, m) > 0 ? x : m); },
  "static <T> T min(Collection<T>)": (n, [c], rt) => { const a = rt.toArray(c); if (!a.length) throw rt.ex("NoSuchElementException", null); return a.reduce((m, x) => rt.compare(x, m) < 0 ? x : m); },
  "static <T> int frequency(Collection<T>,Object)": (n, [c, x], rt) => rt.toArray(c).filter(v => x === null ? v === null : rt.equals(x, v)).length,
  "static <T> void swap(List<T>,int,int)": (n, [l, i, j], rt) => { const len = l.a.length; if (i < 0 || i >= len) oob(rt, i, len); if (j < 0 || j >= len) oob(rt, j, len); [l.a[i], l.a[j]] = [l.a[j], l.a[i]]; },
  "static <T> boolean addAll(Collection<T>,T...)": (n, [c, arr], rt) => { let ch = false; for (const x of arr.a) ch = rt.call(c, "add(Object)", [x]) || ch; return ch; },
  "static <T> List<T> unmodifiableList(List<T>)": (n, [l], rt) => new JList(rt.cls("ImmutableList"), l.a, 2),
  "static <T> List<T> emptyList()": (n, a, rt) => new JList(rt.cls("ImmutableList"), [], 2),
  "static <T> List<T> nCopies(int,T)": (n, [k, x], rt) => { if (k < 0) throw rt.ex("IllegalArgumentException", "List length = " + k); return new JList(rt.cls("ImmutableList"), Array(k).fill(x), 2); }
});

/* Arrays: je ein Satz Überladungen pro Elementtyp, wie im JDK */
const ARR = {};
for (const p of ["int", "long", "double", "float", "char", "byte", "short", "boolean"]) {
  ARR[`static String toString(${p}[])`] = (n, [a], rt) => arrToString(rt, a, p);
  ARR[`static void fill(${p}[],${p})`] = (n, [a, v], rt) => { needArr(rt, a).a.fill(v); };
  ARR[`static void fill(${p}[],int,int,${p})`] = (n, [a, f, t, v], rt) => { rangeChk(rt, needArr(rt, a).a.length, f, t); a.a.fill(v, f, t); };
  ARR[`static ${p}[] copyOf(${p}[],int)`] = (n, [a, len], rt) => { if (len < 0) throw rt.ex("NegativeArraySizeException", String(len)); const out = needArr(rt, a).a.slice(0, len); while (out.length < len) out.push(rt.dflt(p)); return rt.arr(p, out); };
  ARR[`static ${p}[] copyOfRange(${p}[],int,int)`] = (n, [a, f, t], rt) => { const len = needArr(rt, a).a.length; if (f > t) throw rt.ex("IllegalArgumentException", `${f} > ${t}`); if (f < 0 || f > len) throw rt.ex("ArrayIndexOutOfBoundsException", `Array index out of range: ${f}`); const out = a.a.slice(f, Math.min(t, len)); while (out.length < t - f) out.push(rt.dflt(p)); return rt.arr(p, out); };
  ARR[`static boolean equals(${p}[],${p}[])`] = (n, [a, b]) => a === b || (a !== null && b !== null && a.a.length === b.a.length && a.a.every((v, i) => (p === "double" || p === "float") ? Object.is(v, b.a[i]) || (v === b.a[i] && v !== 0) || (v === 0 && b.a[i] === 0 && Object.is(v, b.a[i])) : v === b.a[i]));
  if (p !== "boolean") {
    const cmp = (p === "double" || p === "float") ? dblCmp : (x, y) => x < y ? -1 : x > y ? 1 : 0;
    ARR[`static void sort(${p}[])`] = (n, [a], rt) => { needArr(rt, a).a.sort(cmp); };
    ARR[`static void sort(${p}[],int,int)`] = (n, [a, f, t], rt) => { rangeChk(rt, needArr(rt, a).a.length, f, t); const part = a.a.slice(f, t).sort(cmp); a.a.splice(f, t - f, ...part); };
    ARR[`static int binarySearch(${p}[],${p})`] = (n, [a, key], rt) => { let lo = 0, hi = needArr(rt, a).a.length - 1; while (lo <= hi) { const mid = (lo + hi) >>> 1, c = cmp(a.a[mid], key); if (c < 0) lo = mid + 1; else if (c > 0) hi = mid - 1; else return mid; } return -(lo + 1); };
  }
}
Object.assign(ARR, {
  "static String toString(Object[])": (n, [a], rt) => arrToString(rt, a, null),
  "static String deepToString(Object[])": (n, [a], rt) => rt.S(rt.deepStr(a)),
  "static void fill(Object[],Object)": (n, [a, v], rt) => { needArr(rt, a).a.fill(v); },
  "static void sort(Object[])": (n, [a], rt) => { needArr(rt, a).a.sort((x, y) => rt.compare(x, y)); },
  "static <T> T[] copyOf(T[],int)": (n, [a, len], rt) => { const out = needArr(rt, a).a.slice(0, len); while (out.length < len) out.push(null); return new JArr(a.et, out); },
  "static boolean equals(Object[],Object[])": (n, [a, b], rt) => a === b || (a !== null && b !== null && a.a.length === b.a.length && a.a.every((v, i) => rt.equalsN(v, b.a[i]))),
  "static boolean deepEquals(Object[],Object[])": (n, [a, b], rt) => rt.deepEq(a, b),
  "static <T> List<T> asList(T...)": (n, [arr], rt) => new JList(rt.cls("ArraysList"), arr.a, 1),
  "static int hashCode(int[])": (n, [a]) => a === null ? 0 : a.a.reduce((h, v) => (Math.imul(31, h) + v) | 0, 1)
});
lib("Arrays", Object.assign({fq:"java.util.Arrays", final:true}, U), ARR);
lib("ArraysList", Object.assign({fq:"java.util.Arrays$ArrayList", tparams:["E"], ifaces:["List"]}, U), LIST);

lib("Random", Object.assign({fq:"java.util.Random"}, U), {
  "new()": (rt, a, cls) => rt.newRandom(cls),
  "new(long)": (rt, [s], cls) => new JRandom(cls, s),
  "int nextInt()": r => r.nextInt(),
  "int nextInt(int)": (r, [b], rt) => r.nextIntBound(rt, b),
  "int nextInt(int,int)": (r, [a, b], rt) => r.nextIntRange(rt, a, b),
  "double nextDouble()": r => r.nextDouble(),
  "boolean nextBoolean()": r => r.nextBoolean(),
  "long nextLong()": r => r.nextLong(),
  "void setSeed(long)": (r, [s]) => r.setSeed(s)
});
const sc = s => { if (s.closed) throw s.rt.ex("IllegalStateException", "Scanner closed"); return s; };
const mkLocale = (lang, country = "") => { const o = new JObj(LIB.Locale); o.lang = String(lang).toLowerCase(); o.country = String(country).toUpperCase(); return o; };
JV.mkLocale = mkLocale;
lib("Locale", {fq:"java.util.Locale", pkg:"java.util", final:true}, {
  "static final Locale GERMANY": () => mkLocale("de", "DE"), "static final Locale GERMAN": () => mkLocale("de"),
  "static final Locale US": () => mkLocale("en", "US"), "static final Locale UK": () => mkLocale("en", "GB"), "static final Locale ENGLISH": () => mkLocale("en"),
  "static final Locale FRANCE": () => mkLocale("fr", "FR"), "static final Locale ITALY": () => mkLocale("it", "IT"), "static final Locale ROOT": () => mkLocale(""),
  "new(String)": (rt, [l]) => mkLocale(s$(l)),
  "new(String,String)": (rt, [l, c]) => mkLocale(s$(l), s$(c)),
  "static Locale of(String)": (n, [l]) => mkLocale(s$(l)),
  "static Locale of(String,String)": (n, [l, c]) => mkLocale(s$(l), s$(c)),
  "static Locale forLanguageTag(String)": (n, [t]) => { const [l, c] = s$(t).split(/[-_]/); return mkLocale(l || "", c || ""); },
  "static Locale getDefault()": (n, a, rt) => rt.defLocale,
  "static void setDefault(Locale)": (n, [l], rt) => { if (l === null) throw rt.ex("NullPointerException", "Can't set default locale to NULL"); rt.defLocale = l; },
  "String getLanguage()": (o, a, rt) => rt.S(o.lang),
  "String getCountry()": (o, a, rt) => rt.S(o.country),
  "String toString()": (o, a, rt) => rt.S(o.lang + (o.country ? "_" + o.country : "")),
  "boolean equals(Object)": (o, [x]) => x instanceof JObj && x.cls === o.cls && x.lang === o.lang && x.country === o.country,
  "int hashCode()": (o, a, rt) => hashes.strHash(o.lang + "_" + o.country)
});
const parseScanInt = (rt, tok, bits) => {
  const t = tok.replace(/,/g, "");
  try { return parseIntJava(rt, t, 10, bits); } catch (e) { throw rt.ex("InputMismatchException", `For input string: "${t}"`); }
};
lib("Scanner", Object.assign({fq:"java.util.Scanner", final:true, ifaces:["Iterator", "AutoCloseable"]}, U), {
  "new(InputStream)": (rt, [i], cls) => { if (i === null) throw rt.ex("NullPointerException", null); return new JScanner(cls, rt); },
  "new(String)": (rt, [s], cls) => new JScanner(cls, rt, s$(s)),
  "String next()": s => sc(s).next(),
  "String nextLine()": s => sc(s).nextLine(),
  "int nextInt()": s => sc(s).nextTyped(t => s.intRe.test(t), t => parseScanInt(s.rt, s.num(t), 32)),
  "Scanner useLocale(Locale)": (s, [l], rt) => { if (l === null) throw rt.ex("NullPointerException", null); return sc(s).useLocale(l); },
  "int nextInt(int)": (s, [r]) => sc(s).nextTyped(t => { try { parseIntJava(s.rt, t, r, 32); return true; } catch (e) { return false; } }, t => parseIntJava(s.rt, t, r, 32)),
  "long nextLong()": s => sc(s).nextTyped(t => s.intRe.test(t), t => parseScanInt(s.rt, s.num(t), 64)),
  "short nextShort()": s => sc(s).nextTyped(t => s.intRe.test(t), t => parseScanInt(s.rt, s.num(t), 16)),
  "byte nextByte()": s => sc(s).nextTyped(t => s.intRe.test(t), t => parseScanInt(s.rt, s.num(t), 8)),
  "double nextDouble()": s => sc(s).nextTyped(t => s.dblRe.test(t), t => Number(s.num(t))),
  "float nextFloat()": s => sc(s).nextTyped(t => s.dblRe.test(t), t => Math.fround(Number(s.num(t)))),
  "boolean nextBoolean()": s => sc(s).nextTyped(t => /^(true|false)$/i.test(t), t => t.toLowerCase() === "true"),
  "boolean hasNext()": s => sc(s).hasNext(),
  "boolean hasNextInt()": s => sc(s).hasNext(t => { if (!s.intRe.test(t)) return false; const v = Number(s.num(t)); return v >= -2147483648 && v <= 2147483647; }),
  "boolean hasNextLong()": s => sc(s).hasNext(t => s.intRe.test(t)),
  "boolean hasNextDouble()": s => sc(s).hasNext(t => s.dblRe.test(t)),
  "boolean hasNextBoolean()": s => sc(s).hasNext(t => /^(true|false)$/i.test(t)),
  "boolean hasNextLine()": s => sc(s).hasNextLine(),
  "void close()": s => { if (s.std && !s.closed) s.rt.stdinClosed = true; s.closed = true; }
});

JV.helpers = {s$, cmpStr, parseIntJava, parseDoubleJava, charStr, dblCmp};
})(typeof self !== "undefined" ? self : globalThis);
