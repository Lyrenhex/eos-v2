const ASSETS = [
  "index.html",
  "app.js",
  "app.css",
  "theme.dark.css",
  "func.js",
  "Chart.bundle.min.js",
  "logo.png",
  "offline.html",
  "manifest.json"
];

let cache_name = "Eos_3.0.0-2";

self.addEventListener("install", event => {
  console.log("installing...");
  event.waitUntil(
    caches
      .open(cache_name)
      .then(cache => {
        return cache.addAll(ASSETS);
      })
      .catch(err => console.log(err))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);

        response = fetch(event.request);
        caches.open(cache_name).then(cache => {
          cache.put(event.request.url, response.clone());
        });
        return response;
      }).catch(error => { })
  );
});

self.addEventListener('activate', event => {
  const cacheAllowlist = [cache_name];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});