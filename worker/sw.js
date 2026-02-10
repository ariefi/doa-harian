const CACHE_NAME = "doa-harian-cache-1770708338";

const urlsToCache = [
  "/index.html",
  "/css/style.css",
  "/src/app/main.js",
  "/src/ui/renderer.js",
  "/src/data/doa.json",
  "/icons/favicon.png",
  "/site.webmanifest"
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