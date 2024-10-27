const cacheName = 'rsacs-app-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/main.js',
    '/package.json',
    '/preload.js',
    '/favicon/apple-touch-icon.png',
    '/favicon/favicon-48x48.png',
    '/favicon/favicon.ico',
    '/favicon/favicon.svg',
    'manifest.json',
    '/favicon/web-app-manifest-192x192.png',
    '/favicon/web-app-manifest-512x512.png',
    // add more assets as needed
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Caching assets');
            return cache.addAll(assetsToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/favicon/web-app-manifest-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});