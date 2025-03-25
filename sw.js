const CACHE_NAME = 'calculatrice-cache-v1';
const urlsToCache = [
    '/',
    '/calcul.html',
    '/manifest.json',
    '/icon.webp', // Icône pour le PWA
    '/style.css', // Ajoute ton fichier CSS si nécessaire
    '/app.js' // Ajoute ton fichier JS si nécessaire
];

// Installer le Service Worker et mettre les fichiers dans le cache
self.addEventListener('install', (event) => {
    console.log('Service Worker installé !');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Fichiers mis en cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activer le Service Worker et nettoyer les anciens caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activé');
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Intercepter les requêtes et utiliser le cache ou le réseau
self.addEventListener('fetch', (event) => {
    console.log('Requête interceptée : ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Si le fichier est dans le cache, le retourner
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Sinon, récupérer la ressource depuis le réseau
                return fetch(event.request);
            })
    );
});
