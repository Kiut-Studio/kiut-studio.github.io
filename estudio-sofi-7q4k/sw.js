// Dina Estudia — copia sin conexión del hub y de todas sus materias.
// Solo maneja esta carpeta y sus propias cachés (el sitio lo comparten varios juegos).
// Subir el número con cada versión.
const C = 'dina-estudia-v1';
const BASE = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './fisica-1/', './fisica-1/index.html', './fisica-1/config.js',
  './fisica-1/assets/dina.webp', './fisica-1/assets/dina_corre.webp', './fisica-1/assets/torta.webp',
  './fisica-1/assets/frutilla.webp', './fisica-1/assets/sofi.webp', './fisica-1/assets/nubes.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => (k.startsWith('dina-estudia-') && k !== C) || k.startsWith('dina-fisica-')).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return; // los envíos a la hoja van directo
  const u = new URL(r.url);
  const propio = u.origin === location.origin && u.pathname.startsWith(new URL('./', self.registration.scope).pathname);
  const letra = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if (!propio && !letra) return;
  const guardar = res => { if (res && res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; };
  // Páginas y código: primero internet (siempre la última versión); sin internet, la copia.
  if (r.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('.js') || u.pathname.endsWith('/')) {
    e.respondWith(fetch(r).then(guardar).catch(() => caches.match(r).then(x => x || caches.match('./index.html'))));
    return;
  }
  // Dibujos y letras: primero la copia.
  e.respondWith(caches.match(r).then(x => x || fetch(r).then(guardar)));
});
