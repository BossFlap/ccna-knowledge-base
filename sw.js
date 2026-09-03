// Service Worker — Offline-Fähigkeit für die CCNA Knowledge Base
// CACHE-Version bei jedem Deploy zusammen mit ?v= in index.html erhöhen.
const CACHE = 'ccna-v5';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css?v=5',
  './js/data.js?v=5', './js/topics/01-fundamentals.js?v=5', './js/topics/02-access.js?v=5',
  './js/topics/03-connectivity.js?v=5', './js/topics/04-services.js?v=5', './js/topics/05-security.js?v=5',
  './js/topics/06-automation.js?v=5', './js/exam.js?v=5', './js/search.js?v=5', './js/learn.js?v=5',
  './js/subnet.js?v=5', './js/enhance.js?v=5', './js/settings.js?v=5', './js/app.js?v=5',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-512-maskable.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigation / index.html: Netzwerk zuerst, damit Updates ankommen; offline aus dem Cache
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }

  // Eigene Assets: Cache zuerst, im Hintergrund aktualisieren (stale-while-revalidate)
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(cached => {
      const network = fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; }).catch(() => cached);
      return cached || network;
    }));
    return;
  }

  // Fremde Ressourcen (Google Fonts): Netzwerk, Fallback Cache
  e.respondWith(fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; })
    .catch(() => caches.match(req)));
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
