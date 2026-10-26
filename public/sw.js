// App-shell + Web Push service worker. Scope: installability and push
// notifications (push / notificationclick handlers at the bottom).
// Deliberately does NOT cache page data (catalogues, product/service
// content) — those must always come from the network per the "always pull
// latest from Strapi" requirement. Only static, rarely-changing shell assets
// are cached so the app can be added to the home screen.

const CACHE_NAME = "tritorc-shell-v3";
// /offline.html (self-contained, inline styles) and the logo it shows are cached so a page
// request made without a network gets a friendly screen instead of the browser's error page.
const OFFLINE_URL = "/offline.html";
const SHELL_ASSETS = [
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
  OFFLINE_URL,
  "/brand/tritorc-logo.png",
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

  // Page navigations go to the network as always; only if that fails (no connection) the
  // cached offline screen is shown. Pages and Strapi-backed data are never served from cache.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error())
    );
  }

  // Everything else (images, API calls, Strapi-backed data) always goes to the network.
});

// ---------------------------------------------------------------------------
// Web Push. Payload (JSON, <4KB, no PII): { title, body, url, image?, tag?,
// id?, type? }. Sent by the Strapi push dispatcher.
// ---------------------------------------------------------------------------

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Tritorc", body: event.data ? event.data.text() : "" };
  }

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      // Tell open windows so the in-app inbox/badge can update.
      clientList.forEach((c) => c.postMessage({ type: "push-received", payload: data }));
      // App is in the foreground: the page shows its own heads-up banner.
      if (clientList.some((c) => c.focused)) return;

      await self.registration.showNotification(data.title || "Tritorc", {
        body: data.body || "",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        image: data.image,
        tag: data.tag || data.id,
        timestamp: Date.now(),
        data: { url: data.url || "/notifications" },
      });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(
    (event.notification.data && event.notification.data.url) || "/notifications",
    self.location.origin
  ).href;

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const c of clientList) {
        if (new URL(c.url).origin === self.location.origin && "focus" in c) {
          await c.focus();
          if ("navigate" in c) await c.navigate(target);
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});

// Browser rotated the subscription: tell the page to re-subscribe.
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => list.forEach((c) => c.postMessage({ type: "push-resubscribe" })))
  );
});
