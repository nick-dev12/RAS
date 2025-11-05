/* ===============================================================
   📹 VIDÉOS - JavaScript pour navigation verticale type TikTok
   🌾 Gestion de la lecture vidéo, swipe, actions sociales
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📹 Page Vidéos - JavaScript chargé');
    
    const videosList = document.getElementById('videos-list');
    const videoItems = document.querySelectorAll('.video-item');
    const videoPlayers = document.querySelectorAll('.video-player');
    let currentVideoIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    
    // ===============================================================
    // 🎥 GESTION DE LA LECTURE VIDÉO
    // ===============================================================
    
    // Initialiser tous les lecteurs vidéo
    videoPlayers.forEach((player, index) => {
        player.addEventListener('loadedmetadata', function() {
            console.log(`Vidéo ${index + 1} chargée`);
        });
        
        player.addEventListener('play', function() {
            // Pauser toutes les autres vidéos
            videoPlayers.forEach((p, i) => {
                if (i !== index && !p.paused) {
                    p.pause();
                    videoItems[i].classList.remove('playing');
                }
            });
            videoItems[index].classList.add('playing');
        });
        
        player.addEventListener('pause', function() {
            videoItems[index].classList.remove('playing');
        });
        
        player.addEventListener('ended', function() {
            // Rejouer la vidéo (loop)
            player.currentTime = 0;
            player.play();
        });
    });
    
    // Boutons play/pause
    const playPauseButtons = document.querySelectorAll('.play-pause-btn');
    playPauseButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            const videoItem = this.closest('.video-item');
            const video = videoItem.querySelector('.video-player');
            
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    // Clic sur la vidéo pour play/pause
    videoItems.forEach((item, index) => {
        const video = item.querySelector('.video-player');
        const overlay = item.querySelector('.video-overlay');
        
        overlay.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });
    
    // ===============================================================
    // 📜 NAVIGATION PAR SCROLL (Snap Scroll)
    // ===============================================================
    
    const videosContainer = document.querySelector('.videos-container');
    
    videosContainer.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        const containerHeight = videosContainer.clientHeight;
        const scrollTop = videosContainer.scrollTop;
        
        // Trouver quelle vidéo est visible
        videoItems.forEach((item, index) => {
            const itemTop = item.offsetTop - videosContainer.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            const viewportCenter = scrollTop + containerHeight / 2;
            
            // Si le centre de la vue est dans cette vidéo
            if (viewportCenter >= itemTop && viewportCenter <= itemBottom) {
                if (currentVideoIndex !== index) {
                    currentVideoIndex = index;
                    playCurrentVideo();
                }
            }
        });
    });
    
    function playCurrentVideo() {
        // Pauser toutes les vidéos
        videoPlayers.forEach((video, index) => {
            video.pause();
            videoItems[index].classList.remove('playing');
        });
        
        // Jouer la vidéo actuelle
        if (videoPlayers[currentVideoIndex]) {
            videoPlayers[currentVideoIndex].play().catch(e => {
                console.log('Autoplay bloqué:', e);
            });
        }
    }
    
    // ===============================================================
    // 👆 GESTION DU SWIPE (Mobile)
    // ===============================================================
    
    videoItems.forEach((item, index) => {
        item.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        });
        
        item.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        });
    });
    
    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            isScrolling = true;
            
            if (swipeDistance > 0) {
                // Swipe up - vidéo suivante
                scrollToNextVideo();
            } else {
                // Swipe down - vidéo précédente
                scrollToPrevVideo();
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    }
    
    function scrollToNextVideo() {
        if (currentVideoIndex < videoItems.length - 1) {
            currentVideoIndex++;
            videoItems[currentVideoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    function scrollToPrevVideo() {
        if (currentVideoIndex > 0) {
            currentVideoIndex--;
            videoItems[currentVideoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // ===============================================================
    // ❤️ ACTIONS SOCIALES
    // ===============================================================
    
    // Bouton Like
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            this.classList.toggle('liked');
            
            const countElement = this.querySelector('.action-count');
            let count = parseInt(countElement.textContent) || 0;
            
            if (this.classList.contains('liked')) {
                count++;
            } else {
                count--;
            }
            
            countElement.textContent = count;
            
            // Animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Bouton Commentaire
    const commentButtons = document.querySelectorAll('.comment-btn');
    commentButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            console.log('Ouvrir commentaires pour vidéo:', videoId);
            // TODO: Implémenter modal de commentaires
        });
    });
    
    // Bouton Partage
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            
            // Utiliser l'API Web Share si disponible
            if (navigator.share) {
                navigator.share({
                    title: 'Vidéo Agricole',
                    text: 'Regardez cette vidéo agricole intéressante!',
                    url: window.location.href
                }).catch(err => console.log('Erreur partage:', err));
            } else {
                // Fallback: copier le lien
                navigator.clipboard.writeText(window.location.href);
                alert('Lien copié dans le presse-papier!');
            }
        });
    });
    
    // Bouton Sauvegarder
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            this.classList.toggle('saved');
            
            const icon = this.querySelector('i');
            if (this.classList.contains('saved')) {
                icon.classList.remove('fa-bookmark');
                icon.classList.add('fas', 'fa-bookmark');
                icon.style.color = '#FFD700';
            } else {
                icon.classList.remove('fa-bookmark');
                icon.classList.add('far', 'fa-bookmark');
                icon.style.color = '';
            }
        });
    });
    
    // Bouton Suivre
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('following');
            
            const span = this.querySelector('span');
            if (this.classList.contains('following')) {
                span.textContent = 'Suivi';
                this.innerHTML = '<i class="fas fa-check"></i><span>Suivi</span>';
            } else {
                span.textContent = 'Suivre';
                this.innerHTML = '<i class="fas fa-plus"></i><span>Suivre</span>';
            }
        });
    });
    
    // ===============================================================
    // ⌨️ NAVIGATION CLAVIER
    // ===============================================================
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (e.key === 'ArrowDown') {
                scrollToNextVideo();
            } else {
                scrollToPrevVideo();
            }
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            const currentVideo = videoPlayers[currentVideoIndex];
            if (currentVideo) {
                if (currentVideo.paused) {
                    currentVideo.play();
                } else {
                    currentVideo.pause();
                }
            }
        }
    });
    
    // ===============================================================
    // 🎯 INTERSECTION OBSERVER - Auto-play vidéo visible
    // ===============================================================
    
    const observerOptions = {
        root: videosContainer,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const videoItem = entry.target;
                const index = Array.from(videoItems).indexOf(videoItem);
                currentVideoIndex = index;
                playCurrentVideo();
            }
        });
    }, observerOptions);
    
    videoItems.forEach(item => {
        observer.observe(item);
    });
    
    // Jouer la première vidéo au chargement
    if (videoPlayers.length > 0) {
        setTimeout(() => {
            playCurrentVideo();
        }, 500);
    }
    
    console.log('✅ Vidéos initialisées:', videoItems.length);
});

