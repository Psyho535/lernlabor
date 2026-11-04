// Offline-Cache. Die Version ändert sich bei jedem Build, damit Handys die neue Fassung holen.
const CACHE = "lernlabor-20261104-120000";
const CORE = ["./", "./index.html", "./manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
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
  // Alles andere (Icons, Schriften): erst Cache, sonst Netz und merken.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit))
  );
});