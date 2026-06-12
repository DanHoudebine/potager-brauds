// ============================================
// SERVICE WORKER - Le Potager des Brauds
// ============================================
// IMPORTANT : incrémenter CACHE_NAME à chaque mise à jour de l'app
// pour invalider les caches des anciens service workers.

const CACHE_NAME = 'potager-v5';

// Fichiers à mettre en cache pour fonctionnement hors-ligne
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json'
];

// Installation : mise en cache des assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation : supprimer les anciens caches (dont potager-v1)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch :
//  - Firebase / Google → toujours réseau (jamais intercepté)
//  - App shell (HTML/JS/CSS) → RÉSEAU D'ABORD, cache en secours.
//    Les mises à jour de l'app arrivent donc immédiatement ; le cache
//    ne sert que hors-ligne.
//  - Autres ressources (polices, images) → cache d'abord.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') || url.hostname.includes('gstatic')) {
    return;
  }

  const isAppShell = url.origin === location.origin &&
    (e.request.mode === 'navigate' || /\.(js|css|html)$/.test(url.pathname) || url.pathname.endsWith('/'));

  if (isAppShell) {
    e.respondWith(
      fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() =>
        caches.match(e.request).then(cached =>
          cached || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())
        )
      )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
