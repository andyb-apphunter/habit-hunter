/* Habit Hunter offline support: always try for the newest version, fall back to the saved copy offline. */
const CACHE="habit-hunter-0.6.0";
const FILES=["./","index.html","privacy.html","manifest.webmanifest","firebase.js","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png",
 "fonts/nunito-400.woff2","fonts/nunito-600.woff2","fonts/nunito-700.woff2","fonts/nunito-800.woff2","fonts/nunito-900.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
