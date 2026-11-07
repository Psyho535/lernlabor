/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Java-Übungsterminal, Teil 1: Quelltext in Wörter zerlegen (Lexer) und daraus einen Syntaxbaum bauen (Parser).
   Die Fehlermeldungen folgen javac, damit man sie später im echten JDK wiedererkennt. */
(function (G) {
"use strict";
const JV = G.JV = G.JV || {};

class CompileError {
  constructor(msg, pos, opts = {}) { this.msg = msg; this.pos = pos; this.extra = opts.extra || []; this.hint = opts.hint || ""; }
}
JV.CompileError = CompileError;

const KW = new Set(("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if " +
  "implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized " +
  "this throw throws transient try void volatile while true false null").split(" "));
const PRIMS = new Set(["int", "long", "double", "float", "boolean", "char", "byte", "short"]);
JV.PRIMS = PRIMS;
const OPS = [">>>=", "<<=", "...", "->", "::", "++", "--", "&&", "||", "==", "!=", "<=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<"];
const SINGLE = "(){}[];,.@=<>!~?:+-*/&|^%";
const ID_START = /[\p{L}_$]/u, ID_PART = /[\p{L}\p{N}_$]/u;
const isDigit = c => c >= "0" && c <= "9";

function lex(src) {
  const toks = [], n = src.length;
  let i = 0;
  const fail = (msg, at, hint) => { throw new CompileError(msg, at, {hint}); };
  function escape(j) {
    const c = src[j + 1];
    const simple = {b:8, t:9, n:10, f:12, r:13, s:32, '"':34, "'":39, "\\":92};
    if (c in simple) return [simple[c], j + 2];
    if (c >= "0" && c <= "7") {
      let k = j + 1, v = "";
      const max = c <= "3" ? 3 : 2;
      while (v.length < max && src[k] >= "0" && src[k] <= "7") v += src[k++];
      return [parseInt(v, 8), k];
    }
    if (c === "u") {
      let k = j + 1;
      while (src[k] === "u") k++;
      const h = src.slice(k, k + 4);
      if (!/^[0-9a-fA-F]{4}$/.test(h)) fail("illegal unicode escape", j);
      return [parseInt(h, 16), k + 4];
    }
    fail("illegal escape character", j + 1, "Nach dem Backslash \\ steht ein Zeichen, das Java nicht kennt. Gültig sind zum Beispiel \\n, \\t, \\\" und \\\\.");
  }
  function textBlock(s) {
    let j = s + 3;
    while (src[j] === " " || src[j] === "\t" || src[j] === "\f") j++;
    if (src[j] === "\r") j++;
    if (src[j] !== "\n") fail("illegal text block open delimiter sequence, missing line terminator", s);
    j++;
    const end = src.indexOf('"""', j);
    if (end < 0) fail("unclosed text block", s);
    let raw = src.slice(j, end);
    const lines = raw.split("\n").map(l => l.replace(/\r$/, ""));
    const lastOwn = /^[ \t]*$/.test(lines[lines.length - 1]);
    const ind = l => l.match(/^[ \t]*/)[0].length;
    let min = Infinity;
    lines.forEach((l, k) => { if (/\S/.test(l) || (k === lines.length - 1 && lastOwn)) min = Math.min(min, ind(l)); });
    if (min === Infinity) min = 0;
    let out = lines.map((l, k) => (k === lines.length - 1 && lastOwn) ? "" : l.slice(Math.min(min, ind(l))).replace(/[ \t]+$/, ""));
    let text = out.join("\n");
    if (lastOwn) text = text.replace(/\n?$/, "\n").replace(/\n$/, "") + (lines.length > 1 ? "\n" : "");
    if (lastOwn) text = out.slice(0, -1).join("\n") + "\n";
    let v = "";
    for (let k = 0; k < text.length; k++) {
      if (text[k] === "\\") {
        if (text[k + 1] === "\n") { k++; continue; }
        const sub = text.slice(k);
        const m = sub.match(/^\\(u+[0-9a-fA-F]{4}|[0-3][0-7]{0,2}|[4-7][0-7]?|.)/);
        const key = m[1];
        const simple = {b:8, t:9, n:10, f:12, r:13, s:32, '"':34, "'":39, "\\":92};
        if (key in simple) v += String.fromCharCode(simple[key]);
        else if (/^u/.test(key)) v += String.fromCharCode(parseInt(key.replace(/^u+/, ""), 16));
        else if (/^[0-7]/.test(key)) v += String.fromCharCode(parseInt(key, 8));
        else fail("illegal escape character", s);
        k += m[0].length - 1;
      } else v += text[k];
    }
    return [v, end + 3];
  }
  for (;;) {
    for (;;) {
      const c = src[i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f") { i++; continue; }
      if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (c === "/" && src[i + 1] === "*") {
        const e = src.indexOf("*/", i + 2);
        if (e < 0) fail("unclosed comment", i, "Ein Kommentar mit /* wurde nicht mit */ geschlossen.");
        i = e + 2; continue;
      }
      break;
    }
    if (i >= n) { toks.push({t:"eof", v:"<EOF>", p:n, e:n}); break; }
    const s = i, c = src[i];
    if (ID_START.test(c)) {
      i++;
      while (i < n && ID_PART.test(src[i])) i++;
      const w = src.slice(s, i);
      toks.push({t:KW.has(w) ? "kw" : "id", v:w, p:s, e:i});
      continue;
    }
    if (isDigit(c) || (c === "." && isDigit(src[i + 1] || ""))) {
      let j = s, kind = "int", radix = 10, body;
      if (c === "0" && (src[j + 1] === "x" || src[j + 1] === "X")) {
        radix = 16; j += 2;
        while (/[0-9a-fA-F_]/.test(src[j] || "")) j++;
        body = src.slice(s + 2, j);
      } else if (c === "0" && (src[j + 1] === "b" || src[j + 1] === "B")) {
        radix = 2; j += 2;
        while (/[0-9_]/.test(src[j] || "")) j++;
        body = src.slice(s + 2, j);
        if (/[2-9]/.test(body)) fail("illegal digit in a binary literal", s);
      } else {
        while (/[0-9_]/.test(src[j] || "")) j++;
        if (src[j] === "." && isDigit(src[j + 1] || "")) { kind = "double"; j++; while (/[0-9_]/.test(src[j] || "")) j++; }
        else if (src[j] === "." && !ID_START.test(src[j + 1] || " ") && src[j + 1] !== ".") { kind = "double"; j++; }
        if (src[j] === "e" || src[j] === "E") {
          kind = "double"; j++;
          if (src[j] === "+" || src[j] === "-") j++;
          if (!isDigit(src[j] || "")) fail("malformed floating-point literal", s);
          while (/[0-9_]/.test(src[j] || "")) j++;
        }
        body = src.slice(s, j);
      }
      const suf = src[j] || "";
      if (radix === 10 && /[fFdD]/.test(suf)) { kind = /[fF]/.test(suf) ? "float" : "double"; j++; }
      else if (kind === "int" && /[lL]/.test(suf)) { kind = "long"; j++; }
      i = j;
      const clean = body.replace(/_/g, "");
      if (/^_|_$/.test(body) || body.includes("._") || body.includes("_.")) fail("illegal underscore", s);
      const tok = {t:"num", kind, v:src.slice(s, i), p:s, e:i};
      if (kind === "int" || kind === "long") {
        if (!clean) fail(radix === 16 ? "hexadecimal numbers must contain at least one hexadecimal digit" : "binary numbers must contain at least one binary digit", s);
        let r = radix, digits = clean;
        if (radix === 10 && clean.length > 1 && clean[0] === "0") {
          r = 8; digits = clean.slice(1);
          if (/[89]/.test(digits)) fail("integer number too large", s);
        }
        let big = 0n;
        for (const d of digits) big = big * BigInt(r) + BigInt(parseInt(d, 16));
        tok.big = big; tok.radix = r;
      } else {
        const num = Number(clean.replace(/[fFdD]$/, ""));
        tok.num = kind === "float" ? Math.fround(num) : num;
        if (!isFinite(tok.num)) fail("floating-point number too large", s);
        if (tok.num === 0 && /[1-9]/.test(clean.replace(/[eE].*$/, ""))) fail("floating-point number too small", s);
      }
      toks.push(tok);
      continue;
    }
    if (c === '"') {
      if (src.startsWith('"""', i)) { const [v, e] = textBlock(s); i = e; toks.push({t:"str", v, p:s, e:i}); continue; }
      i++;
      let v = "";
      for (;;) {
        const ch = src[i];
        if (ch === undefined || ch === "\n" || ch === "\r") fail("unclosed string literal", s, "Ein Text in Anführungszeichen wurde nicht geschlossen. Setze am Ende ein \".");
        if (ch === '"') { i++; break; }
        if (ch === "\\") { const [code, k] = escape(i); v += String.fromCharCode(code); i = k; continue; }
        v += ch; i++;
      }
      toks.push({t:"str", v, p:s, e:i});
      continue;
    }
    if (c === "'") {
      i++;
      let code;
      if (src[i] === "'") fail("empty character literal", s, "Zwischen den einfachen Anführungszeichen muss genau ein Zeichen stehen, zum Beispiel 'A'.");
      if (src[i] === "\n" || src[i] === undefined) fail("illegal line end in character literal", s);
      if (src[i] === "\\") { const [cd, k] = escape(i); code = cd; i = k; }
      else { code = src.charCodeAt(i); i++; }
      if (src[i] !== "'") fail("unclosed character literal", s, "Ein char enthält genau ein Zeichen in einfachen Anführungszeichen. Für Texte nimmst du String und doppelte Anführungszeichen.");
      i++;
      toks.push({t:"chr", v:code, p:s, e:i});
      continue;
    }
    let op = null;
    for (const o of OPS) if (src.startsWith(o, i)) { op = o; break; }
    if (!op && SINGLE.includes(c)) op = c;
    if (!op) fail(`illegal character: '${c === "\\" ? "\\\\" : c}'`, s);
    i += op.length;
    const tok = {t:"op", v:op, p:s, e:i};
    if (op === ">" && (src[i] === ">" || src[i] === "=")) tok.adj = true;
    toks.push(tok);
  }
  return toks;
}
JV.lex = lex;

const PREC = {"||":1, "&&":2, "|":3, "^":4, "&":5, "==":6, "!=":6, "<":7, ">":7, "<=":7, ">=":7, instanceof:7, "<<":8, ">>":8, ">>>":8, "+":9, "-":9, "*":10, "/":10, "%":10};
const ASSIGN = new Set(["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>=", ">>>="]);
const MODS = new Set(["public", "private", "protected", "static", "final", "abstract", "native", "synchronized", "transient", "volatile", "strictfp", "default"]);
const UNSUPPORTED = "Das kann das Übungsterminal nicht ausführen";

class Parser {
  constructor(src) { this.src = src; this.toks = lex(src); this.i = 0; }
  get tok() { return this.toks[this.i]; }
  peek(k = 0) { return this.toks[Math.min(this.i + k, this.toks.length - 1)]; }
  is(v, k = 0) { const t = this.peek(k); return (t.t === "op" || t.t === "kw") && t.v === v; }
  isId(k = 0) { return this.peek(k).t === "id"; }
  isWord(w, k = 0) { const t = this.peek(k); return t.t === "id" && t.v === w; }
  next() { return this.toks[this.i++]; }
  accept(v) { return this.is(v) ? this.next() : null; }
  prevEnd() { return this.i > 0 ? this.toks[this.i - 1].e : 0; }
  fail(msg, pos = this.tok.p, opts = {}) {
    if (this.tok.t === "eof" && !opts.keep) {
      throw new CompileError("reached end of file while parsing", this.prevEnd(), {hint:"Die Datei endet zu früh. Meist fehlt am Ende eine schließende geschweifte Klammer }."});
    }
    throw new CompileError(msg, pos, opts);
  }
  expect(v) {
    if (this.is(v)) return this.next();
    const hints = {
      ";":"Am Ende dieser Anweisung fehlt ein Semikolon ;.",
      ")":"Eine runde Klammer ( wurde nicht geschlossen.",
      "(":"Hier erwartet Java eine runde Klammer (.",
      "]":"Eine eckige Klammer [ wurde nicht geschlossen.",
      "{":"Hier muss ein Block mit { beginnen.",
      "}":"Eine geschweifte Klammer { wurde nicht geschlossen."
    };
    this.fail(`'${v}' expected`, this.prevEnd(), {hint:hints[v] || ""});
  }
  ident() {
    if (this.tok.t === "id") return this.next();
    this.fail("<identifier> expected", this.prevEnd(), {hint:"Hier erwartet Java einen Namen, zum Beispiel für eine Variable oder Methode."});
  }
  unsupported(what, pos = this.tok.p) { throw new CompileError(`${what} kann das Übungsterminal nicht ausführen`, pos, {hint:`${what} gehören nicht zu den Grundlagen, die das Übungsterminal ausführt. Im echten JDK funktioniert das.`, unsupported:true}); }

  unit() {
    const u = {imports:[], types:[], loose:[]};
    if (this.is("package")) { this.next(); this.qualName(); this.expect(";"); }
    while (this.is("import")) {
      const p = this.next().p, st = !!this.accept("static"), parts = [this.ident().v];
      let star = false;
      while (this.accept(".")) {
        if (this.accept("*")) { star = true; break; }
        parts.push(this.ident().v);
      }
      this.expect(";");
      u.imports.push({name:parts.join("."), star, st, p});
    }
    if (this.isWord("import") || this.is("import")) this.fail("class, interface, annotation type, enum, record, method or field expected");
    while (this.tok.t !== "eof") {
      if (this.accept(";")) continue;
      const start = this.tok.p, mods = this.modifiers();
      if (this.is("class") || this.is("interface") || this.is("enum") || (this.isWord("record") && this.isId(1))) { u.types.push(this.typeDecl(mods, start)); continue; }
      if (this.is("import")) this.fail("class, interface, annotation type, enum, record, method or field expected");
      const save = this.i;
      let member = null;
      try {
        if (this.is("void") || (this.tok.t === "kw" && PRIMS.has(this.tok.v)) || this.isId()) {
          this.typeOrVoid();
          if (this.isId() && (this.is("(", 1) || this.is("=", 1) || this.is(";", 1) || this.is(",", 1) || this.is("[", 1))) member = true;
        }
      } catch (e) { if (!(e instanceof CompileError)) throw e; }
      this.i = save;
      if (!member) this.fail("class, interface, annotation type, enum, record, method or field expected", this.tok.p, {hint:"Hier steht Code außerhalb einer Klasse. Oft ist eine geschweifte Klammer } zu viel oder es fehlt die Klasse drumherum."});
      u.loose.push(this.member(mods, null, start));
    }
    return u;
  }
  qualName() { const parts = [this.ident().v]; while (this.is(".") && this.isId(1)) { this.next(); parts.push(this.next().v); } return parts.join("."); }
  annotation() {
    const p = this.expect("@").p;
    if (this.is("interface")) this.unsupported("Eigene Annotationen", p);
    const name = this.qualName();
    if (this.accept("(")) { let d = 1; while (d && this.tok.t !== "eof") { const t = this.next(); if (t.v === "(" && t.t === "op") d++; else if (t.v === ")" && t.t === "op") d--; } }
    return {name, p};
  }
  modifiers() {
    const m = {anns:[]};
    for (;;) {
      if (this.is("@") && !this.is("interface", 1)) { m.anns.push(this.annotation()); continue; }
      const t = this.tok;
      if (t.t === "kw" && MODS.has(t.v)) {
        if (t.v === "default" && (this.is(":", 1) || this.is("->", 1))) break;
        if (m[t.v]) this.fail(`repeated modifier`, t.p);
        m[t.v] = true; this.next(); continue;
      }
      if ((this.isWord("sealed") || this.isWord("non")) && (this.is("class", 1) || this.is("interface", 1) || this.is("abstract", 1))) this.unsupported("Versiegelte Klassen");
      break;
    }
    return m;
  }
  typeDecl(mods, start) {
    const kt = this.next(), kind = kt.v === "record" ? "record" : kt.v;
    const nameTok = this.ident();
    const d = {k:"class", kind, name:nameTok.v, mods, p:nameTok.p, kp:kt.p, start, ext:null, impls:[], members:[], enumConsts:[], comps:null};
    if (this.is("<")) this.unsupported("Eigene generische Klassen");
    if (kind === "record") {
      this.expect("(");
      d.comps = [];
      if (!this.is(")")) do {
        this.modifiers();
        const type = this.type(), nm = this.ident();
        d.comps.push({type, name:nm.v, p:nm.p});
      } while (this.accept(","));
      this.expect(")");
    }
    if (this.accept("extends")) {
      if (kind === "interface") { do d.impls.push(this.type()); while (this.accept(",")); }
      else d.ext = this.type();
    }
    if (this.accept("implements")) { do d.impls.push(this.type()); while (this.accept(",")); }
    if (this.isWord("permits")) this.unsupported("Versiegelte Klassen");
    this.expect("{");
    if (kind === "enum") {
      while (this.isId() || this.is("@")) {
        while (this.is("@")) this.annotation();
        const ct = this.ident();
        const c = {name:ct.v, p:ct.p, args:[]};
        if (this.is("(")) c.args = this.args();
        if (this.is("{")) this.unsupported("Enum-Konstanten mit eigenem Rumpf");
        d.enumConsts.push(c);
        if (!this.accept(",")) break;
      }
      if (!this.accept(";") && !this.is("}")) this.expect(";");
    }
    while (!this.is("}")) {
      if (this.tok.t === "eof") this.fail("reached end of file while parsing");
      if (this.accept(";")) continue;
      const s = this.tok.p;
      d.members.push(this.member(this.modifiers(), d, s));
    }
    d.end = this.next().p;
    return d;
  }
  member(mods, cls, start) {
    if (this.is("{")) return {k:"init", static:!!mods.static, body:this.block(), p:this.tok.p};
    if (this.is("class") || this.is("interface") || this.is("enum") || (this.isWord("record") && this.isId(1))) { const t = this.typeDecl(mods, start); t.nested = true; return t; }
    if (this.is("<")) this.unsupported("Generische Methoden");
    if (cls && this.isId() && this.tok.v === cls.name && this.is("(", 1)) {
      const nt = this.next();
      const params = this.params(), throws = this.throwsList();
      return {k:"ctor", mods, name:nt.v, params, throws, body:this.block(), p:nt.p, start};
    }
    if (cls && cls.kind === "record" && this.isId() && this.tok.v === cls.name && this.is("{", 1)) {
      const nt = this.next();
      return {k:"ctor", mods, name:nt.v, params:null, compact:true, throws:[], body:this.block(), p:nt.p, start};
    }
    if (cls && this.isId() && this.is("(", 1)) {
      this.fail("invalid method declaration; return type required", this.tok.p, {hint:`Vor dem Methodennamen fehlt der Rückgabetyp, zum Beispiel void. Ein Konstruktor muss genau wie die Klasse heißen (${cls.name}).`});
    }
    const type = this.typeOrVoid();
    const nt = this.ident();
    if (this.is("(")) {
      const params = this.params();
      let dims = 0;
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); dims++; }
      if (dims) type.dims += dims;
      const throws = this.throwsList();
      let body = null;
      if (this.accept(";")) body = null; else body = this.block();
      return {k:"method", mods, ret:type, name:nt.v, params, throws, body, p:nt.p, start, endP:body ? body.endP : null};
    }
    const vars = this.declarators(type, nt);
    this.expect(";");
    return {k:"field", mods, type, vars, p:nt.p, start};
  }
  throwsList() { const l = []; if (this.accept("throws")) { do l.push(this.type()); while (this.accept(",")); } return l; }
  params() {
    this.expect("(");
    const ps = [];
    if (!this.is(")")) do {
      const mods = this.modifiers();
      const type = this.type();
      let varargs = false;
      if (this.accept("...")) varargs = true;
      const nt = this.ident();
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); type.dims++; }
      if (varargs) type.dims++;
      ps.push({type, name:nt.v, varargs, final:!!mods.final, p:nt.p});
    } while (this.accept(","));
    this.expect(")");
    return ps;
  }
  declarators(type, first) {
    const vars = [];
    let nt = first;
    for (;;) {
      let dims = 0;
      while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); dims++; }
      const v = {name:nt.v, p:nt.p, dims, init:null};
      if (this.accept("=")) v.init = this.is("{") ? this.arrayInit() : this.expr();
      vars.push(v);
      if (!this.accept(",")) break;
      nt = this.ident();
    }
    return vars;
  }
  typeOrVoid() { if (this.is("void")) { const t = this.next(); return {k:"type", name:"void", args:null, dims:0, p:t.p}; } return this.type(); }
  type() {
    const t = this.tok;
    let node;
    if (t.t === "kw" && PRIMS.has(t.v)) { this.next(); node = {k:"type", name:t.v, args:null, dims:0, p:t.p}; }
    else if (t.t === "id") {
      this.next();
      let name = t.v, args = null;
      for (;;) {
        if (this.is("<")) args = this.typeArgs();
        if (this.is(".") && this.isId(1)) { this.next(); name += "." + this.next().v; continue; }
        break;
      }
      node = {k:"type", name, args, dims:0, p:t.p};
    } else this.fail("<identifier> expected", this.prevEnd());
    while (this.is("[") && this.is("]", 1)) { this.next(); this.next(); node.dims++; }
    return node;
  }
  typeArgs() {
    this.expect("<");
    const a = [];
    if (this.is(">")) { this.next(); return a; }
    do {
      if (this.is("?")) this.unsupported("Wildcards wie <?>");
      a.push(this.type());
    } while (this.accept(","));
    this.expect(">");
    return a;
  }
  tryType() { const s = this.i; try { return this.type(); } catch (e) { if (!(e instanceof CompileError)) throw e; this.i = s; return null; } }

  block() {
    const p = this.expect("{").p;
    const body = [];
    while (!this.is("}")) {
      if (this.tok.t === "eof") this.fail("reached end of file while parsing");
      body.push(this.stmt());
    }
    const e = this.next();
    return {k:"block", body, p, endP:e.p};
  }
  stmt() {
    const t = this.tok;
    if (t.t === "op") {
      if (t.v === "{") return this.block();
      if (t.v === ";") { this.next(); return {k:"empty", p:t.p}; }
    }
    if (t.t === "kw") {
      switch (t.v) {
        case "if": {
          this.next(); this.expect("(");
          const c = this.expr(); this.expect(")");
          const th = this.stmt();
          let el = null;
          if (this.accept("else")) el = this.stmt();
          return {k:"if", c, t:th, f:el, p:t.p};
        }
        case "else": this.fail("'else' without 'if'", t.p, {hint:"Vor else fehlt ein passendes if. Häufige Ursache: ein Semikolon direkt hinter if (...) oder fehlende geschweifte Klammern."});
        case "while": {
          this.next(); this.expect("(");
          const c = this.expr(); this.expect(")");
          return {k:"while", c, body:this.stmt(), p:t.p};
        }
        case "do": {
          this.next();
          const body = this.stmt();
          this.expect("while"); this.expect("(");
          const c = this.expr(); this.expect(")"); this.expect(";");
          return {k:"do", c, body, p:t.p};
        }
        case "for": return this.forStmt();
        case "switch": { const s = this.switchExpr(); s.k = "switch"; return s; }
        case "return": {
          this.next();
          const e = this.is(";") ? null : this.expr();
          this.expect(";");
          return {k:"return", e, p:t.p};
        }
        case "break": case "continue": {
          this.next();
          const label = this.isId() ? this.next().v : null;
          this.expect(";");
          return {k:t.v, label, p:t.p};
        }
        case "throw": { this.next(); const e = this.expr(); this.expect(";"); return {k:"throw", e, p:t.p}; }
        case "try": return this.tryStmt();
        case "class": case "interface": case "enum": this.unsupported("Lokale Klassen");
        case "assert": {
          this.next(); const c = this.expr(); let m = null;
          if (this.accept(":")) m = this.expr();
          this.expect(";");
          return {k:"assert", c, m, p:t.p};
        }
        case "synchronized": this.unsupported("synchronized");
        case "case": case "default": this.fail("orphaned " + t.v, t.p);
        case "catch": this.fail("'catch' without 'try'", t.p);
        case "finally": this.fail("'finally' without 'try'", t.p);
      }
    }
    if (this.isId() && this.is(":", 1)) {
      const l = this.next(); this.next();
      return {k:"label", label:l.v, body:this.stmt(), p:l.p};
    }
    if (this.isWord("yield") && !this.is("=", 1) && !this.is("(", 1) && !this.is(".", 1) && !this.is("[", 1) && !this.is("++", 1) && !this.is("--", 1)) {
      this.next(); const e = this.expr(); this.expect(";");
      return {k:"yield", e, p:t.p};
    }
    const decl = this.localDecl(true);
    if (decl) return decl;
    const e = this.expr();
    if (!["assign", "preinc", "postinc", "call", "new", "ctorcall"].includes(e.k)) {
      this.fail("not a statement", e.p, {hint:"Das ist keine vollständige Anweisung. Ein Wert allein reicht nicht, er muss zum Beispiel einer Variable zugewiesen oder ausgegeben werden."});
    }
    this.expect(";");
    return {k:"expr", e, p:t.p};
  }
  localDecl(needSemi) {
    const s = this.i, t = this.tok;
    let final = false;
    while (this.is("final") || this.is("@")) { if (this.accept("final")) final = true; else this.annotation(); }
    if (this.isWord("var") && this.isId(1)) {
      const vt = this.next();
      const type = {k:"type", name:"var", args:null, dims:0, p:vt.p};
      const nt = this.ident();
      if (this.is(":")) return {k:"local", type, final, vars:[{name:nt.v, p:nt.p, dims:0, init:null}], p:t.p, forEachVar:true};
      const vars = this.declarators(type, nt);
      if (needSemi) this.expect(";");
      return {k:"local", type, final, vars, p:t.p};
    }
    const prim = this.tok.t === "kw" && PRIMS.has(this.tok.v);
    if (prim || this.isId()) {
      const type = this.tryType();
      if (type && this.isId()) {
        const nt = this.next();
        if (this.is(":")) return {k:"local", type, final, vars:[{name:nt.v, p:nt.p, dims:0, init:null}], p:t.p, forEachVar:true};
        const vars = this.declarators(type, nt);
        if (needSemi) this.expect(";");
        return {k:"local", type, final, vars, p:t.p};
      }
      if (type && prim) {
        if (this.is(".") && this.is("class", 1)) this.unsupported("Klassenliterale wie int.class");
        this.fail("not a statement", type.p, {hint:"Nach dem Datentyp fehlt der Name der Variable."});
      }
    }
    this.i = s;
    if (final) this.fail("<identifier> expected");
    return null;
  }
  forStmt() {
    const p = this.next().p;
    this.expect("(");
    const init = [];
    if (!this.is(";")) {
      const d = this.localDecl(false);
      if (d && d.forEachVar) {
        this.next();
        const iter = this.expr();
        this.expect(")");
        return {k:"foreach", type:d.type, name:d.vars[0].name, np:d.vars[0].p, final:d.final, iter, body:this.stmt(), p};
      }
      if (d) init.push(d);
      else do { const e = this.expr(); init.push({k:"expr", e, p:e.p}); } while (this.accept(","));
    }
    this.expect(";");
    const c = this.is(";") ? null : this.expr();
    this.expect(";");
    const upd = [];
    if (!this.is(")")) do upd.push(this.expr()); while (this.accept(","));
    this.expect(")");
    return {k:"for", init, c, upd, body:this.stmt(), p};
  }
  tryStmt() {
    const p = this.next().p;
    const res = [];
    if (this.accept("(")) {
      while (!this.is(")")) {
        const d = this.localDecl(false);
        if (!d) this.unsupported("Vorhandene Variablen als Ressource");
        res.push(d);
        if (!this.accept(";")) break;
      }
      this.expect(")");
    }
    const block = this.block();
    const catches = [];
    while (this.is("catch")) {
      const cp = this.next().p;
      this.expect("(");
      const mods = this.modifiers();
      const types = [this.type()];
      while (this.accept("|")) types.push(this.type());
      const nt = this.ident();
      this.expect(")");
      catches.push({types, name:nt.v, np:nt.p, final:!!mods.final, body:this.block(), p:cp});
    }
    let fin = null;
    if (this.accept("finally")) fin = this.block();
    if (!catches.length && !fin && !res.length) this.fail("'try' without 'catch', 'finally' or resource declarations", p, {hint:"Zu einem try-Block gehört mindestens ein catch- oder finally-Block."});
    return {k:"try", res, block, catches, fin, p};
  }
  switchExpr() {
    const p = this.next().p;
    this.expect("(");
    const sel = this.expr();
    this.expect(")");
    this.expect("{");
    const cases = [];
    let arrow = null;
    while (!this.is("}")) {
      if (this.tok.t === "eof") this.fail("reached end of file while parsing");
      const ct = this.tok;
      let labels;
      if (this.accept("default")) labels = null;
      else if (this.accept("case")) {
        labels = [];
        do {
          if (this.is("null")) this.unsupported("case null");
          if ((this.isId() && this.isId(1)) || (this.isId() && this.is("<", 1) && false)) this.unsupported("Muster im switch (Pattern Matching)");
          if (this.isWord("default") || this.is("default")) { this.next(); labels.push({k:"default"}); continue; }
          labels.push(this.ternary());
        } while (this.accept(","));
      } else this.fail("case, default, or '}' expected");
      let isArrow;
      if (this.accept("->")) isArrow = true;
      else if (this.accept(":")) isArrow = false;
      else this.fail("':' or '->' expected", this.prevEnd());
      if (arrow !== null && arrow !== isArrow) this.fail("different case kinds used in the switch", ct.p);
      arrow = isArrow;
      const c = {labels, arrow:isArrow, p:ct.p};
      if (isArrow) {
        if (this.is("{")) c.block = this.block();
        else if (this.is("throw")) c.block = this.stmt();
        else { c.e = this.expr(); this.expect(";"); }
      } else {
        c.body = [];
        while (!this.is("case") && !this.is("default") && !this.is("}")) {
          if (this.tok.t === "eof") this.fail("reached end of file while parsing");
          c.body.push(this.stmt());
        }
      }
      cases.push(c);
    }
    const end = this.next().p;
    return {k:"switchx", sel, cases, arrow:!!arrow, p, endP:end};
  }

  expr() { return this.assign(); }
  lambdaAhead() {
    if (this.isId() && this.is("->", 1)) return true;
    if (!this.is("(")) return false;
    let d = 0, j = this.i;
    for (; j < this.toks.length; j++) {
      const t = this.toks[j];
      if (t.t === "op" && t.v === "(") d++;
      else if (t.t === "op" && t.v === ")") { d--; if (!d) break; }
      else if (t.t === "eof") return false;
    }
    const nx = this.toks[j + 1];
    return !!nx && nx.t === "op" && nx.v === "->";
  }
  gtOp() {
    let j = this.i, op = ">";
    const T = this.toks;
    if (T[j].adj && T[j + 1].v === ">" && T[j + 1].t === "op") {
      op = ">>"; j++;
      if (T[j].adj && T[j + 1].v === ">" && T[j + 1].t === "op") { op = ">>>"; j++; }
    }
    if (T[j].adj && T[j + 1].v === "=" && T[j + 1].t === "op") { op += "="; j++; }
    return {op, n:j - this.i + 1};
  }
  assign() {
    if (this.lambdaAhead()) this.unsupported("Lambda-Ausdrücke");
    const l = this.ternary();
    const t = this.tok;
    let op = null, n = 1;
    if (t.t === "op" && t.v === ">") ({op, n} = this.gtOp());
    else if (t.t === "op") op = t.v;
    if (op && ASSIGN.has(op)) {
      this.i += n;
      if (!["name", "field", "index"].includes(l.k)) this.fail("unexpected type", l.p, {extra:["  required: variable", "  found:    value"], hint:"Links vom Gleichheitszeichen muss eine Variable stehen."});
      const r = this.is("{") && op === "=" ? this.fail("illegal start of expression") : this.assign();
      return {k:"assign", op, l, r, p:t.p};
    }
    return l;
  }
  ternary() {
    const c = this.binary(1);
    if (this.is("?")) {
      const p = this.next().p;
      if (this.lambdaAhead()) this.unsupported("Lambda-Ausdrücke");
      const a = this.ternaryOrAssignInBranch();
      this.expect(":");
      if (this.lambdaAhead()) this.unsupported("Lambda-Ausdrücke");
      const b = this.ternary();
      return {k:"cond", c, a, b, p};
    }
    return c;
  }
  ternaryOrAssignInBranch() { return this.ternary(); }
  binary(min) {
    let left = this.unary();
    for (;;) {
      const t = this.tok;
      let op, n = 1;
      if (t.t === "op" && t.v === ">") ({op, n} = this.gtOp());
      else if (t.t === "op" || (t.t === "kw" && t.v === "instanceof")) op = t.v;
      else break;
      const prec = PREC[op];
      if (!prec || prec < min) break;
      this.i += n;
      if (op === "instanceof") {
        const fin = !!this.accept("final");
        const type = this.type();
        let bind = null, bp = null;
        if (this.isId()) { const b = this.next(); bind = b.v; bp = b.p; }
        else if (fin) this.fail("<identifier> expected");
        left = {k:"instanceof", e:left, type, bind, bp, p:t.p};
        continue;
      }
      const right = this.binary(prec + 1);
      left = {k:"bin", op, l:left, r:right, p:t.p};
    }
    return left;
  }
  unary() {
    const t = this.tok;
    if (t.t === "op") {
      if (t.v === "+" || t.v === "-") {
        this.next();
        const e = this.unary();
        if (t.v === "-" && e.k === "lit" && e.tok && e.tok.t === "num" && !e.neg && (e.tok.kind === "int" || e.tok.kind === "long") && e.tok.radix === 10 && e.p === t.e) {
          e.neg = true;
        }
        return {k:"un", op:t.v, e, p:t.p};
      }
      if (t.v === "++" || t.v === "--") { this.next(); return {k:"preinc", op:t.v, e:this.unary(), p:t.p}; }
      if (t.v === "!" || t.v === "~") { this.next(); return {k:"un", op:t.v, e:this.unary(), p:t.p}; }
      if (t.v === "(") { const c = this.tryCast(); if (c) return c; }
    }
    return this.postfix(this.primary());
  }
  tryCast() {
    const s = this.i, p = this.tok.p;
    this.next();
    const prim = this.tok.t === "kw" && PRIMS.has(this.tok.v);
    if (!prim && !this.isId()) { this.i = s; return null; }
    const type = this.tryType();
    if (!type || !this.is(")")) { this.i = s; return null; }
    const nx = this.peek(1);
    const startsOperand = nx.t === "id" || nx.t === "num" || nx.t === "str" || nx.t === "chr" ||
      (nx.t === "op" && (nx.v === "(" || nx.v === "!" || nx.v === "~")) ||
      (nx.t === "kw" && ["this", "new", "super", "true", "false", "null", "switch"].includes(nx.v)) ||
      (prim && nx.t === "op" && ["+", "-", "++", "--"].includes(nx.v));
    if (!startsOperand) { this.i = s; return null; }
    this.next();
    if (this.lambdaAhead()) this.unsupported("Lambda-Ausdrücke");
    return {k:"cast", type, e:this.unary(), p};
  }
  postfix(e) {
    for (;;) {
      const t = this.tok;
      if (this.is(".")) {
        this.next();
        if (this.is("new")) this.unsupported("Innere Objekte mit .new");
        if (this.is("class")) this.unsupported("Klassenliterale wie String.class");
        if (this.is("this")) this.unsupported("Zugriff mit Klasse.this");
        if (this.is("<")) this.unsupported("Generische Methodenaufrufe");
        const id = this.ident();
        if (this.is("(")) e = {k:"call", obj:e, name:id.v, ap:this.tok.p, args:this.args(), p:t.p, np:id.p};
        else e = {k:"field", obj:e, name:id.v, p:t.p, np:id.p};
        continue;
      }
      if (this.is("[")) { this.next(); const i = this.expr(); this.expect("]"); e = {k:"index", arr:e, i, p:t.p}; continue; }
      if (this.is("++") || this.is("--")) { this.next(); e = {k:"postinc", op:t.v, e, p:t.p}; continue; }
      if (this.is("::")) this.unsupported("Methodenreferenzen");
      return e;
    }
  }
  args() {
    this.expect("(");
    const a = [];
    if (!this.is(")")) do {
      if (this.lambdaAhead()) this.unsupported("Lambda-Ausdrücke");
      a.push(this.expr());
    } while (this.accept(","));
    this.expect(")");
    return a;
  }
  primary() {
    const t = this.tok;
    switch (t.t) {
      case "num": this.next(); return {k:"lit", tok:t, p:t.p};
      case "str": this.next(); return {k:"lit", tok:t, p:t.p};
      case "chr": this.next(); return {k:"lit", tok:t, p:t.p};
      case "id":
        this.next();
        if (this.is("(")) return {k:"call", obj:null, name:t.v, ap:this.tok.p, args:this.args(), p:t.p, np:t.p};
        return {k:"name", id:t.v, p:t.p};
      case "kw":
        switch (t.v) {
          case "true": case "false": case "null": this.next(); return {k:"lit", tok:t, p:t.p};
          case "this":
            this.next();
            if (this.is("(")) return {k:"ctorcall", which:"this", args:this.args(), p:t.p};
            return {k:"this", p:t.p};
          case "super": {
            this.next();
            if (this.is("(")) return {k:"ctorcall", which:"super", args:this.args(), p:t.p};
            const dot = this.expect(".");
            const id = this.ident();
            if (this.is("(")) return {k:"call", obj:{k:"super", p:t.p}, name:id.v, ap:this.tok.p, args:this.args(), p:dot.p, np:id.p};
            return {k:"field", obj:{k:"super", p:t.p}, name:id.v, p:dot.p, np:id.p};
          }
          case "new": return this.creator();
          case "switch": return this.switchExpr();
        }
        if (PRIMS.has(t.v) || t.v === "void") {
          this.next();
          if (this.is(".") && this.is("class", 1)) this.unsupported("Klassenliterale wie int.class");
          this.fail("'.class' expected", this.prevEnd());
        }
        break;
      case "op":
        if (t.v === "(") {
          this.next();
          const e = this.expr();
          this.expect(")");
          return {k:"paren", e, p:t.p};
        }
        if (t.v === "{") this.fail("illegal start of expression", t.p, {hint:"Eine Liste in geschweiften Klammern {1, 2, 3} geht nur direkt bei der Deklaration eines Arrays. Sonst schreibst du new int[] {1, 2, 3}."});
        break;
    }
    this.fail("illegal start of expression", t.p, {hint:"An dieser Stelle erwartet Java einen Wert, eine Variable oder einen Methodenaufruf. Oft fehlt davor etwas oder eine Klammer ist zu viel."});
  }
  creator() {
    const p = this.next().p;
    const t = this.tok;
    let base;
    if (t.t === "kw" && PRIMS.has(t.v)) { this.next(); base = {k:"type", name:t.v, args:null, dims:0, p:t.p}; }
    else if (t.t === "id") {
      this.next();
      let name = t.v, args = null;
      for (;;) {
        if (this.is("<")) args = this.typeArgs();
        if (this.is(".") && this.isId(1)) { this.next(); name += "." + this.next().v; continue; }
        break;
      }
      base = {k:"type", name, args, dims:0, p:t.p};
    } else this.fail("<identifier> expected", this.prevEnd());
    if (this.is("[")) {
      const dims = [];
      let extra = 0;
      while (this.is("[")) {
        this.next();
        if (this.is("]")) {
          this.next(); extra++;
          while (this.is("[")) { this.next(); this.expect("]"); extra++; }
          break;
        }
        dims.push(this.expr());
        this.expect("]");
      }
      if (!dims.length) {
        if (!this.is("{")) this.fail("array dimension missing", this.prevEnd(), {hint:"Gib die Größe in den eckigen Klammern an, zum Beispiel new int[5], oder schreibe die Werte dahinter: new int[] {1, 2}."});
        return {k:"newarr", base, dims:[], total:extra, init:this.arrayInit(), p};
      }
      if (this.is("{")) this.fail("';' expected", this.prevEnd());
      return {k:"newarr", base, dims, total:dims.length + extra, init:null, p};
    }
    if (this.is("(")) {
      const args = this.args();
      if (this.is("{")) this.unsupported("Anonyme Klassen");
      return {k:"new", type:base, args, p};
    }
    this.fail("'(' or '[' expected", this.prevEnd());
  }
  arrayInit() {
    const p = this.expect("{").p;
    const elems = [];
    while (!this.is("}")) {
      elems.push(this.is("{") ? this.arrayInit() : this.expr());
      if (!this.accept(",")) break;
    }
    this.expect("}");
    return {k:"arrinit", elems, p};
  }
}
JV.parse = src => new Parser(src).unit();
})(typeof self !== "undefined" ? self : globalThis);
