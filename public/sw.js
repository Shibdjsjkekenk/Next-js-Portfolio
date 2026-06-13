const CACHE_NAME = "portfolio-v3";

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/"]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker Activated");

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip chrome extensions
  if (url.protocol === "chrome-extension:") return;

  // Never cache APIs
  if (url.pathname.startsWith("/api")) return;

  // Never cache admin
  if (url.pathname.startsWith("/admin")) return;

  // Never cache login
  if (url.pathname.startsWith("/login")) return;

  // Only GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200
        ) {
          const clone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }

        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(
          event.request
        );

        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.match("/");
      })
  );
});