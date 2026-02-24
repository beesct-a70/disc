const CACHE_NAME = 'beesct-disc-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './questions-12.js',
  './questions-28.js',
  './manifest.webmanifest',
  './assets/logo.png',
  './assets/home.png',
  './assets/DISC.png',
  './assets/DISC-login.png',
  './assets/DISC-BPV.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

