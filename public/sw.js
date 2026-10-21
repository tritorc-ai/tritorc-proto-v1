// Minimal app-shell service worker. Scope: installability only.
// Deliberately does NOT cache page data (catalogues, product/service
// content) — those must always come from the network per the "always pull
// latest from Strapi" requirement. Only static, rarely-changing shell assets
// are cached so the app can be added to the home screen.

const CACHE_NAME = "tritorc-shell-v1";
const SHELL_ASSETS = [
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Everything else (pages, Strapi-backed data) always goes to the network.
});
