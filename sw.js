const C="cycle-bloom-v7",F=["./","./index.html","./manifest.webmanifest","./favicon-48.png","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.allSettled(F.map(f=>c.add(f)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;const u=new URL(r.url),fo=/(^|\.)(fonts\.googleapis|fonts\.gstatic)\.com$/.test(u.hostname);if(r.method!=="GET"||(u.origin!==location.origin&&!fo))return;
e.respondWith(fetch(r).then(x=>{if(x.ok||x.type==="opaque"){const c=x.clone();caches.open(C).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{for(const c of l){if("focus"in c)return c.focus()}return self.clients.openWindow("./")}))});
