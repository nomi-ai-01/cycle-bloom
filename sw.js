const CACHE = "cycle-bloom-shell-v2";
const FILES = ["./","./index.html","./styles.css","./app.js","./translations.js","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window"}).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow("./")));
});
