/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Editor und Terminal für das Abteil Programmieren.
   Ausführung: Java im eigenen Interpreter (geprüft gegen JDK 25), Python mit echtem CPython (Pyodide),
   JavaScript in einem eigenen Worker, HTML/CSS in einem abgeschotteten Frame, SQL mit echtem SQLite (sql.js). */
(function () {
"use strict";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const BASE = (() => { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, "") : "code/"; })();

/* ---------- Syntaxfarben ---------- */
const W = s => new Set(s.split(" "));
const KW = {
  java:W("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record yield"),
  python:W("False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case"),
  js:W("break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield await async of true false null undefined NaN Infinity static get set"),
  sql:W("select from where and or not insert into values update set delete create table drop alter add primary key foreign references integer int text real varchar char date null is in like between order by group having limit offset as join inner left right outer on distinct union all case when then else end asc desc unique default check exists if autoincrement count sum avg min max cross natural using begin commit rollback transaction index view")
};
const BUILTIN = {
  python:W("print input len range int str float list dict set tuple type abs min max sum sorted round open enumerate zip map filter isinstance bool chr ord reversed any all format divmod pow help id hex bin oct super object"),
  js:W("console document window Math JSON Array Object String Number Boolean Date Map Set Promise parseInt parseFloat isNaN alert prompt setTimeout setInterval clearTimeout clearInterval fetch localStorage")
};
function tokenizer(rules, word) {
  return (src, out) => {
    let i = 0;
    const n = src.length;
    outer: while (i < n) {
      for (const [re, cls] of rules) {
        re.lastIndex = i;
        const m = re.exec(src);
        if (m && m[0].length) {
          const t = m[0];
          const c = typeof cls === "function" ? cls(t, src, i + t.length) : cls;
          out.push(c ? `<span class="hl-${c}">${esc(t)}</span>` : esc(t));
          i += t.length;
          continue outer;
        }
      }
      out.push(esc(src[i]));
      i++;
    }
  };
}
const nextNonSpace = (src, j) => { while (j < src.length && (src[j] === " " || src[j] === "\t")) j++; return src[j]; };
const NUM = /(?:0[xX][\da-fA-F_]+|0[bB][01_]+|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?|\.\d[\d_]*(?:[eE][+-]?\d+)?)[lLfFdDjJ]?/y;
const HL = {};
HL.java = tokenizer([
  [/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, "c"],
  [/"""[\s\S]*?(?:"""|$)/y, "s"],
  [/"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/y, "s"],
  [/@[A-Za-z_]\w*/y, "a"],
  [NUM, "n"],
  [/[A-Za-z_$À-ɏ][\w$À-ɏ]*/y, (w, src, j) => KW.java.has(w) ? "k" : /^[A-Z]/.test(w) ? "t" : nextNonSpace(src, j) === "(" ? "f" : ""]
]);
HL.python = tokenizer([
  [/#[^\n]*/y, "c"],
  [/(?:[rRbBuUfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)/y, "s"],
  [/@[A-Za-z_][\w.]*/y, "a"],
  [NUM, "n"],
  [/[A-Za-z_À-ɏ][\wÀ-ɏ]*/y, (w, src, j) => KW.python.has(w) ? "k" : w === "self" ? "t" : BUILTIN.python.has(w) && nextNonSpace(src, j) === "(" ? "b" : /^[A-Z]/.test(w) ? "t" : nextNonSpace(src, j) === "(" ? "f" : ""]
]);
HL.js = tokenizer([
  [/\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, "c"],
  [/`(?:[^`\\]|\\[\s\S])*`?|"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?/y, "s"],
  [NUM, "n"],
  [/[A-Za-z_$][\w$]*/y, (w, src, j) => KW.js.has(w) ? "k" : BUILTIN.js.has(w) ? "t" : /^[A-Z]/.test(w) ? "t" : nextNonSpace(src, j) === "(" ? "f" : ""]
]);
HL.sql = tokenizer([
  [/--[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y, "c"],
  [/'(?:[^']|'')*'?/y, "s"],
  [/"(?:[^"]|"")*"?/y, "t"],
  [NUM, "n"],
  [/[A-Za-z_À-ɏ][\wÀ-ɏ]*/y, (w, src, j) => KW.sql.has(w.toLowerCase()) ? (nextNonSpace(src, j) === "(" && /^(count|sum|avg|min|max)$/i.test(w) ? "f" : "k") : nextNonSpace(src, j) === "(" ? "f" : ""]
]);
HL.css = (src, out) => {
  let depth = 0, i = 0;
  const n = src.length;
  while (i < n) {
    const rest = src.slice(i);
    let m;
    if ((m = rest.match(/^\/\*[\s\S]*?(?:\*\/|$)/))) { out.push(`<span class="hl-c">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if ((m = rest.match(/^("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)/))) { out.push(`<span class="hl-s">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if (src[i] === "{") { depth++; out.push("{"); i++; continue; }
    if (src[i] === "}") { depth = Math.max(0, depth - 1); out.push("}"); i++; continue; }
    if ((m = rest.match(/^@[\w-]+/))) { out.push(`<span class="hl-k">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if (depth > 0) {
      if ((m = rest.match(/^[\w-]+(?=\s*:)/)) && !/^\d/.test(m[0])) { out.push(`<span class="hl-p">${esc(m[0])}</span>`); i += m[0].length; continue; }
      if ((m = rest.match(/^#[\da-fA-F]{3,8}\b|^-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg|fr|ch)?/))) { out.push(`<span class="hl-n">${esc(m[0])}</span>`); i += m[0].length; continue; }
      if ((m = rest.match(/^[a-zA-Z-]+(?=\()/))) { out.push(`<span class="hl-f">${esc(m[0])}</span>`); i += m[0].length; continue; }
    } else if ((m = rest.match(/^[.#]?[A-Za-z_][\w-]*|^:{1,2}[\w-]+/))) { out.push(`<span class="hl-t">${esc(m[0])}</span>`); i += m[0].length; continue; }
    out.push(esc(src[i])); i++;
  }
};
HL.html = (src, out) => {
  let i = 0;
  const n = src.length;
  while (i < n) {
    const rest = src.slice(i);
    let m;
    if ((m = rest.match(/^<!--[\s\S]*?(?:-->|$)/))) { out.push(`<span class="hl-c">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if ((m = rest.match(/^<!doctype[^>]*>?/i))) { out.push(`<span class="hl-k">${esc(m[0])}</span>`); i += m[0].length; continue; }
    if ((m = rest.match(/^<\/?([A-Za-z][\w-]*)/))) {
      const tag = m[1].toLowerCase(), closing = m[0][1] === "/";
      out.push(`<span class="hl-t">${esc(m[0])}</span>`);
      i += m[0].length;
      while (i < n && src[i] !== ">" && !(src[i] === "/" && src[i + 1] === ">")) {
        const r = src.slice(i);
        let a;
        if ((a = r.match(/^\s+/))) { out.push(esc(a[0])); i += a[0].length; continue; }
        if ((a = r.match(/^[^\s=>/"']+/))) { out.push(`<span class="hl-a">${esc(a[0])}</span>`); i += a[0].length; continue; }
        if ((a = r.match(/^=\s*("[^"]*"?|'[^']*'?|[^\s>]+)/))) { out.push("=" + `<span class="hl-s">${esc(a[0].slice(1))}</span>`); i += a[0].length; continue; }
        out.push(esc(src[i])); i++;
      }
      if (i < n) { const e = src[i] === "/" ? "/>" : ">"; out.push(`<span class="hl-t">${esc(e)}</span>`); i += e.length; }
      if (!closing && (tag === "style" || tag === "script")) {
        const end = src.toLowerCase().indexOf("</" + tag, i);
        const inner = src.slice(i, end < 0 ? n : end);
        (tag === "style" ? HL.css : HL.js)(inner, out);
        i += inner.length;
      }
      continue;
    }
    if ((m = rest.match(/^&[#\w]+;?/))) { out.push(`<span class="hl-n">${esc(m[0])}</span>`); i += m[0].length; continue; }
    out.push(esc(src[i])); i++;
  }
};
function highlight(lang, src) {
  const out = [];
  (HL[lang] || ((s, o) => o.push(esc(s))))(src, out);
  return out.join("");
}

/* ---------- Sprachen ---------- */
const LANG = {
  python:{hl:"python", file:"main.py", cmd:"python3 main.py", indent:"    ", runner:"python"},
  java:{hl:"java", file:"Main.java", cmd:"javac Main.java && java Main", indent:"    ", runner:"java"},
  javascript:{hl:"js", file:"script.js", cmd:"JavaScript-Konsole", indent:"  ", runner:"js"},
  web:{hl:"html", file:"index.html", cmd:"Vorschau", indent:"  ", runner:"web"},
  sql:{hl:"sql", file:"abfrage.sql", cmd:"sqlite3 lernlabor.db", indent:"  ", runner:"sql"}
};

/* ---------- Worker mit Wachhund ---------- */
function workerPool(url, limitMs, wopts) {
  let w = null, ready = null, info = {}, seq = 0;
  const pending = new Map();
  const listeners = new Set();
  function start() {
    w = new Worker(url, wopts);
    ready = new Promise((res, rej) => {
      w.onmessage = e => {
        const d = e.data;
        if (d.loading) { listeners.forEach(f => f({loading:d.loading})); return; }
        if (d.ready) { info.version = d.version; listeners.forEach(f => f({ready:true, version:d.version})); res(); return; }
        if (d.failed) { info.failed = d.message; listeners.forEach(f => f({failed:d.message})); res(); return; }
        const p = pending.get(d.id);
        if (p) { pending.delete(d.id); clearTimeout(p.t); p.res(d.res); }
      };
      w.onerror = e => { e.preventDefault && e.preventDefault(); info.failed = e.message || "Worker konnte nicht starten"; res(); };
    });
  }
  return {
    warm() { if (!w) start(); return ready; },
    on(f) { listeners.add(f); return () => listeners.delete(f); },
    info,
    async run(msg) {
      if (!w) start();
      await ready;
      const id = ++seq;
      return new Promise(res => {
        const t = setTimeout(() => {
          pending.delete(id);
          w.terminate(); w = null; ready = null;
          res({status:"timeout", out:[], code:1});
        }, limitMs);
        pending.set(id, {res, t});
        w.postMessage(Object.assign({id}, msg));
      });
    }
  };
}
const pools = {};
const pool = name => pools[name] || (pools[name] = name === "java" ? workerPool(BASE + "java-worker.js", 10000) : name === "python" ? workerPool(BASE + "py-worker.js", 15000, {type:"module"}) : workerPool(BASE + "sql-worker.js", 10000));

/* ---------- JavaScript: jedes Mal ein frischer Worker ---------- */
const JS_PRELUDE = `"use strict";
const __in = __INPUT__, __eof = __EOF__; let __i = 0, __s = __SEED__ >>> 0;
Math.random = () => { __s = (__s + 0x6D2B79F5) | 0; let t = __s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const __fmt = (v, d, top, seen) => {
  if (typeof v === "string") return top ? v : "'" + v.replace(/'/g, "\\\\'") + "'";
  if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "function") return v.toString().startsWith("class") ? "[class " + (v.name || "(anonymous)") + "]" : "[Function: " + (v.name || "(anonymous)") + "]";
  if (typeof v === "symbol") return v.toString();
  if (v === null || typeof v !== "object") return String(v);
  if (seen.includes(v)) return "[Circular *1]";
  if (v instanceof Error) return v.stack && v.stack.includes(v.message) ? v.name + ": " + v.message : String(v);
  if (v instanceof Date) return isNaN(v) ? "Invalid Date" : v.toISOString();
  if (v instanceof RegExp) return String(v);
  if (d > 2) return Array.isArray(v) ? "[Array]" : "[Object]";
  const s2 = seen.concat([v]);
  if (Array.isArray(v)) { if (!v.length) return "[]"; const items = []; let holes = 0; for (let k = 0; k < v.length; k++) { if (!(k in v)) { holes++; continue; } if (holes) { items.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">"); holes = 0; } items.push(__fmt(v[k], d + 1, false, s2)); } if (holes) items.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">"); return "[ " + items.join(", ") + " ]"; }
  if (v instanceof Map) return "Map(" + v.size + ") {" + (v.size ? " " + [...v].map(([a, b]) => __fmt(a, d + 1, false, s2) + " => " + __fmt(b, d + 1, false, s2)).join(", ") + " " : "") + "}";
  if (v instanceof Set) return "Set(" + v.size + ") {" + (v.size ? " " + [...v].map(a => __fmt(a, d + 1, false, s2)).join(", ") + " " : "") + "}";
  const name = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + " " : (Object.getPrototypeOf(v) === null ? "[Object: null prototype] " : "");
  const keys = Object.keys(v);
  if (!keys.length) return name + "{}";
  return name + "{ " + keys.map(k => (/^[A-Za-z_$][\\w$]*$/.test(k) ? k : "'" + k + "'") + ": " + __fmt(v[k], d + 1, false, s2)).join(", ") + " }";
};
const __send = (k, s) => postMessage({k, s});
const __line = a => a.map(x => __fmt(x, 0, true, [])).join(" ") + "\\n";
console.log = (...a) => __send("out", __line(a)); console.info = console.log; console.debug = console.log;
console.error = (...a) => __send("err", __line(a)); console.warn = console.error;
console.table = d => { if (Array.isArray(d) || (d && typeof d === "object")) { const rows = Object.entries(d); const cols = [...new Set(rows.flatMap(([, r]) => r && typeof r === "object" ? Object.keys(r) : ["Values"]))]; __send("out", ["(index)", ...cols].join(" | ") + "\\n" + rows.map(([k, r]) => [k, ...cols.map(c => r && typeof r === "object" ? (c in r ? __fmt(r[c], 1, false, []) : "") : (c === "Values" ? __fmt(r, 1, false, []) : ""))].join(" | ")).join("\\n") + "\\n"); } else console.log(d); };
self.alert = m => __send("out", (m === undefined ? "" : String(m)) + "\\n");
self.prompt = (msg, def) => { if (msg !== undefined) __send("out", String(msg) + " "); if (__i < __in.length) { const l = __in[__i++]; __send("in", l + "\\n"); return l; } if (__eof) return null; postMessage({needInput:true}); throw new Error("__warte_auf_eingabe__"); };
self.confirm = msg => { const a = self.prompt((msg === undefined ? "" : msg) + " (ja/nein)"); return a !== null && /^(j|ja|y|yes|ok)$/i.test(a.trim()); };
let __timers = 0;
const __st = self.setTimeout, __si = self.setInterval, __ct = self.clearTimeout, __ci = self.clearInterval, __ids = new Set();
self.setTimeout = (f, ms, ...a) => { __timers++; const id = __st(() => { __ids.delete(id); __timers--; try { f(...a); } finally { if (!__timers) postMessage({done:true}); } }, ms); __ids.add(id); return id; };
self.clearTimeout = id => { if (__ids.delete(id)) { __timers--; __ct(id); if (!__timers) postMessage({done:true}); } };
self.setInterval = (f, ms, ...a) => { __timers++; const id = __si(() => f(...a), ms); __ids.add(id); return id; };
self.clearInterval = id => { if (__ids.delete(id)) { __timers--; __ci(id); if (!__timers) postMessage({done:true}); } };
self.document = undefined;
`;
const PRE_LINES = JS_PRELUDE.split("\n").length;
function runJS(src, {input = [], eof = false, seed = 1} = {}) {
  return new Promise(resolve => {
    const pre = JS_PRELUDE.replace("__INPUT__", JSON.stringify(input)).replace("__EOF__", eof ? "true" : "false").replace("__SEED__", String(seed >>> 0));
    const code = pre + "\n" + src + "\n;if (!__timers) postMessage({done:true});";
    const url = URL.createObjectURL(new Blob([code], {type:"text/javascript"}));
    const w = new Worker(url);
    const chunks = [];
    let need = false, finished = false, len = 0;
    const t0 = performance.now();
    const push = (k, s) => {
      if (len > 100000) return;
      len += s.length;
      const last = chunks[chunks.length - 1];
      if (last && last.k === k) last.s += s; else chunks.push({k, s});
    };
    const done = (status, extra = {}) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      w.terminate();
      URL.revokeObjectURL(url);
      resolve(Object.assign({status, out:chunks, code:status === "ok" ? 0 : 1, ms:performance.now() - t0}, extra));
    };
    const timer = setTimeout(() => done(need ? "input" : "timeout"), 4000);
    w.onmessage = e => {
      const d = e.data;
      if (d.needInput) { need = true; done("input"); return; }
      if (d.done) { done("ok"); return; }
      if (d.k) push(d.k, d.s);
    };
    w.onerror = e => {
      e.preventDefault();
      if (need || /__warte_auf_eingabe__/.test(e.message || "")) { done("input"); return; }
      const line = e.lineno ? e.lineno - PRE_LINES : 0;
      let msg = (e.message || "Fehler").replace(/^Uncaught /, "");
      push("err", `Uncaught ${msg}${line > 0 ? `\n    at script.js:${line}${e.colno ? ":" + e.colno : ""}` : ""}\n`);
      done("error", {line:line > 0 ? line : 0});
    };
  });
}

/* ---------- HTML/CSS: abgeschotteter Frame ---------- */
const WEB_PRELUDE = `<script>(function(){var P=function(k,s){parent.postMessage({lernlabor:1,k:k,s:s},"*")};var F=function(v){if(typeof v==="string")return v;try{return JSON.stringify(v)}catch(e){return String(v)}};
console.log=function(){P("out",Array.prototype.map.call(arguments,F).join(" ")+"\\n")};console.info=console.log;console.error=function(){P("err",Array.prototype.map.call(arguments,F).join(" ")+"\\n")};console.warn=console.error;
window.addEventListener("error",function(e){P("err","Uncaught "+e.message.replace(/^Uncaught /,"")+(e.lineno?" (Zeile "+e.lineno+")":"")+"\\n")});
document.addEventListener("submit",function(e){e.preventDefault();var d=[];try{new FormData(e.target).forEach(function(v,k){d.push(k+"="+v)})}catch(x){}P("info","Formular abgeschickt: "+(d.join(", ")||"(keine Felder mit name)")+"\\n")},true);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(a&&!/^#/.test(a.getAttribute("href"))){e.preventDefault();P("info","Link angetippt: "+a.getAttribute("href")+"\\n")}},true);
})();<\/script>`;
function webDoc(src, checks) {
  let body = WEB_PRELUDE + src;
  if (checks) body += `<script>window.addEventListener("load",function(){var r=[];${checks.map((c, i) => `try{r.push(!!(function(){return (${c})})())}catch(e){r.push(false)}`).join("")}parent.postMessage({lernlabor:1,checks:r},"*")});<\/script>`;
  return body;
}

/* ---------- Ausführen ---------- */
const prefs = {javaLang:"de"};
async function run(lang, src, opts = {}) {
  const L = LANG[lang];
  if (L.runner === "js") return runJS(src, opts);
  if (L.runner === "java") return pool("java").run({src, input:opts.input || [], eof:!!opts.eof, seed:opts.seed || 1, lang:prefs.javaLang === "en" ? "en" : "de"});
  if (L.runner === "python") return pool("python").run({src, input:opts.input || [], eof:!!opts.eof, seed:opts.seed || 1});
  if (L.runner === "sql") return pool("sql").run({src, setup:opts.setup || ""});
  return {status:"ok"};
}

/* ---------- Editor ---------- */
const coarse = () => window.matchMedia && matchMedia("(pointer: coarse)").matches;
const KEYS = ["⇥", "{", "}", "(", ")", "[", "]", ";", "\"", "'", "=", "<", ">", ":", ".", ",", "+", "-", "*", "/"];
function createEditor(host, {lang, value = "", onChange, onRun, label}) {
  const L = LANG[lang];
  host.innerHTML = `<div class="ed"><div class="ed-scroll"><div class="ed-gut" aria-hidden="true"></div><div class="ed-area"><pre class="ed-hl" aria-hidden="true"><code></code></pre><textarea class="ed-ta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="${esc(label || "Code-Editor")}"></textarea></div></div></div>
  <div class="ed-keys" role="toolbar" aria-label="Sonderzeichen">${KEYS.map(k => `<button type="button" tabindex="-1" data-key="${esc(k)}">${esc(k === "⇥" ? "Tab" : k)}</button>`).join("")}</div>`;
  const ta = host.querySelector(".ed-ta"), code = host.querySelector(".ed-hl code"), gut = host.querySelector(".ed-gut"), keys = host.querySelector(".ed-keys");
  let errLines = new Set(), lastLines = 0;
  ta.value = value;
  function paint() {
    const v = ta.value;
    let html = highlight(L.hl, v);
    if (errLines.size) {
      const lines = html.split("\n");
      errLines.forEach(n => { if (lines[n - 1] !== undefined) lines[n - 1] = `<span class="ed-err">${lines[n - 1] || " "}</span>`; });
      html = lines.join("\n");
    }
    code.innerHTML = html + "\n";
    const count = v.split("\n").length;
    if (count !== lastLines || errLines.size) {
      lastLines = count;
      let g = "";
      for (let i = 1; i <= count; i++) g += errLines.has(i) ? `<b>${i}</b>\n` : i + "\n";
      gut.innerHTML = g;
    }
  }
  const fixQuotes = () => {
    const v = ta.value;
    if (!/[“”„‘’‚«»]/.test(v)) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = v.replace(/[“”„«»]/g, '"').replace(/[‘’‚]/g, "'");
    ta.setSelectionRange(s, e);
  };
  function insert(text) {
    ta.focus();
    let ok = false;
    try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
    if (!ok) { ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
  }
  ta.addEventListener("input", () => { fixQuotes(); if (errLines.size) errLines = new Set(); paint(); onChange && onChange(ta.value); });
  ta.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); onRun && onRun(); return; }
    if (e.key === "Tab" && !e.altKey && !e.metaKey && !e.ctrlKey) {
      const s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
      if (s === en && !e.shiftKey) { e.preventDefault(); insert(L.indent); return; }
      e.preventDefault();
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const block = v.slice(ls, en);
      const changed = e.shiftKey ? block.replace(new RegExp("^( {1," + L.indent.length + "}|\\t)", "gm"), "") : block.replace(/^/gm, L.indent);
      ta.setSelectionRange(ls, en);
      insert(changed);
      ta.setSelectionRange(ls, ls + changed.length);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      const s = ta.selectionStart, v = ta.value;
      const ls = v.lastIndexOf("\n", s - 1) + 1;
      const line = v.slice(ls, s);
      let ind = line.match(/^[ \t]*/)[0];
      const before = line.trimEnd();
      const after = v[ta.selectionEnd];
      if (/[{[(]$/.test(before) || (lang === "python" && /:$/.test(before.replace(/#.*$/, "").trimEnd()))) {
        e.preventDefault();
        if (/[}\])]/.test(after || "") && /[{[(]$/.test(before)) { insert("\n" + ind + L.indent + "\n" + ind); const p = ta.selectionStart - ind.length - 1; ta.setSelectionRange(p, p); }
        else insert("\n" + ind + L.indent);
        return;
      }
      e.preventDefault();
      insert("\n" + ind);
      return;
    }
    if (e.key === "}" && /^[ \t]+$/.test(ta.value.slice(ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1, ta.selectionStart)) && ta.selectionStart === ta.selectionEnd) {
      const s = ta.selectionStart, ls = ta.value.lastIndexOf("\n", s - 1) + 1, cur = ta.value.slice(ls, s);
      if (cur.length >= L.indent.length) { e.preventDefault(); ta.setSelectionRange(s - L.indent.length, s); insert("}"); }
    }
  });
  keys.addEventListener("pointerdown", e => { if (e.target.closest("[data-key]")) e.preventDefault(); });
  keys.addEventListener("click", e => {
    const b = e.target.closest("[data-key]");
    if (!b) return;
    const k = b.dataset.key;
    insert(k === "⇥" ? L.indent : k);
  });
  const showKeys = () => host.classList.toggle("keys-on", coarse() && document.activeElement === ta);
  ta.addEventListener("focus", showKeys);
  ta.addEventListener("blur", () => setTimeout(showKeys, 120));
  paint();
  return {
    el:host, ta,
    get value() { return ta.value; },
    set value(v) { ta.value = v; errLines = new Set(); paint(); },
    focus() { ta.focus(); },
    markErrors(lines) { errLines = new Set(lines.filter(n => n > 0)); paint(); },
    goLine(n) {
      const v = ta.value.split("\n");
      let p = 0;
      for (let i = 0; i < n - 1 && i < v.length; i++) p += v[i].length + 1;
      ta.focus();
      ta.setSelectionRange(p, p + (v[n - 1] || "").length);
      const lh = parseFloat(getComputedStyle(ta).lineHeight) || 21;
      const sc = host.querySelector(".ed-scroll");
      sc.scrollTop = Math.max(0, (n - 3) * lh);
    }
  };
}

/* ---------- Ausgabe ---------- */
function chunksHTML(chunks) {
  return chunks.map(c => c.k === "out" ? esc(c.s) : `<span class="o-${c.k}">${esc(c.s)}</span>`).join("");
}
function errorLines(lang, res) {
  if (lang === "java" && res.errors) return res.errors.map(e => e.line);
  const text = (res.out || []).filter(c => c.k === "err").map(c => c.s).join("");
  if (lang === "python") { const m = [...text.matchAll(/File "main\.py", line (\d+)/g)]; return m.length ? [+m[m.length - 1][1]] : []; }
  if (lang === "java") { const m = text.match(/\((?:\w+)\.java:(\d+)\)/); return m ? [+m[1]] : []; }
  if (lang === "javascript") return res.line ? [res.line] : [];
  if (lang === "sql") return res.line ? [res.line] : [];
  return [];
}
const fmtMs = ms => ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(1).replace(".", ",")} s`;
function pyHint(text) {
  const H = [
    [/SyntaxError: '\(' was never closed|SyntaxError: '\[' was never closed|SyntaxError: '\{' was never closed/, "Eine Klammer wurde geöffnet, aber nicht wieder geschlossen."],
    [/SyntaxError: expected ':'/, "Hinter if, else, for, while, def und class steht in Python ein Doppelpunkt."],
    [/SyntaxError: unterminated string literal/, "Ein Text in Anführungszeichen wurde nicht geschlossen."],
    [/IndentationError: expected an indented block/, "Nach einer Zeile mit Doppelpunkt muss der nächste Block eingerückt sein (meist 4 Leerzeichen)."],
    [/IndentationError: unexpected indent/, "Diese Zeile ist eingerückt, obwohl hier kein neuer Block beginnt."],
    [/IndentationError: unindent does not match/, "Die Einrückung passt zu keiner Ebene darüber. Nutze überall gleich viele Leerzeichen."],
    [/TabError/, "Tabs und Leerzeichen sind gemischt. Nutze nur Leerzeichen."],
    [/SyntaxError: invalid syntax\. Maybe you meant '==' or ':=' instead of '='\?/, "In einer Bedingung vergleichst du mit ==. Ein einzelnes = ist eine Zuweisung."],
    [/SyntaxError/, "Python versteht diese Zeile nicht. Prüfe Klammern, Doppelpunkte und Anführungszeichen."],
    [/NameError: name '(.+?)' is not defined/, "Diesen Namen kennt Python nicht. Prüfe die Schreibweise (Groß- und Kleinschreibung zählt) und ob die Variable vorher einen Wert bekommen hat."],
    [/TypeError: can only concatenate str \(not "(\w+)"\) to str/, "Text und Zahl lassen sich nicht mit + verbinden. Wandle die Zahl mit str() um oder nutze einen f-String: f\"Alter: {alter}\"."],
    [/TypeError: unsupported operand type\(s\) for [+\-*/]+: 'int' and 'str'|TypeError: unsupported operand type\(s\) for [+\-*/]+: 'str' and 'int'/, "Zahl und Text passen nicht zusammen. input() liefert immer Text, wandle ihn mit int() oder float() um."],
    [/TypeError: '<' not supported between instances of 'str' and 'int'|TypeError: '>' not supported between instances of 'str' and 'int'/, "Text und Zahl lassen sich nicht vergleichen. Wandle die Eingabe mit int() um."],
    [/ValueError: invalid literal for int\(\) with base 10/, "Der Text ist keine ganze Zahl. Bei Kommazahlen hilft float(), Leerzeichen entfernt strip()."],
    [/ValueError: could not convert string to float/, "Der Text ist keine Zahl. Python erwartet einen Punkt als Dezimaltrennzeichen, also 3.5 statt 3,5."],
    [/ZeroDivisionError/, "Du teilst durch 0. Prüfe den Teiler vorher mit if."],
    [/IndexError: list index out of range/, "Den Index gibt es in der Liste nicht. Gültig sind 0 bis len(liste) - 1."],
    [/IndexError: string index out of range/, "Die Position gibt es im Text nicht. Gültig sind 0 bis len(text) - 1."],
    [/KeyError/, "Diesen Schlüssel gibt es im Dictionary nicht. Mit .get(schlüssel) bekommst du None statt eines Fehlers."],
    [/AttributeError: '(\w+)' object has no attribute '(\w+)'/, "Dieser Datentyp hat keine Methode oder Eigenschaft mit dem Namen. Prüfe die Schreibweise."],
    [/RecursionError/, "Die Funktion ruft sich ohne Ende selbst auf. Fehlt die Abbruchbedingung?"],
    [/TypeError: (\w+)\(\) missing (\d+) required positional argument/, "Beim Aufruf fehlen Argumente. Die Funktion erwartet mehr Werte in den Klammern."],
    [/TypeError: (\w+)\(\) takes (\d+) positional arguments? but (\d+) (were|was) given/, "Beim Aufruf stehen mehr Argumente in den Klammern, als die Funktion annimmt."],
    [/UnboundLocalError/, "Die Variable wird in der Funktion verändert, bevor sie dort einen Wert hat. Übergib sie als Parameter oder gib das Ergebnis mit return zurück."],
    [/EOFError/, "Das Programm wollte noch eine Eingabe lesen, es kam aber keine mehr."]
  ];
  for (const [re, h] of H) if (re.test(text)) return h;
  return "";
}
function jsHint(text) {
  const H = [
    [/ReferenceError: (\w+) is not defined/, "Diesen Namen kennt JavaScript nicht. Prüfe die Schreibweise und ob die Variable mit let oder const angelegt wurde."],
    [/TypeError: Assignment to constant variable/, "Eine const-Variable kannst du nicht neu zuweisen. Nimm let, wenn sich der Wert ändern soll."],
    [/TypeError: Cannot read properties of (undefined|null)/, "Die Variable hat hier keinen Wert (undefined oder null). Prüfe, ob sie vorher gesetzt wurde."],
    [/TypeError: (.+) is not a function/, "Das, was du aufrufst, ist keine Funktion. Prüfe Schreibweise und Klammern."],
    [/SyntaxError: Unexpected end of input/, "Eine Klammer oder ein Block wurde nicht geschlossen."],
    [/SyntaxError: missing \) after argument list/, "Beim Funktionsaufruf fehlt eine schließende Klammer oder ein Komma."],
    [/SyntaxError: Invalid or unexpected token/, "Hier steht ein Zeichen, das JavaScript nicht erwartet, oft ein nicht geschlossener Text."],
    [/SyntaxError: Identifier '(\w+)' has already been declared/, "Den Namen gibt es schon. Mit let oder const legt man eine Variable nur einmal an."],
    [/SyntaxError/, "JavaScript versteht diese Zeile nicht. Prüfe Klammern und Anführungszeichen."],
    [/RangeError: Maximum call stack size exceeded/, "Eine Funktion ruft sich ohne Ende selbst auf. Fehlt die Abbruchbedingung?"]
  ];
  for (const [re, h] of H) if (re.test(text)) return h;
  return "";
}
function sqlHint(msg) {
  const H = [
    [/no such table: (\w+)/, "Diese Tabelle gibt es nicht. Die Übungsdatenbank hat die Tabellen geraete, mitarbeiter und tickets."],
    [/no such column: (\S+)/, "Diese Spalte gibt es nicht. Prüfe die Schreibweise, zum Beispiel mit SELECT * FROM tabelle."],
    [/near "(.+?)": syntax error/, "SQL versteht die Anweisung an dieser Stelle nicht. Prüfe Schlüsselwörter, Kommas und Anführungszeichen."],
    [/incomplete input/, "Die Anweisung ist nicht vollständig. Oft fehlt ein Wert oder eine Klammer."],
    [/UNIQUE constraint failed/, "Dieser Wert muss eindeutig sein und kommt schon vor."],
    [/NOT NULL constraint failed/, "Diese Spalte darf nicht leer sein."],
    [/FOREIGN KEY constraint failed/, "Der Fremdschlüssel verweist auf einen Datensatz, den es nicht gibt."],
    [/misuse of aggregate/, "Aggregatfunktionen wie COUNT oder SUM gehören nicht in WHERE, sondern in SELECT oder HAVING."],
    [/ambiguous column name/, "Die Spalte gibt es in mehreren Tabellen. Schreibe den Tabellennamen davor, zum Beispiel tickets.id."]
  ];
  for (const [re, h] of H) if (re.test(msg)) return h;
  return "";
}

/* ---------- Komplette Arbeitsfläche: Editor plus Terminal ---------- */
function mount(host, o) {
  const lang = o.lang, L = LANG[lang];
  const store = o.store || null;
  let saved = null;
  try { saved = store ? localStorage.getItem(store) : null; } catch (e) {}
  const initial = saved !== null ? saved : (o.code || "");
  host.innerHTML = `<div class="ide${o.check ? " has-check" : ""}" style="--c:${o.color || "#0a84ff"}">
    <div class="ide-bar"><span class="ide-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ide-file">${esc(o.file || L.file)}</span><span class="ide-sp"></span>
      ${o.reset !== false ? `<button class="ide-btn" type="button" data-ide="reset" aria-label="Code zurücksetzen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4.5V9h4.5"/></svg></button>` : ""}
      ${o.check ? `<button class="ide-run ide-check" type="button" data-ide="check"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>Prüfen</button>` : ""}
      <button class="ide-run" type="button" data-ide="run" aria-label="Ausführen"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l11.3-7.2a1 1 0 0 0 0-1.7L8.5 3.94A1 1 0 0 0 7 4.8z" fill="currentColor"/></svg><span class="ide-lbl">Ausführen</span></button></div>
    <div class="ide-ed"></div>
    <div class="ide-out" hidden></div>
  </div>`;
  const out = host.querySelector(".ide-out");
  const ed = createEditor(host.querySelector(".ide-ed"), {lang, value:initial, label:o.label, onRun:() => doRun(), onChange:v => { try { if (store) localStorage.setItem(store, v); } catch (e) {} o.onChange && o.onChange(v); }});
  let inputs = [], seed = 1, busy = false, runToken = 0;
  const pl = L.runner === "python" ? pool("python") : L.runner === "java" ? pool("java") : L.runner === "sql" ? pool("sql") : null;
  if (pl) {
    const off = pl.on(ev => {
      if (!out.querySelector(".term-wait")) return;
      if (ev.loading) out.querySelector(".term-wait").textContent = ev.loading + " …";
    });
    host.addEventListener("ide:destroy", off);
  }
  function termShell(cmd, inner, foot = "") {
    return `<div class="term" role="log" aria-live="polite"><div class="term-top"><span class="term-cmd"><b>$</b> ${esc(cmd)}</span><span class="term-meta"></span></div><div class="term-body">${inner}</div>${foot}</div>`;
  }
  function showWait(text) {
    out.hidden = false;
    out.innerHTML = termShell(L.cmd, `<div class="term-wait">${esc(text)}</div>`);
  }
  function hintCard(text) {
    return text ? `<div class="term-hint"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 17.5h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2V17h5v-1.2c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/></svg><div>${text}</div></div>` : "";
  }
  function render(res) {
    out.hidden = false;
    const cmd = res.cmd || L.cmd;
    if (lang === "sql") return renderSQL(res);
    const text = chunksHTML(res.out || []);
    let body;
    if (res.status === "input") {
      const all = (res.out || []).map(c => c.s).join("");
      const cutAt = all.lastIndexOf("\n") + 1;
      let pos = 0, head = "", tail = "";
      for (const c of res.out || []) {
        const s = c.s, start = pos, end = pos + s.length;
        pos = end;
        const a = s.slice(0, Math.max(0, Math.min(s.length, cutAt - start)));
        const b = s.slice(Math.max(0, cutAt - start));
        if (a) head += c.k === "out" ? esc(a) : `<span class="o-${c.k}">${esc(a)}</span>`;
        if (b) tail += c.k === "out" ? esc(b) : `<span class="o-${c.k}">${esc(b)}</span>`;
      }
      body = `<pre class="term-out">${head}</pre><div class="term-ask"><span class="term-prompt">${tail}</span><input class="term-in" type="text" enterkeyhint="send" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Eingabe für das Programm"><button class="term-eof" type="button" data-ide="eof" title="Keine weiteren Eingaben (wie Strg+D)">Ende</button></div>`;
    } else body = `<pre class="term-out${/^(compile|error|exception)$/.test(res.status) ? " nowrap" : ""}">${text || (res.status === "ok" || res.status === "exit" ? '<span class="o-meta">(keine Ausgabe)</span>' : "")}</pre>`;
    let foot = "";
    const ms = res.ms ? fmtMs(res.ms) : "";
    const st = res.status;
    if (st === "ok" || st === "exit") foot = `<div class="term-end ok">Programm beendet${st === "exit" ? ` mit Exit-Code ${res.code}` : ""}${ms ? ` · ${ms}` : ""}</div>`;
    else if (st === "compile") foot = `<div class="term-end bad">Kompilieren fehlgeschlagen. Das Programm wurde nicht gestartet.</div>`;
    else if (st === "exception" || st === "error") foot = `<div class="term-end bad">Programm mit Fehler beendet${res.code != null ? ` · Exit-Code ${res.code}` : ""}</div>`;
    else if (st === "timeout") foot = `<div class="term-end bad">Abgebrochen: Das Programm lief zu lange. Vielleicht eine Endlosschleife?</div>`;
    else if (st === "outlimit") foot = `<div class="term-end bad">Abgebrochen: zu viel Ausgabe.</div>`;
    else if (st === "nomain") foot = `<div class="term-end bad">Keine main-Methode gefunden.</div>`;
    else if (st === "offline") foot = `<div class="term-end bad">Keine Verbindung. ${lang === "python" ? "Python" : "SQL"} wird beim ersten Mal aus dem Internet geladen.</div>`;
    let hint = "";
    if (lang === "java") hint = res.errors && res.errors.length ? res.errors[0].hint : res.hint || "";
    else if (lang === "python" && st === "error") hint = pyHint((res.out || []).filter(c => c.k === "err").map(c => c.s).join(""));
    else if (lang === "javascript" && st === "error") hint = jsHint((res.out || []).filter(c => c.k === "err").map(c => c.s).join(""));
    out.innerHTML = termShell(cmd, body, foot) + hintCard(hint);
    const lines = errorLines(lang, res);
    ed.markErrors(lines);
    if (lines.length) {
      out.querySelectorAll(".o-err").forEach(el => { el.innerHTML = el.innerHTML.replace(/(Main\.java|[A-Z]\w*\.java|main\.py|script\.js):(\d+)|line (\d+)/g, (m, f, a, b) => `<button class="o-line" type="button" data-line="${a || b}">${m}</button>`); });
    }
    const inp = out.querySelector(".term-in");
    if (inp) {
      inp.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); const v = inp.value; inputs.push(v); inp.disabled = true; doRun(true); }
        if ((e.key === "d" || e.key === "D") && e.ctrlKey) { e.preventDefault(); doRun(true, true); }
      });
      requestAnimationFrame(() => { inp.focus({preventScroll:true}); keepVisible(); });
    }
  }
  function renderSQL(res) {
    let body = "";
    for (const r of res.results || []) {
      if (r.columns.length) {
        body += `<div class="sql-res"><div class="sql-meta">${r.rows.length} ${r.rows.length === 1 ? "Zeile" : "Zeilen"}</div><div class="sql-scroll"><table class="sql-t"><thead><tr>${r.columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${r.rows.slice(0, 200).map(row => `<tr>${row.map(v => `<td${v === null ? ' class="null"' : typeof v === "number" ? ' class="num"' : ""}>${v === null ? "NULL" : esc(String(v))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${r.rows.length > 200 ? `<div class="sql-meta">… ${r.rows.length - 200} weitere Zeilen</div>` : ""}</div>`;
      } else body += `<div class="sql-ok">${esc(r.sql.split(/\s+/).slice(0, 2).join(" ").toUpperCase())} ausgeführt${r.changes ? ` · ${r.changes} ${r.changes === 1 ? "Zeile" : "Zeilen"} betroffen` : ""}</div>`;
    }
    if (res.error) body += `<pre class="term-out"><span class="o-err">Fehler${res.line ? ` in Zeile ${res.line}` : ""}: ${esc(res.error)}</span></pre>`;
    if (!body) body = `<pre class="term-out"><span class="o-meta">(keine Anweisung)</span></pre>`;
    const foot = res.error ? `<div class="term-end bad">Abfrage mit Fehler beendet</div>` : `<div class="term-end ok">Fertig${res.ms ? ` · ${fmtMs(res.ms)}` : ""}</div>`;
    out.innerHTML = termShell(L.cmd, body, foot) + hintCard(res.error ? sqlHint(res.error) : "");
    ed.markErrors(res.line ? [res.line] : []);
  }
  function keepVisible() {
    const r = out.getBoundingClientRect();
    if (r.bottom > innerHeight - 90) window.scrollBy({top:Math.min(r.bottom - innerHeight + 110, r.top - 70), behavior:"smooth"});
  }
  async function doRun(isReplay = false, eof = false) {
    if (lang === "web") { renderWeb(); return; }
    if (busy && !isReplay) return;
    const tok = ++runToken;
    if (!isReplay) { inputs = []; seed = (Math.random() * 4294967295) >>> 0; }
    busy = true;
    host.classList.add("running");
    if (!isReplay) {
      const p = pl && pl.info;
      showWait(lang === "python" && !(p && p.version) ? "Python wird geladen …" : lang === "sql" && !(p && p.version) ? "SQLite wird geladen …" : "Läuft …");
    }
    const res = await run(lang, ed.value, {input:inputs.slice(), eof, seed, setup:o.setup});
    if (tok !== runToken) return;
    busy = false;
    host.classList.remove("running");
    if (lang === "python" && res.status !== "offline" && pl.info.version) res.cmd = `python3 main.py`;
    render(res);
    if (!isReplay) keepVisible();
    o.onResult && o.onResult(res);
  }
  let webMsgs = [];
  function renderWeb(checks, onChecks) {
    out.hidden = false;
    webMsgs = [];
    out.innerHTML = `<div class="web"><div class="web-bar"><span class="web-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="web-url">Vorschau · index.html</span></div><iframe class="web-frame" sandbox="allow-scripts allow-modals allow-forms" title="Vorschau der Webseite"></iframe><pre class="web-log" hidden></pre></div>`;
    const fr = out.querySelector("iframe"), log = out.querySelector(".web-log");
    const onMsg = e => {
      if (e.source !== fr.contentWindow || !e.data || !e.data.lernlabor) return;
      if (e.data.checks) { onChecks && onChecks(e.data.checks); return; }
      webMsgs.push(e.data);
      log.hidden = false;
      log.innerHTML = webMsgs.map(m => `<span class="o-${m.k === "info" ? "meta" : m.k}">${esc(m.s)}</span>`).join("");
    };
    window.addEventListener("message", onMsg);
    host.addEventListener("ide:destroy", () => window.removeEventListener("message", onMsg), {once:true});
    fr.addEventListener("load", () => {
      try { fr.style.height = "320px"; } catch (e) {}
    });
    fr.srcdoc = webDoc(ed.value, checks);
    keepVisible();
  }
  host.addEventListener("click", e => {
    const b = e.target.closest("[data-ide]");
    if (b) {
      const a = b.dataset.ide;
      if (a === "run") doRun();
      if (a === "eof") doRun(true, true);
      if (a === "check") o.onCheck && o.onCheck();
      if (a === "reset") o.onReset ? o.onReset() : api.reset();
      return;
    }
    const ln = e.target.closest(".o-line");
    if (ln) ed.goLine(+ln.dataset.line);
  });
  if (pl && (lang === "python" || lang === "sql")) pl.warm();
  const api = {
    editor:ed,
    get code() { return ed.value; },
    set code(v) { ed.value = v; try { if (store) localStorage.setItem(store, v); } catch (e) {} },
    reset() { api.code = o.code || ""; out.hidden = true; out.innerHTML = ""; },
    run:doRun,
    renderWeb,
    showResult:render,
    out,
    destroy() { host.dispatchEvent(new Event("ide:destroy")); }
  };
  return api;
}

/* ---------- Aufgaben prüfen ---------- */
const norm = s => s.replace(/\r/g, "").split("\n").map(l => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
function compareOut(actual, expected, loose) {
  const a = norm(actual), e = norm(expected);
  if (a === e) return true;
  if (!loose) return false;
  const al = a.split("\n").map(x => x.trim()), el = e.split("\n").map(x => x.trim()).filter(Boolean);
  let i = 0;
  for (const line of el) {
    while (i < al.length && !(al[i] === line || al[i].endsWith(" " + line) || al[i].endsWith(":" + line) || al[i].endsWith(line) && line.length > 2)) i++;
    if (i >= al.length) return false;
    i++;
  }
  return true;
}
async function check(lang, src, task) {
  if (lang === "web") return null;
  if (lang === "sql") {
    const mine = await run("sql", src, {setup:task.setup});
    const ref = await run("sql", task.solution, {setup:task.setup});
    const last = r => (r.results || []).filter(x => x.columns.length).pop();
    const a = last(mine), b = last(ref);
    if (mine.status !== "ok") return {ok:false, results:[{ok:false, label:"Abfrage", detail:mine.error || "Fehler"}], res:mine};
    if (!a) return {ok:false, results:[{ok:false, label:"Ergebnis", detail:"Deine Anweisungen liefern keine Tabelle. Am Ende muss ein SELECT stehen."}], res:mine};
    const key = row => JSON.stringify(row.map(v => typeof v === "number" ? Math.round(v * 1e6) / 1e6 : v));
    const sameCols = a.columns.length === b.columns.length;
    let sameRows;
    if (task.ordered) sameRows = a.rows.length === b.rows.length && a.rows.every((r, i) => key(r) === key(b.rows[i]));
    else { const x = a.rows.map(key).sort(), y = b.rows.map(key).sort(); sameRows = x.length === y.length && x.every((v, i) => v === y[i]); }
    const results = [
      {ok:sameCols, label:"Spalten", detail:sameCols ? `${a.columns.length} Spalten` : `Erwartet ${b.columns.length} Spalten, deine Abfrage liefert ${a.columns.length}.`},
      {ok:sameRows, label:"Zeilen", detail:sameRows ? `${a.rows.length} ${a.rows.length === 1 ? "Zeile" : "Zeilen"} stimmen` : `Erwartet ${b.rows.length} ${b.rows.length === 1 ? "Zeile" : "Zeilen"}${task.ordered ? " in fester Reihenfolge" : ""}, deine Abfrage liefert ${a.rows.length}${a.rows.length === b.rows.length ? " mit anderen Werten" : ""}.`}
    ];
    return {ok:sameCols && sameRows, results, res:mine};
  }
  const results = [];
  let firstRes = null;
  for (const [i, t] of task.tests.entries()) {
    const res = await run(lang, src, {input:t.input || [], eof:true, seed:7});
    if (!firstRes) firstRes = res;
    const actual = (res.out || []).filter(c => c.k === "out").map(c => c.s).join("");
    let ok = res.status === "ok" || res.status === "exit";
    let detail = "";
    if (!ok) {
      detail = res.status === "compile" ? "Das Programm lässt sich nicht kompilieren." : res.status === "timeout" ? "Das Programm lief zu lange." : res.status === "input" ? "Das Programm wartet auf mehr Eingaben, als der Test liefert." : "Das Programm ist mit einem Fehler abgebrochen.";
    } else if (!compareOut(actual, t.expect, t.loose || (t.input && t.input.length > 0))) {
      ok = false;
      detail = "Die Ausgabe weicht ab.";
    }
    results.push({ok, label:t.label || `Test ${i + 1}${t.input && t.input.length ? ` mit Eingabe ${t.input.join(", ")}` : ""}`, detail, expect:t.expect, actual:norm(actual), res});
    if (res.status === "compile") break;
  }
  return {ok:results.every(r => r.ok), results, res:firstRes};
}

window.CodeTerm = {mount, run, check, highlight, LANG, prefs, warm:name => pool(name).warm(), webDoc};
})();
