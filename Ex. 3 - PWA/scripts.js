self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('Samochody').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/icon-192x192.png',
          '/icon-256x256.png',
          '/icon-384x384.png',
          '/icon-512x512.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  