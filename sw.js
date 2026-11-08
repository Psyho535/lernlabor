/*! IT-Lernlabor · © 2026 Alexander S. · Alle Rechte vorbehalten. Nutzung nur nach LICENSE. */
// Offline-Cache. Die Version ändert sich bei jedem Build, damit Handys die neue Fassung holen.
const CACHE = "lernlabor-20261108-230000";
// Python (Pyodide) und SQLite (sql.js) kommen einmalig vom CDN. Sie liegen in einem eigenen Cache,
// der App-Updates übersteht, weil die Versionsnummer in ihrer Adresse steht.
const RUNTIME = "lernlabor-laufzeiten-1";
const RUNTIME_HOSTS = ["cdn.jsdelivr.net", "cdnjs.cloudflare.com"];
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./content/netz.js", "./content/sicherheit.js", "./content/admin.js", "./content/arbeitsplatz.js", "./content/wirtschaft.js", "./content/ergaenzung.js", "./content/vertiefung.js", "./content/einfach.js",
  "./content/code-python.js", "./content/code-java.js", "./content/code-web.js", "./content/code-js.js", "./content/code-sql.js",
  "./code/term.js", "./code/java-syntax.js", "./code/java-rt.js", "./code/java-lib.js", "./code/java-core.js", "./code/java-de.js", "./code/java-worker.js", "./code/py-worker.js", "./code/sql-worker.js"];

self.addEventListener("install", e => {
  // cache: "reload" holt jede Datei frisch vom Server, nicht aus dem HTTP-Cache des Browsers
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(u => new Request(u, {cache:"reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== RUNTIME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Die App selbst: erst Netz (für neue Inhalte), ohne Netz aus dem Cache.
  if (req.mode === "navigate") {
    e.respondWith(
      Promise.race([fetch(req), timeout(4000)])
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res; })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }
  const url = new URL(req.url);
  const runtime = RUNTIME_HOSTS.includes(url.hostname) && /\/(pyodide\/v[\d.]+|ajax\/libs\/sql\.js\/[\d.]+)\//.test(url.pathname);
  // Alles andere (Icons, Schriften, Laufzeiten): erst Cache, sonst Netz und merken.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(runtime ? RUNTIME : CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit))
  );
});
