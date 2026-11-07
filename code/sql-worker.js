/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
/* Echtes SQLite im Browser (sql.js). Jede Ausführung startet mit einer frischen Übungsdatenbank. */
const SQL_URL = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.14.2/";
let SQL = null;
const booting = (async () => {
  try {
    const res = await fetch(SQL_URL + "sql-wasm.js");
    if (!res.ok) throw new Error("sql-wasm.js: HTTP " + res.status);
    (0, eval)(await res.text());
    SQL = await self.initSqlJs({locateFile:f => SQL_URL + f});
    const v = new SQL.Database();
    const version = v.exec("select sqlite_version()")[0].values[0][0];
    v.close();
    self.postMessage({ready:true, version});
  } catch (err) { self.postMessage({failed:true, message:String(err && err.message || err)}); }
})();
function lineAt(src, off) { let l = 1; for (let i = 0; i < off && i < src.length; i++) if (src.charCodeAt(i) === 10) l++; return l; }
self.onmessage = async e => {
  await booting;
  const {id, src, setup} = e.data;
  if (!SQL) { self.postMessage({id, res:{status:"offline", results:[], error:"SQLite konnte nicht geladen werden. Für den ersten Start braucht die App einmal Internet."}}); return; }
  const t0 = performance.now();
  const db = new SQL.Database();
  const results = [];
  let error = null, errLine = 0;
  try { if (setup) db.exec(setup); } catch (err) { error = "Fehler in der Übungsdatenbank: " + err.message; }
  if (!error) {
    let it = null, offset = 0;
    try {
      it = db.iterateStatements(src);
      for (const stmt of it) {
        const sql = stmt.getSQL();
        const startOff = src.indexOf(sql.trim().slice(0, 12), offset);
        const line = lineAt(src, startOff >= 0 ? startOff : offset);
        offset = src.length - (it.getRemainingSQL() || "").length;
        const columns = stmt.getColumnNames();
        const rows = [];
        while (stmt.step()) { rows.push(stmt.get()); if (rows.length > 2000) break; }
        stmt.free();
        results.push({sql:sql.trim(), line, columns, rows, changes:columns.length ? 0 : db.getRowsModified()});
      }
    } catch (err) {
      error = err.message;
      errLine = lineAt(src, offset + ((src.slice(offset).match(/^\s*/) || [""])[0].length));
    }
  }
  db.close();
  self.postMessage({id, res:{status:error ? "error" : "ok", results, error, line:errLine, ms:performance.now() - t0}});
};
