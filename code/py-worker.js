/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Modul-Worker. Echtes Python (CPython 3.14) im Browser über Pyodide. Läuft in einem eigenen Thread.
   Eingaben kommen Zeile für Zeile aus dem Terminal. Fehlt eine Eingabe, meldet der Worker das, und das Programm
   wird mit allen Eingaben neu gestartet. So verhält es sich für Lernende wie ein echtes Terminal. */
const PY_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
let py = null;
let inputs = [], inIdx = 0, eof = false, waiting = false, cut = -1, chunks = [], outLen = 0, pending = new Uint8Array(0);
const MAX = 100000;
let decOut = new TextDecoder(), decErr = new TextDecoder();
// Wartet ein Programm auf Eingabe, bricht der Lesevorgang absichtlich ab. Pyodide meldet das sonst als Fehler in der Konsole.
const consoleError = console.error.bind(console);
console.error = (...a) => { if (!waiting) consoleError(...a); };
function push(k, s) {
  if (!s || waiting) return;
  if (outLen + s.length > MAX) { s = s.slice(0, Math.max(0, MAX - outLen)); outLen = MAX + 1; }
  else outLen += s.length;
  const last = chunks[chunks.length - 1];
  if (last && last.k === k) last.s += s; else chunks.push({k, s});
}
const HARNESS = `
import sys, traceback, random, builtins, linecache
def _lernlabor_run(code, seed):
    random.seed(seed)
    linecache.cache["main.py"] = (len(code), None, code.splitlines(True), "main.py")
    g = {"__name__": "__main__", "__builtins__": builtins}
    rc = 0
    try:
        c = compile(code, "main.py", "exec")
    except SyntaxError as e:
        traceback.print_exception(e, limit=0)
        sys.stderr.flush()
        return 1
    try:
        exec(c, g)
    except SystemExit as e:
        if e.code is None or e.code == 0:
            rc = 0
        elif isinstance(e.code, int):
            rc = e.code
        else:
            print(e.code, file=sys.stderr)
            rc = 1
    except BaseException as e:
        tb = e.__traceback__
        while tb is not None and tb.tb_frame.f_code.co_filename != "main.py":
            tb = tb.tb_next
        traceback.print_exception(type(e), e, tb)
        rc = 1
    finally:
        try:
            sys.stdout.flush()
            sys.stderr.flush()
        except Exception:
            pass
    return rc
`;
async function boot() {
  try {
    self.postMessage({loading:"Python wird geladen"});
    // Als Modul laden: funktioniert in allen aktuellen Browsern, auch wo importScripts von fremden Servern gesperrt ist
    const mod = await import(PY_URL + "pyodide.mjs");
    py = await mod.loadPyodide({indexURL:PY_URL});
    py.setStdout({write:buf => { push("out", decOut.decode(buf, {stream:true})); return buf.length; }});
    py.setStderr({write:buf => { push("err", decErr.decode(buf, {stream:true})); return buf.length; }});
    // Roher Lesemodus: Jede Leseanfrage bekommt höchstens eine Zeile. So holt Pyodide nichts im Voraus.
    const enc = new TextEncoder();
    py.setStdin({read:buf => {
      if (!pending.length) {
        if (inIdx < inputs.length) { const l = inputs[inIdx++]; push("in", l + "\n"); pending = enc.encode(l + "\n"); }
        else if (eof) return 0;
        else { cut = chunks.length; waiting = true; throw new Error("Eingabe fehlt"); }
      }
      const n = Math.min(buf.length, pending.length);
      buf.set(pending.subarray(0, n));
      pending = pending.subarray(n);
      return n;
    }});
    py.runPython(HARNESS);
    const version = py.runPython("import sys; sys.version.split()[0]");
    self.postMessage({ready:true, version});
  } catch (err) {
    self.postMessage({failed:true, message:String(err && err.message || err)});
  }
}
const booting = boot();
self.onmessage = async e => {
  await booting;
  const {id, src, input, eof:isEof, seed} = e.data;
  if (!py) { self.postMessage({id, res:{status:"offline", out:[{k:"err", s:"Python konnte nicht geladen werden. Für den ersten Start braucht die App einmal Internet.\n"}], code:1}}); return; }
  inputs = input || []; inIdx = 0; eof = !!isEof; waiting = false; cut = -1; chunks = []; outLen = 0; pending = new Uint8Array(0);
  decOut = new TextDecoder(); decErr = new TextDecoder();
  const t0 = performance.now();
  let code = 0;
  try {
    const run = py.globals.get("_lernlabor_run");
    code = run(src, seed >>> 0);
    run.destroy && run.destroy();
  } catch (err) {
    if (!waiting) { push("err", "Interner Fehler: " + (err && err.message) + "\n"); code = 1; }
  }
  const status = waiting ? "input" : outLen > MAX ? "outlimit" : code === 0 ? "ok" : "error";
  self.postMessage({id, res:{status, code, out:chunks, ms:performance.now() - t0}});
};
