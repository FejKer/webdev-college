self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('Samochody').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/webdev-college/Ex.%203%20-%20PWA/styles.css',
          '/webdev-college/Ex.%203%20-%20PWA/index.html',
          '/webdev-college/Ex.%203%20-%20PWA/',
          '/webdev-college/Ex.%203%20-%20PWA/icon-192x192.png',
          '/webdev-college/Ex.%203%20-%20PWA/icon-256x256.png',
          '/webdev-college/Ex.%203%20-%20PWA/icon-384x384.png',
          '/webdev-college/Ex.%203%20-%20PWA/icon-512x512.png'
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
  