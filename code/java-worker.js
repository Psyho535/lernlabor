/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Führt Java-Programme in einem eigenen Thread aus, damit die App auch bei Endlosschleifen flüssig bleibt. */
importScripts("java-syntax.js", "java-rt.js", "java-lib.js", "java-core.js", "java-de.js");
self.onmessage = e => {
  const {id, src, input, eof, seed, lang} = e.data;
  let res;
  try { res = self.JV.run(src, {input, eof, seed, lang, maxMs:6000}); }
  catch (err) { res = {status:"internal", out:[{k:"err", s:"Interner Fehler im Übungsterminal: " + (err && err.message) + "\n"}], code:1}; }
  self.postMessage({id, res});
};
self.postMessage({ready:true});
