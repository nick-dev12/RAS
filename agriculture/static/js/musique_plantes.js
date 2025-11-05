// ===============================================================
// 🎵 Musique pour les Plantes - JavaScript
// ===============================================================

(function() {
  'use strict';
  
  // État global du lecteur
  let currentProduit = null;
  let isPlaying = false;
  let audioElement = null;
  
  // Initialisation
  document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPlayer();
    initializeButtons();
    initializeSearch();
  });
  
  // ===============================================================
  // 🎧 INITIALISATION DU LECTEUR AUDIO
  // ===============================================================
  
  function initializeAudioPlayer() {
    audioElement = document.getElementById('audio-element');
    if (!audioElement) return;
    
    // Événements audio
    audioElement.addEventListener('loadedmetadata', updateAudioInfo);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleAudioEnd);
    audioElement.addEventListener('error', handleAudioError);
    audioElement.addEventListener('canplay', function() {
      updateTimeTotal();
    });
    
    // Boutons du lecteur
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnClose = document.getElementById('btn-player-close');
    const progressBar = document.getElementById('progress-bar-container');
    
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', togglePlayPause);
    }
    
    if (btnPrev) {
      btnPrev.addEventListener('click', playPrevious);
    }
    
    if (btnNext) {
      btnNext.addEventListener('click', playNext);
    }
    
    if (btnClose) {
      btnClose.addEventListener('click', closePlayer);
    }
    
    if (progressBar) {
      progressBar.addEventListener('click', seekTo);
    }
  }
  
  // ===============================================================
  // 🎛️ INITIALISATION DES BOUTONS
  // ===============================================================
  
  function initializeButtons() {
    // Boutons "Écouter" et "Prévisualiser"
    document.querySelectorAll('.btn-play, .btn-ecouter, .btn-preview').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const produitId = this.getAttribute('data-produit-id');
        const audioUrl = this.getAttribute('data-audio-url');
        playProduit(produitId, audioUrl);
      });
    });
    
    // Boutons "Télécharger"
    document.querySelectorAll('.btn-telecharger').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const produitId = this.getAttribute('data-produit-id');
        downloadProduit(produitId);
      });
    });
    
    // Boutons "Acheter"
    document.querySelectorAll('.btn-acheter').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const produitId = this.getAttribute('data-produit-id');
        const prix = this.getAttribute('data-prix');
        buyProduit(produitId, prix);
      });
    });
  }
  
  // ===============================================================
  // 🔍 INITIALISATION DE LA RECHERCHE
  // ===============================================================
  
  function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
      // Recherche en temps réel (après 500ms de pause)
      let searchTimeout;
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          if (searchForm) {
            searchForm.submit();
          }
        }, 500);
      });
      
      // Recherche avec Enter
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (searchForm) {
            searchForm.submit();
          }
        }
      });
    }
  }
  
  // ===============================================================
  // ▶️ LECTURE D'UN PRODUIT
  // ===============================================================
  
  function playProduit(produitId, audioUrl) {
    // Trouver le bouton qui a déclenché l'action
    const btn = document.querySelector(`[data-produit-id="${produitId}"][data-audio-url="${audioUrl}"]`);
    if (!btn) return;
    
    // Trouver la carte du produit
    const produitCard = btn.closest('.produit-card');
    
    // Récupérer les informations du produit depuis les attributs data ou la carte
    let titre = btn.getAttribute('data-titre');
    let auteur = btn.getAttribute('data-auteur');
    let coverImg = btn.getAttribute('data-cover');
    
    // Fallback : chercher dans la carte si les attributs ne sont pas disponibles
    if (!titre && produitCard) {
      const titreElement = produitCard.querySelector('.produit-titre');
      titre = titreElement ? titreElement.textContent : 'Musique inconnue';
    }
    if (!auteur && produitCard) {
      const auteurElement = produitCard.querySelector('.meta-item:last-child span');
      auteur = auteurElement ? auteurElement.textContent : 'Auteur inconnu';
    }
    if (!coverImg && produitCard) {
      const coverElement = produitCard.querySelector('.cover-img');
      coverImg = coverElement ? coverElement.src : '';
    }
    
    // Valeurs par défaut
    titre = titre || 'Musique inconnue';
    auteur = auteur || 'Auteur inconnu';
    coverImg = coverImg || '';
    
    // Mettre à jour le lecteur
    updatePlayerInfo(titre, auteur, coverImg);
    
    // Charger et jouer l'audio
    if (audioElement && audioUrl) {
      audioElement.src = audioUrl;
      audioElement.load();
      
      audioElement.play().then(() => {
        isPlaying = true;
        currentProduit = produitId;
        updatePlayPauseButton();
        showPlayer();
      }).catch(error => {
        console.error('Erreur lors de la lecture:', error);
        showNotification('Impossible de lire cette musique', 'error');
      });
    }
  }
  
  // ===============================================================
  // ⏯️ PLAY/PAUSE
  // ===============================================================
  
  function togglePlayPause() {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      isPlaying = false;
    } else {
      audioElement.play().then(() => {
        isPlaying = true;
      }).catch(error => {
        console.error('Erreur lors de la lecture:', error);
        showNotification('Impossible de lire cette musique', 'error');
      });
    }
    
    updatePlayPauseButton();
  }
  
  function updatePlayPauseButton() {
    const btnPlayPause = document.getElementById('btn-play-pause');
    if (!btnPlayPause) return;
    
    const icon = btnPlayPause.querySelector('i');
    if (icon) {
      icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
  }
  
  // ===============================================================
  // 📊 MISE À JOUR DE LA PROGRESSION
  // ===============================================================
  
  function updateProgress() {
    if (!audioElement) return;
    
    const progressFill = document.getElementById('progress-fill');
    const timeCurrent = document.getElementById('time-current');
    
    if (audioElement.duration) {
      const progress = (audioElement.currentTime / audioElement.duration) * 100;
      
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }
      
      if (timeCurrent) {
        timeCurrent.textContent = formatTime(audioElement.currentTime);
      }
    }
  }
  
  function updateTimeTotal() {
    if (!audioElement || !audioElement.duration) return;
    
    const timeTotal = document.getElementById('time-total');
    if (timeTotal) {
      timeTotal.textContent = formatTime(audioElement.duration);
    }
  }
  
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // ===============================================================
  // 🎯 NAVIGATION
  // ===============================================================
  
  function playPrevious() {
    if (!currentProduit) return;
    
    const produits = Array.from(document.querySelectorAll('.produit-card'));
    const currentIndex = produits.findIndex(card => {
      const btn = card.querySelector('[data-produit-id]');
      return btn && btn.getAttribute('data-produit-id') === currentProduit;
    });
    
    if (currentIndex > 0) {
      const prevCard = produits[currentIndex - 1];
      const btn = prevCard.querySelector('.btn-play, .btn-ecouter, .btn-preview');
      if (btn) {
        const produitId = btn.getAttribute('data-produit-id');
        const audioUrl = btn.getAttribute('data-audio-url');
        playProduit(produitId, audioUrl);
      }
    }
  }
  
  function playNext() {
    if (!currentProduit) return;
    
    const produits = Array.from(document.querySelectorAll('.produit-card'));
    const currentIndex = produits.findIndex(card => {
      const btn = card.querySelector('[data-produit-id]');
      return btn && btn.getAttribute('data-produit-id') === currentProduit;
    });
    
    if (currentIndex < produits.length - 1) {
      const nextCard = produits[currentIndex + 1];
      const btn = nextCard.querySelector('.btn-play, .btn-ecouter, .btn-preview');
      if (btn) {
        const produitId = btn.getAttribute('data-produit-id');
        const audioUrl = btn.getAttribute('data-audio-url');
        playProduit(produitId, audioUrl);
      }
    }
  }
  
  // ===============================================================
  // 🎨 GESTION DU LECTEUR
  // ===============================================================
  
  function showPlayer() {
    const player = document.getElementById('audio-player');
    if (player) {
      player.classList.add('active');
    }
  }
  
  function closePlayer() {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      isPlaying = false;
      currentProduit = null;
    }
    
    const player = document.getElementById('audio-player');
    if (player) {
      player.classList.remove('active');
    }
    
    updatePlayPauseButton();
  }
  
  function updatePlayerInfo(titre, auteur, coverImg) {
    const playerTitle = document.getElementById('player-title');
    const playerAuthor = document.getElementById('player-author');
    const playerCover = document.getElementById('player-cover');
    
    if (playerTitle) playerTitle.textContent = titre;
    if (playerAuthor) playerAuthor.textContent = auteur;
    if (playerCover && coverImg) playerCover.src = coverImg;
  }
  
  function updateAudioInfo() {
    updateTimeTotal();
  }
  
  function handleAudioEnd() {
    isPlaying = false;
    updatePlayPauseButton();
    // Auto-play suivant (optionnel)
    // playNext();
  }
  
  function handleAudioError() {
    console.error('Erreur audio');
    showNotification('Erreur lors du chargement de la musique', 'error');
    isPlaying = false;
    updatePlayPauseButton();
  }
  
  // ===============================================================
  // 📥 TÉLÉCHARGEMENT
  // ===============================================================
  
  function downloadProduit(produitId) {
    // Trouver la carte du produit
    const produitCard = document.querySelector(`[data-produit-id="${produitId}"]`)?.closest('.produit-card');
    if (!produitCard) return;
    
    const titre = produitCard.querySelector('.produit-titre')?.textContent || 'musique';
    const audioUrl = produitCard.querySelector('.btn-ecouter, .btn-preview')?.getAttribute('data-audio-url');
    
    if (audioUrl) {
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${titre}.mp3`;
      link.click();
      
      showNotification('Téléchargement démarré', 'success');
    } else {
      showNotification('Impossible de télécharger cette musique', 'error');
    }
  }
  
  // ===============================================================
  // 🛒 ACHAT
  // ===============================================================
  
  function buyProduit(produitId, prix) {
    if (confirm(`Voulez-vous acheter cette musique pour ${prix} FCFA ?`)) {
      // TODO: Intégrer le système de paiement
      showNotification('Achat en cours de développement', 'info');
    }
  }
  
  // ===============================================================
  // ⏩ NAVIGATION DANS LA PROGRESSION
  // ===============================================================
  
  function seekTo(e) {
    if (!audioElement || !audioElement.duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * audioElement.duration;
    
    audioElement.currentTime = newTime;
  }
  
  // ===============================================================
  // 📢 NOTIFICATIONS
  // ===============================================================
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? '#D22831' : type === 'success' ? '#008753' : '#008753'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 10002;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
      font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
})();
