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
  let installBannerShown = false;
  
  // Stocker dans localStorage si on a déjà montré le banner
  const STORAGE_KEY = 'pwa_install_banner_shown';
  const STORAGE_DISMISSED = 'pwa_install_banner_dismissed';
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Empêche l'affichage automatique du prompt
    e.preventDefault();
    // Stocke l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    
    // Sauvegarder dans localStorage que le prompt est disponible
    localStorage.setItem('pwa_deferred_prompt_available', 'true');
    
    // Affiche un bouton personnalisé pour installer l'app
    showInstallBanner();
  });
  
  // Fonction pour afficher le banner d'installation
  function showInstallBanner() {
    // Ne pas afficher si déjà installé
    if (checkIfInstalled()) {
      hideInstallBanner();
      return;
    }
    
    // Ne pas afficher si l'utilisateur a déjà fermé le banner
    const dismissed = localStorage.getItem(STORAGE_DISMISSED);
    if (dismissed === 'true') {
      return;
    }
    
    // Vérifier si le banner existe déjà
    let installBanner = document.getElementById('pwa-install-banner');
    
    if (!installBanner) {
      // Créer le banner
      installBanner = document.createElement('div');
      installBanner.id = 'pwa-install-banner';
      installBanner.className = 'pwa-install-banner';
      
      // Chercher la navbar pour positionner le banner en dessous
      const navbar = document.querySelector('.navbar') || 
                     document.querySelector('.newsfeed-navbar') ||
                     document.querySelector('.marketplace-navbar') ||
                     document.querySelector('.musique-navbar') ||
                     document.querySelector('header') ||
                     document.querySelector('nav');
      
      if (navbar) {
        // Ajouter le banner directement au body pour un positionnement fixed correct
        // Le banner sera positionné en fixed sous la navbar
        installBanner.innerHTML = `
          <div class="phone-icon-wrapper">
            <div class="phone-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="phone-svg-icon">
                <!-- Cadre du téléphone -->
                <rect x="7" y="2" width="10" height="20" rx="2.5" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>
                <!-- Écran -->
                <rect x="8.5" y="4.5" width="7" height="14" rx="1" fill="#000"/>
                <!-- Barre de notification -->
                <rect x="8.5" y="4.5" width="7" height="1.5" fill="#0a0a0a"/>
                <!-- Accueil virtuel -->
                <rect x="11" y="19.5" width="2" height="0.5" rx="0.25" fill="#666"/>
                <!-- Caméra frontale -->
                <circle cx="12" cy="5.5" r="0.3" fill="#333"/>
                <!-- Boutons latéraux -->
                <rect x="6.5" y="7" width="0.5" height="1.5" rx="0.25" fill="#333"/>
                <rect x="6.5" y="9.5" width="0.5" height="1.5" rx="0.25" fill="#333"/>
                <rect x="17" y="7" width="0.5" height="1.5" rx="0.25" fill="#333"/>
                <!-- Contenu de l'écran (icône app) -->
                <rect x="10" y="7" width="4" height="4" rx="0.5" fill="#008753"/>
                <circle cx="12" cy="9" r="1" fill="#fff"/>
                <path d="M11 10.5 L12 11.5 L13 10.5" stroke="#fff" stroke-width="0.3" fill="none"/>
              </svg>
            </div>
          </div>
          <div class="install-content">
            <div class="install-title">Installer l'application</div>
            <div class="install-subtitle">Accès rapide depuis votre écran d'accueil</div>
          </div>
          <button class="install-close" id="pwa-install-close" aria-label="Fermer">
            <i class="fas fa-times"></i>
          </button>
        `;
        
        // S'assurer que le body existe
        if (!document.body) {
          // Attendre que le body soit disponible
          const bodyObserver = new MutationObserver((mutations, obs) => {
            if (document.body) {
              obs.disconnect();
              document.body.appendChild(installBanner);
              updateBannerPosition(navbar, installBanner);
            }
          });
          
          bodyObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
          });
          
          // Timeout de sécurité
          setTimeout(() => {
            if (document.body && !installBanner.parentNode) {
              document.body.appendChild(installBanner);
              updateBannerPosition(navbar, installBanner);
            }
          }, 500);
        } else {
          // Ajouter le banner au body pour un positionnement fixed correct
          document.body.appendChild(installBanner);
          updateBannerPosition(navbar, installBanner);
        }
        
        // Ajouter les event listeners
        installBanner.addEventListener('click', (e) => {
          if (e.target.closest('.install-close')) {
            return;
          }
          installApp();
        });
        
        const closeBtn = installBanner.querySelector('#pwa-install-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideInstallBanner(true); // true = dismissé par l'utilisateur
          });
        }
      }
    }
    
    // Afficher le banner avec animation
    setTimeout(() => {
      if (installBanner) {
        installBanner.classList.add('show');
        installBannerShown = true;
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    }, 500); // Délai pour l'animation
  }
  
  // Vérifier et afficher le banner au chargement de la page
  // LOGIQUE SIMPLIFIÉE : Afficher si l'app n'est pas installée, point final
  function checkAndShowBanner() {
    // Vérifier IMMÉDIATEMENT si l'app est déjà installée
    if (checkIfInstalled()) {
      hideInstallBanner();
      return;
    }
    
    // Vérifier si l'utilisateur a explicitement fermé le banner
    const dismissed = localStorage.getItem(STORAGE_DISMISSED) === 'true';
    if (dismissed) {
      return;
    }
    
    // Vérifier si le banner existe déjà et est visible
    const existingBanner = document.getElementById('pwa-install-banner');
    if (existingBanner && existingBanner.classList.contains('show')) {
      return; // Déjà affiché
    }
    
    // NOUVELLE LOGIQUE : Afficher le banner si :
    // 1. L'app n'est pas installée (déjà vérifié)
    // 2. L'utilisateur ne l'a pas fermé (déjà vérifié)
    // 3. On a un manifest (PWA installable) OU on a un service worker
    // On ne dépend PLUS du beforeinstallprompt pour l'affichage initial
    
    const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
    const hasServiceWorker = 'serviceWorker' in navigator;
    
    // Afficher le banner si la PWA est configurée (manifest ou service worker)
    // Cela garantit que le banner s'affiche même si beforeinstallprompt n'a pas été déclenché
    if (hasManifest || hasServiceWorker) {
      // S'assurer que le DOM est prêt
      if (document.body) {
        showInstallBanner();
      } else {
        // Attendre que le body soit disponible
        const bodyCheck = setInterval(() => {
          if (document.body) {
            clearInterval(bodyCheck);
            showInstallBanner();
          }
        }, 50);
        
        // Timeout de sécurité après 2 secondes
        setTimeout(() => {
          clearInterval(bodyCheck);
          if (document.body) {
            showInstallBanner();
          }
        }, 2000);
      }
    }
  }
  
  // Fonction pour vérifier et afficher le banner avec plusieurs tentatives
  // EXÉCUTION IMMÉDIATE pour garantir l'affichage même avec cache
  function initBannerCheck() {
    // Vérification IMMÉDIATE sans attendre
    checkAndShowBanner();
    
    // Vérifications supplémentaires avec des délais courts
    // pour s'assurer que tout est chargé même après un rafraîchissement avec cache
    const checkIntervals = [50, 100, 200, 300, 500, 1000, 2000];
    
    checkIntervals.forEach((delay) => {
      setTimeout(() => {
        // Vérifier à nouveau si le banner n'est pas déjà affiché
        const existingBanner = document.getElementById('pwa-install-banner');
        if (!existingBanner || !existingBanner.classList.contains('show')) {
          checkAndShowBanner();
        }
      }, delay);
    });
  }
  
  // EXÉCUTION IMMÉDIATE - Ne pas attendre les événements
  // Cette fonction s'exécute dès que le script est chargé
  
  // Vérifier IMMÉDIATEMENT, peu importe l'état du DOM
  (function immediateCheck() {
    // Vérifier tout de suite
    checkAndShowBanner();
    
    // Vérifier aussi avec des délais très courts pour s'assurer
    setTimeout(checkAndShowBanner, 10);
    setTimeout(checkAndShowBanner, 50);
    setTimeout(checkAndShowBanner, 100);
    setTimeout(checkAndShowBanner, 200);
  })();
  
  // Vérifier au chargement de la page (DOMContentLoaded)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBannerCheck();
    });
  } else {
    // DOM déjà chargé
    initBannerCheck();
  }
  
  // Vérifier aussi après le load complet
  window.addEventListener('load', () => {
    checkAndShowBanner();
    setTimeout(checkAndShowBanner, 500);
    setTimeout(checkAndShowBanner, 1000);
  });
  
  // Vérifier aussi après un court délai pour s'assurer que tout est chargé
  setTimeout(initBannerCheck, 100);
  
  // Vérification immédiate si le script est chargé après le DOM
  if (document.readyState !== 'loading') {
    initBannerCheck();
  }
  
  // Forcer une vérification après un délai pour contrer les problèmes de cache
  setTimeout(() => {
    initBannerCheck();
  }, 500);
  
  // Vérification supplémentaire après 2 secondes (pour les cas extrêmes)
  setTimeout(() => {
    checkAndShowBanner();
  }, 2000);
  
  // Observer les changements dans le DOM pour détecter les navbars chargées dynamiquement
  let domObserver = null;
  
  function setupDOMObserver() {
    if (domObserver) {
      domObserver.disconnect();
    }
    
    domObserver = new MutationObserver(() => {
      const existingBanner = document.getElementById('pwa-install-banner');
      if (!existingBanner) {
        // Vérifier si on peut afficher le banner
        setTimeout(checkAndShowBanner, 500);
      }
    });
    
    // Observer les changements dans le body
    if (document.body) {
      domObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      // Attendre que le body soit disponible
      const bodyWaitObserver = new MutationObserver((mutations, obs) => {
        if (document.body) {
          obs.disconnect();
          setupDOMObserver();
        }
      });
      
      bodyWaitObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }
  
  // Initialiser l'observer
  setupDOMObserver();
  
  // Vérifier aussi lors des événements de visibilité (retour d'onglet)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(checkAndShowBanner, 500);
    }
  });
  
  // Vérifier lors du focus de la fenêtre
  window.addEventListener('focus', () => {
    setTimeout(checkAndShowBanner, 300);
  });
  
  // Vérifier lors du rafraîchissement de la page (même avec cache)
  // Utiliser les événements qui se déclenchent toujours
  window.addEventListener('pageshow', (event) => {
    // pageshow se déclenche même si la page vient du cache
    if (event.persisted) {
      // Page chargée depuis le cache (back/forward cache ou service worker cache)
      console.log('[PWA] Page chargée depuis le cache, vérification du banner...');
      // Attendre un peu pour que le DOM soit prêt
      setTimeout(() => {
        initBannerCheck();
      }, 100);
    } else {
      // Page fraîchement chargée
      setTimeout(() => {
        checkAndShowBanner();
      }, 500);
    }
  });
  
  // Vérifier aussi lors de l'événement beforeunload (avant le rafraîchissement)
  // pour s'assurer que le banner sera vérifié au prochain chargement
  window.addEventListener('beforeunload', () => {
    // Marquer dans sessionStorage qu'on doit vérifier le banner
    sessionStorage.setItem('pwa_check_banner', 'true');
  });
  
  // Vérifier au chargement si on doit vérifier le banner
  if (sessionStorage.getItem('pwa_check_banner') === 'true') {
    sessionStorage.removeItem('pwa_check_banner');
    setTimeout(() => {
      initBannerCheck();
    }, 500);
  }
  
  // Fonction pour installer l'application
  function installApp() {
    if (!deferredPrompt) {
      // Si le prompt n'est pas disponible, essayer d'afficher le prompt natif du navigateur
      console.log('[PWA] Prompt non disponible, tentative d\'installation native...');
      // Sur certains navigateurs, on peut essayer d'afficher un message
      alert('Pour installer l\'application, utilisez le menu de votre navigateur :\n\n- Chrome/Edge : Menu (⋮) → "Installer l\'application"\n- Safari (iOS) : Partager → "Sur l\'écran d\'accueil"\n- Firefox : Menu → "Installer"');
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
      localStorage.removeItem('pwa_deferred_prompt_available');
      
      // Masquer le banner après installation
      hideInstallBanner();
    });
  }
  
  // Masquer le bouton si l'app est déjà installée
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Application installée');
    deferredPrompt = null;
    localStorage.removeItem('pwa_deferred_prompt_available');
    localStorage.setItem(STORAGE_DISMISSED, 'true');
    hideInstallBanner();
  });
  
  // Vérifier si l'app est déjà installée au chargement
  function checkIfInstalled() {
    // Détecter si on est en mode standalone (app installée)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')) {
      hideInstallButton();
      return true;
    }
    return false;
  }
  
  // Fonction pour mettre à jour la position du banner
  function updateBannerPosition(navbar, banner) {
    if (!navbar || !banner) return;
    
    // Calculer la position top en fonction de la hauteur de la navbar
    const navbarHeight = navbar.offsetHeight || 70;
    banner.style.top = `${navbarHeight + 10}px`;
    
    // Mettre à jour la position si la navbar change de taille
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = navbar.offsetHeight || 70;
      banner.style.top = `${newHeight + 10}px`;
    });
    
    resizeObserver.observe(navbar);
  }
  
  // Fonction pour masquer le banner
  function hideInstallBanner(dismissed = false) {
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner) {
      installBanner.classList.remove('show');
      setTimeout(() => {
        if (installBanner.parentNode) {
          installBanner.parentNode.removeChild(installBanner);
        }
      }, 300);
    }
    
    if (dismissed) {
      localStorage.setItem(STORAGE_DISMISSED, 'true');
    }
  }
  
  // Fonction pour masquer le bouton (ancienne fonction, gardée pour compatibilité)
  function hideInstallButton() {
    hideInstallBanner();
  }
  
  // Vérifier au chargement
  if (checkIfInstalled()) {
    console.log('[PWA] Application déjà installée');
    hideInstallBanner();
  }
  
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
