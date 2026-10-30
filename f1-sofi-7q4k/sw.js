// La versión vieja de Dina Física se mudó a /estudio-sofi-7q4k/. Este archivo borra la copia vieja.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('dina-fisica-')).map(k => caches.delete(k))))
    .then(() => self.registration.unregister()));
});
