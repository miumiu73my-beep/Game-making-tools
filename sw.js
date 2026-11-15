/* Service Worker is scoped to /Game-making-tools/ only. */
const CACHE = "game-making-tools-pwa-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./pwa-nav.js",
  "./browser-utils.js",
  "./JS%E3%81%8F%E3%82%93.html",
  "./pixel_grid_editor_v10_scriptable.html",
  "./png%E3%81%AE%E8%83%8C%E6%99%AF%E3%82%92%E9%80%8F%E9%81%8E.html",
  "./%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E3%83%AA%E3%83%8D%E3%83%BC%E3%83%A0%E4%BF%9D%E5%AD%98.html",
  "./%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%8F%E3%82%93.html",
  "./%E7%AB%8B%E3%81%A1%E7%B5%B5-%E3%83%89%E3%83%83%E3%83%88%E5%A4%89%E6%8F%9B.html",
  "./%E8%89%B2%E5%A1%97%E3%82%8B%E5%90%9B.html",
  "./%E9%AA%A8%E7%B5%84%E3%81%BF%E3%81%8F%E3%82%93.html"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("game-making-tools-pwa-") && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (request.mode === "navigate") {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch {
        return await cache.match(request, {ignoreSearch:true}) ||
          await cache.match("./index.html") || Response.error();
      }
    }
    const saved = await cache.match(request);
    if (saved) return saved;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch { return Response.error(); }
  })());
});
