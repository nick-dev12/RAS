// Enregistrement du Service Worker pour la PWA
// Réseau Agricole du Sénégal

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker enregistré avec succès:', registration.scope);
        
        // Vérifier les mises à jour périodiquement
        setInterval(() => {
          registration.update();
        }, 60000); // Vérifie toutes les minutes
        
        // Gérer les mises à jour du service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouveau service worker disponible
              console.log('[PWA] Nouveau Service Worker disponible');
              // Optionnel: Afficher une notification pour informer l'utilisateur
              if (confirm('Une nouvelle version de l\'application est disponible. Voulez-vous recharger la page ?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('[PWA] Erreur lors de l\'enregistrement du Service Worker:', error);
      });
  });
  
  // Gérer le bouton d'installation PWA
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêche l'affichage automatique du prompt
    e.preventDefault();
    // Stocke l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    
    // Affiche un bouton personnalisé pour installer l'app
    showInstallButton();
  });
  
  // Fonction pour afficher le bouton d'installation
  function showInstallButton() {
    // Crée un bouton d'installation si nécessaire
    let installButton = document.getElementById('pwa-install-button');
    
    if (!installButton) {
      installButton = document.createElement('button');
      installButton.id = 'pwa-install-button';
      installButton.className = 'pwa-install-btn';
      installButton.innerHTML = '📱 Installer l\'app';
      installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #008753;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 135, 83, 0.3);
        z-index: 10000;
        transition: all 0.3s ease;
      `;
      
      installButton.addEventListener('mouseenter', () => {
        installButton.style.transform = 'scale(1.05)';
        installButton.style.boxShadow = '0 6px 16px rgba(0, 135, 83, 0.4)';
      });
      
      installButton.addEventListener('mouseleave', () => {
        installButton.style.transform = 'scale(1)';
        installButton.style.boxShadow = '0 4px 12px rgba(0, 135, 83, 0.3)';
      });
      
      installButton.addEventListener('click', installApp);
      document.body.appendChild(installButton);
    } else {
      installButton.style.display = 'block';
    }
  }
  
  // Fonction pour installer l'application
  function installApp() {
    if (!deferredPrompt) {
      return;
    }
    
    // Affiche le prompt d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] L\'utilisateur a accepté l\'installation');
      } else {
        console.log('[PWA] L\'utilisateur a refusé l\'installation');
      }
      
      // Réinitialiser le prompt
      deferredPrompt = null;
      
      // Masquer le bouton
      const installButton = document.getElementById('pwa-install-button');
      if (installButton) {
        installButton.style.display = 'none';
      }
    });
  }
  
  // Masquer le bouton si l'app est déjà installée
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application installée');
    deferredPrompt = null;
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  });
  
  // ===============================================================
  // 🔄 SYNCHRONISATION AUTOMATIQUE
  // ===============================================================
  
  // Détecter la reconnexion et synchroniser automatiquement
  window.addEventListener('online', () => {
    console.log('[PWA] Connexion détectée, synchronisation en cours...');
    syncPendingRequests();
  });
  
  // Écouter les messages du service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ONLINE') {
      showSyncNotification(event.data.message);
    }
    
    if (event.data && event.data.type === 'SYNC_SUCCESS') {
      showSyncNotification('✅ Données synchronisées avec succès !');
    }
  });
  
  // Fonction pour synchroniser les requêtes en attente
  function syncPendingRequests() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_NOW'
      });
    }
  }
  
  // Fonction pour afficher une notification de synchronisation
  function showSyncNotification(message) {
    // Créer une notification toast
    const notification = document.createElement('div');
    notification.className = 'pwa-sync-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #008753;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10001;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
      font-size: 14px;
      font-weight: 500;
    `;
    
    // Ajouter l'animation CSS si elle n'existe pas
    if (!document.getElementById('pwa-sync-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-sync-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Retirer après 4 secondes
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }
  
  // Synchroniser périodiquement si en ligne
  setInterval(() => {
    if (navigator.onLine) {
      syncPendingRequests();
    }
  }, 30000); // Toutes les 30 secondes
  
  // Synchroniser au chargement de la page si en ligne
  if (navigator.onLine) {
    setTimeout(() => {
      syncPendingRequests();
    }, 2000); // Attendre 2 secondes après le chargement
  }
  
} else {
  console.warn('[PWA] Service Worker non supporté par ce navigateur');
}
