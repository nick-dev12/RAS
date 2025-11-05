// Service Worker pour le Réseau Agricole du Sénégal (PWA)
// Version du cache - Incrémenter pour forcer une mise à jour
const CACHE_NAME = 'ras-v1.0.2';
const RUNTIME_CACHE = 'ras-runtime-v1.0.2';
const SYNC_QUEUE = 'ras-sync-queue-v1.0.2';
const OFFLINE_PAGE = '/offline.html';

// Fichiers à mettre en cache lors de l'installation (fichiers critiques)
const STATIC_CACHE_FILES = [
  '/',
  '/offline.html',  // Page offline
  '/static/css/style.css',
  '/static/css/dashboard.css',
  '/static/css/marketplace.css',
  '/static/css/newsfeed.css',
  '/static/css/mobile_navigation.css',
  '/static/css/logo.css',
  '/static/css/communaute.css',
  '/static/css/formations.css',
  '/static/css/terrain.css',
  '/static/css/videos.css',
  '/static/js/main.js',
  '/static/js/dashboard.js',
  '/static/js/marketplace.js',
  '/static/js/newsfeed.js',
  '/static/js/mobile_navigation.js',
  '/static/js/pwa.js',
  '/static/images/icon-192x192.png',
  '/static/images/icon-512x512.png',
];

// Pages principales à précharger (optionnel)
const CRITICAL_PAGES = [
  '/',
  '/newsfeed/',
  '/marketplace/',
  '/login/',
];

// Routes qui doivent toujours être mises en cache
const ROUTES_TO_CACHE = [
  '/',
  '/newsfeed/',
  '/marketplace/',
  '/dashboard/agriculteur/',
  '/terrain-agricole/',
  '/communaute/',
  '/formations/',
  '/videos/',
  '/login/',
  '/register/',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        console.log('[Service Worker] Installation terminée');
        return self.skipWaiting(); // Active immédiatement le nouveau service worker
      })
      .catch((error) => {
        console.error('[Service Worker] Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation en cours...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprime les anciens caches
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation terminée');
      return self.clients.claim(); // Prend le contrôle de toutes les pages
    })
  );
});

// Stratégie de mise en cache améliorée pour un accès hors ligne complet
// Gestion des requêtes GET et POST avec synchronisation automatique
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes vers des APIs externes
  if (url.origin !== location.origin) {
    return;
  }
  
  // Gérer les requêtes POST pour la synchronisation
  if (request.method === 'POST') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si succès, retourner la réponse
          if (response.ok) {
            return response;
          }
          throw new Error('Network error');
        })
        .catch(() => {
          // Si échec, stocker pour synchronisation ultérieure
          request.clone().text().then(body => {
            const requestData = {
              url: request.url,
              method: request.method,
              headers: {},
              body: body,
              timestamp: Date.now()
            };
            
            // Copier les headers
            request.headers.forEach((value, key) => {
              requestData.headers[key] = value;
            });
            
            storeRequestForSync(requestData);
          });
          
          // Retourner une réponse indiquant que la requête sera synchronisée
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Requête enregistrée pour synchronisation ultérieure',
              offline: true
            }),
            {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }
  
  // Gérer les requêtes GET (cache et offline)
  if (request.method !== 'GET') {
    return;
  }

  // Pour les fichiers statiques (CSS, JS, images, fonts), utilise Cache First
  if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/media/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si pas en cache, récupère du réseau et met en cache
          return fetch(request)
            .then((response) => {
              // Vérifie que la réponse est valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              // Clone la réponse pour la mettre en cache
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
              return response;
            })
            .catch(() => {
              // Si le réseau échoue et pas de cache, retourne une réponse vide pour les images
              if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
                return new Response('', { status: 404 });
              }
              return new Response('Ressource non disponible hors ligne', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  } 
  // Pour les pages HTML, utilise Network First avec fallback intelligent sur le cache
  else if (request.destination === 'document' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la réponse est valide, met en cache et retourne
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essaie le cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Si la page n'est pas en cache, essaie de trouver une page similaire
              // Par exemple, si on demande /dashboard/formateur/ et qu'on a /dashboard/agriculteur/ en cache
              const pathSegments = url.pathname.split('/').filter(Boolean);
              if (pathSegments.length > 0) {
                // Essaie de trouver une page parente ou similaire
                const parentPath = '/' + pathSegments[0] + '/';
                return caches.match(parentPath);
              }
              
              // Si toujours rien, retourne la page d'accueil en cache
              return caches.match('/')
                .then((homePage) => {
                  if (homePage) {
                    return homePage;
                  }
                  // Dernière option : page offline
                  return caches.match(OFFLINE_PAGE)
                    .then((offlinePage) => {
                      if (offlinePage) {
                        return offlinePage;
                      }
                      // Fallback final : réponse HTML basique
                      return new Response(
                        `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hors ligne - RAS</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #F5E9D7; }
    .offline-container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { color: #008753; }
    p { color: #666; }
    button { background: #008753; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; margin-top: 20px; }
    button:hover { background: #006d42; }
  </style>
</head>
<body>
  <div class="offline-container">
    <h1>🌾 Vous êtes hors ligne</h1>
    <p>Cette page n'est pas disponible hors ligne.</p>
    <p>Vérifiez votre connexion internet et réessayez.</p>
    <button onclick="window.location.reload()">Réessayer</button>
  </div>
</body>
</html>`,
                        {
                          status: 503,
                          headers: { 'Content-Type': 'text/html; charset=utf-8' }
                        }
                      );
                    });
                });
            });
        })
    );
  }
  // Pour les autres requêtes (API, JSON, etc.), utilise Network First avec cache
  else {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si la réponse est valide, met en cache et retourne
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si le réseau échoue, essaie le cache
          return caches.match(request);
        })
    );
  }
});

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Message pour stocker une requête à synchroniser
  if (event.data && event.data.type === 'SYNC_REQUEST') {
    storeRequestForSync(event.data.request);
  }
  
  // Message pour déclencher la synchronisation
  if (event.data && event.data.type === 'SYNC_NOW') {
    syncPendingRequests();
  }
});

// Stocker une requête pour synchronisation ultérieure
async function storeRequestForSync(requestData) {
  try {
    const cache = await caches.open(SYNC_QUEUE);
    const request = new Request(requestData.url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body,
    });
    await cache.put(request, new Response(JSON.stringify(requestData)));
    console.log('[Service Worker] Requête stockée pour synchronisation:', requestData.url);
  } catch (error) {
    console.error('[Service Worker] Erreur lors du stockage de la requête:', error);
  }
}

// Synchroniser les requêtes en attente
async function syncPendingRequests() {
  try {
    const cache = await caches.open(SYNC_QUEUE);
    const requests = await cache.keys();
    
    console.log(`[Service Worker] Synchronisation de ${requests.length} requêtes en attente...`);
    
    for (const request of requests) {
      try {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          const requestData = await cachedResponse.json();
          
          // Réessayer la requête
          const response = await fetch(requestData.url, {
            method: requestData.method,
            headers: requestData.headers,
            body: requestData.body,
          });
          
          if (response.ok) {
            // Supprimer de la file d'attente si succès
            await cache.delete(request);
            console.log('[Service Worker] Requête synchronisée avec succès:', requestData.url);
            
            // Notifier les clients
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
              client.postMessage({
                type: 'SYNC_SUCCESS',
                url: requestData.url
              });
            });
          }
        }
      } catch (error) {
        console.error('[Service Worker] Erreur lors de la synchronisation:', error);
      }
    }
  } catch (error) {
    console.error('[Service Worker] Erreur lors de la synchronisation globale:', error);
  }
}

// Écouter les événements de synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

// Détecter la reconnexion et synchroniser automatiquement
self.addEventListener('online', () => {
  console.log('[Service Worker] Connexion détectée, synchronisation en cours...');
  syncPendingRequests();
  
  // Notifier tous les clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'ONLINE',
        message: 'Connexion rétablie, synchronisation en cours...'
      });
    });
  });
});

