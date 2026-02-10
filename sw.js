const CACHE_NAME = "doa-harian-cache-1770703526";

const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./data/doa.json",
  "./assets/favicon.png",
  "./site.webmanifest"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVATE (hapus cache lama)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {

  // hanya handle request GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});