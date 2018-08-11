/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
var PRECACHE = 'precache//1.0.12v';
var RUNTIME = 'runtime';

'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'bolao-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    //'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;


/*elf.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  let txtNot = event.data.json().notification;
  console.log(txtNot);

  event.waitUntil(
      event.showNotification(txtNot.title, {
          body: txtNot.body,
          icon: '/assets/imgs/logo.png'
      })
  );
});

self.addEventListener('install', function (e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
      caches.open(dataCacheName).then(function (cache) {
          console.log('[Service Worker] Caching app shell');
          return cache.addAll(filesToCache);
      }).then(function (e) {
          return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log("activate")
  var currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
      caches.keys().then(cacheNames => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
          return Promise.all(cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
          }));
      }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') return;

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function () {
      // Try to get the response from a cache.
      const cache = await caches.open(dataCacheName);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
          // If we found a match in the cache, return it, but also
          // update the entry in the cache in the background.
          event.waitUntil(cache.add(event.request));
          return cachedResponse;
      }

      // If we didn't find a match in the cache, use the network.
      return fetch(event.request);
  }());
});*/