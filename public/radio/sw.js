/* Radio-only cache. Never intercept audio streams, APIs, or private pages. */
const CACHE = 'bethel-radio-v1';
const OFFLINE = '/radio/offline.html';
const ASSETS = [OFFLINE, '/radio/icons/icon-180.png', '/radio/icons/icon-192.png', '/radio/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  // Let active listening sessions finish before activating a new version.
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('bethel-radio-') && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' && (url.pathname === '/radio/app' || url.pathname.startsWith('/radio/app/'))) {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
  } else if (ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
  }
});
