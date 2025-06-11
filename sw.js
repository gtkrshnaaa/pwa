// pwa-profile/sw.js

const CACHE_NAME = 'pwa-revalidate-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
];

// Saat install, cache file penting dulu
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Saat activate, hapus cache lama biar bersih
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: coba ambil dari network dulu, kalau gagal fallback ke cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Update cache dengan response terbaru
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse.clone();
      })
      .catch(() => {
        // Kalau offline / gagal fetch, fallback ke cache
        return caches.match(event.request);
      })
  );
});
