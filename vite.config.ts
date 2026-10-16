import { createHash } from 'node:crypto'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Files in /public that should also be available offline. */
const PUBLIC_FILES = ['manifest.webmanifest', 'icon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']

/**
 * Emits a small service worker that precaches every file of the build, so the
 * script keeps working with no signal once it has been opened once.
 */
function offlineServiceWorker(): Plugin {
  return {
    name: 'khutbah-offline-sw',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const files = [...new Set(['./', ...Object.keys(bundle), ...PUBLIC_FILES])].filter((f) => !f.endsWith('.map'))
      const version = createHash('sha256')
        .update(
          Object.values(bundle)
            .map((chunk) => (chunk.type === 'chunk' ? chunk.code : String(chunk.source)))
            .join('\n'),
        )
        .digest('hex')
        .slice(0, 12)
      const source = `/* Khutbah Reader offline cache — generated at build time */
const CACHE = 'khutbah-reader-${version}';
const FILES = ${JSON.stringify(files)};

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
`
      this.emitFile({ type: 'asset', fileName: 'sw.js', source })
    },
  }
}

// Relative base so the site works from any GitHub Pages path (e.g. /Khudba/).
export default defineConfig({
  base: './',
  plugins: [react(), offlineServiceWorker()],
  build: {
    target: 'es2020',
  },
})
