const CACHE_NAME = 'my-pwa-cache';

// Recursos a cachear
const urlsToCache = [
 
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

this.addEventListener('fetch', function (event) {
  // it can be empty if you just want to get rid of that error
});