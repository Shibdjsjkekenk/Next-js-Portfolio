const CACHE_NAME = "portfolio-v6";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
      ]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
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

  // Don't touch API requests
  if (url.pathname.startsWith("/api")) {
    return;
  }

  // Don't touch admin pages
  if (url.pathname.startsWith("/admin")) {
    return;
  }

  // Don't touch login page
  if (url.pathname.startsWith("/login")) {
    return;
  }

  // GET only
  if (event.request.method !== "GET") {
    return;
  }

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