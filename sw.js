// Alles liegt im Cache; das Netz wird nur zum Aktualisieren befragt.
// Die Antworten selbst berührt der Service Worker nie — die stehen im
// verschlüsselten localStorage der Seite.
const CACHE = 'wbm-d2a57b61c0';
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "_ds/organic-d0ac29e4-0fab-4e47-9d87-35e8121265c7/styles.css",
  "_ds/organic-d0ac29e4-0fab-4e47-9d87-35e8121265c7/_ds_bundle.js",
  "WellbeingApp.dc.html",
  "ds-bundle.js",
  "fonts/body-latin-ext.woff2",
  "fonts/body-latin.woff2",
  "fonts/caprasimo-latin-ext.woff2",
  "fonts/caprasimo-latin.woff2",
  "react-dom.production.min.js",
  "react.production.min.js",
  "support.js"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    if (hit) {
      // Im Hintergrund erneuern, damit ein Update beim übernächsten Start greift.
      fetch(e.request).then(res => {
        if (res && res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      }).catch(() => {});
      return hit;
    }
    return fetch(e.request).then(res => {
      if (res && res.ok && e.request.url.startsWith(self.registration.scope)) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('index.html'));
  }));
});
