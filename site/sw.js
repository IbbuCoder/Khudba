/* Khutbah Reader offline cache — generated at build time */
const CACHE = 'khutbah-reader-f8f5359b251e';
const FILES = ["./","assets/amiri-quran-arabic-400-normal-wRcqfVJx.woff2","assets/al-qalam-quran-wbw-3R6CK43s.woff2","assets/amiri-quran-arabic-400-normal-CZ144KtP.woff","assets/index-Dw0k8YdC.css","assets/index-DzrMF16W.js","index.html","manifest.webmanifest","icon.svg","apple-touch-icon.png","icon-192.png","icon-512.png"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new URL(f, self.registration.scope).href)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('khutbah-reader-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // Cache first: a weak signal must never delay the script. New versions
    // arrive through a new service worker, which precaches the new page.
    event.respondWith(
      caches.match(new URL('./', self.registration.scope).href).then((cached) => cached || fetch(request)),
    );
    return;
  }
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
