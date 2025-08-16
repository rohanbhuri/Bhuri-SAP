const CACHE_NAME = 'Beax RM-v1.0.0';
const urlsToCache = [
  '/',
  '/login',
  '/signup',
  '/modules',
  '/dashboard',
  '/manifest.json',
  '/config/assets/beaxrm/icons/BEAX-icon.png',
  '/config/assets/beaxrm/icons/BEAX.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});