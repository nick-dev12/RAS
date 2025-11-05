/* ===============================================================
   📰 Fil d'Actualités Agricole - JavaScript
   🌾 Interactions et fonctionnalités du réseau social
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📰 Fil d\'Actualités - JavaScript chargé avec succès!');
    
    // ===============================================================
    // 🎯 INITIALISATION
    // ===============================================================
    
    initializeNewsfeed();
    initModernFeatures();
    
    function initializeNewsfeed() {
        setupLikeButtons();
        setupCommentButtons();
        setupShareButtons();
        setupPublishForm();
        setupSearchBar();
        setupFollowButtons();
        setupEnrollButtons();
        setupMobileMenu();
        setupInfiniteScroll();
    }
    
    // ===============================================================
    // ❤️ GESTION DES LIKES
    // ===============================================================
    
    function setupLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleLike(this);
            });
        });
    }
    
    function toggleLike(button) {
        const isLiked = button.classList.contains('liked');
        const likesSpan = button.querySelector('span');
        let currentLikes = parseInt(likesSpan.textContent);
        
        if (isLiked) {
            // Retirer le like
            button.classList.remove('liked');
            button.querySelector('i').style.color = '';
            currentLikes--;
            showNotification('Like retiré', 'info');
        } else {
            // Ajouter le like
            button.classList.add('liked');
            button.querySelector('i').style.color = 'var(--danger-red)';
            currentLikes++;
            showNotification('Post aimé !', 'success');
            
            // Animation de pulse
            button.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 300);
        }
        
        // Mettre à jour le compteur
        likesSpan.textContent = currentLikes;
        
        // Sauvegarder l'état (simulation)
        saveLikeState(button.closest('.publication-card').dataset.id, !isLiked);
    }
    
    function saveLikeState(postId, isLiked) {
        // Simulation d'une sauvegarde côté serveur
        console.log(`Post ${postId} ${isLiked ? 'liké' : 'unliké'}`);
        // Ici on ferait un appel AJAX vers le serveur
    }
    
    // ===============================================================
    // 💬 GESTION DES COMMENTAIRES
    // ===============================================================
    
    function setupCommentButtons() {
        const commentButtons = document.querySelectorAll('.comment-btn');
        
        commentButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openCommentModal(this);
            });
        });
    }
    
    function openCommentModal(button) {
        const postCard = button.closest('.publication-card');
        const postId = postCard.dataset.id;
        const commentsCount = button.querySelector('span').textContent;
        
        showNotification(`Ouverture des commentaires pour le post ${postId}`, 'info');
        
        // Ici on ouvrirait une modal avec les commentaires
        // Pour l'instant, on simule juste l'ouverture
        console.log(`Ouverture des commentaires du post ${postId} (${commentsCount} commentaires)`);
    }
    
    // ===============================================================
    // 🔄 GESTION DES PARTAGES
    // ===============================================================
    
    function setupShareButtons() {
        const shareButtons = document.querySelectorAll('.share-btn');
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                sharePost(this);
            });
        });
    }
    
    function sharePost(button) {
        const postCard = button.closest('.publication-card');
        const postId = postCard.dataset.id;
        const sharesCount = button.querySelector('span').textContent;
        
        // Animation du bouton
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
        
        // Mettre à jour le compteur
        const newSharesCount = parseInt(sharesCount) + 1;
        button.querySelector('span').textContent = newSharesCount;
        
        showNotification('Post partagé !', 'success');
        console.log(`Post ${postId} partagé (${newSharesCount} partages)`);
    }
    
    // ===============================================================
    // 📝 GESTION DE LA PUBLICATION
    // ===============================================================
    
    function setupPublishForm() {
        const publishBtn = document.querySelector('.publish-btn');
        const postTextarea = document.querySelector('.post-input textarea');
        const actionButtons = document.querySelectorAll('.action-btn:not(.publish-btn)');
        
        if (publishBtn) {
            publishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                publishPost();
            });
        }
        
        if (postTextarea) {
            postTextarea.addEventListener('input', function() {
                updatePublishButton();
            });
        }
        
        // Gestion des boutons d'action
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleActionButton(this);
            });
        });
    }
    
    function publishPost() {
        const postTextarea = document.querySelector('.post-input textarea');
        const content = postTextarea.value.trim();
        
        if (!content) {
            showNotification('Veuillez écrire quelque chose avant de publier', 'warning');
            return;
        }
      
        
        // Simulation de la publication
        setTimeout(() => {
            showNotification('Publication ajoutée avec succès !', 'success');
            postTextarea.value = '';
            updatePublishButton();
            // Ajouter la nouvelle publication au fil
            addNewPost(content);
        }, 1500);
    }
    
    function updatePublishButton() {
        const postTextarea = document.querySelector('.post-input textarea');
        const publishBtn = document.querySelector('.publish-btn');
        const content = postTextarea.value.trim();
        
        if (content) {
            publishBtn.style.opacity = '1';
            publishBtn.style.transform = 'scale(1)';
        } else {
            publishBtn.style.opacity = '0.7';
            publishBtn.style.transform = 'scale(0.95)';
        }
    }
    
    function handleActionButton(button) {
        const actionType = button.classList[1].replace('-btn', '');
        
        switch(actionType) {
            case 'photo':
                showNotification('Ouverture de la galerie photo...', 'info');
                break;
            case 'video':
                showNotification('Ouverture de l\'enregistrement vidéo...', 'info');
                break;
            case 'announce':
                showNotification('Ouverture du formulaire d\'annonce...', 'info');
                break;
            case 'article':
                showNotification('Ouverture de l\'éditeur d\'article...', 'info');
                break;
            case 'advice':
                showNotification('Ouverture du formulaire de conseil...', 'info');
                break;
        }
    }
    
    function addNewPost(content) {
        const publicationsList = document.querySelector('.publications-list');
        const newPost = createNewPostElement(content);
        
        // Ajouter en haut de la liste
        publicationsList.insertBefore(newPost, publicationsList.firstChild);
        
        // Animation d'entrée
        newPost.style.opacity = '0';
        newPost.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            newPost.style.transition = 'all 0.6s ease';
            newPost.style.opacity = '1';
            newPost.style.transform = 'translateY(0)';
        }, 100);
    }
    
    function createNewPostElement(content) {
        const postElement = document.createElement('article');
        postElement.className = 'publication-card';
        postElement.dataset.id = Date.now();
        
        postElement.innerHTML = `
            <div class="publication-header">
                <div class="author-info">
                    <div class="author-avatar">
                        <span>${document.querySelector('.user-avatar span').textContent}</span>
                    </div>
                    <div class="author-details">
                        <div class="author-name">
                            <h4>${document.querySelector('.profile-info h3').textContent}</h4>
                        </div>
                        <div class="author-meta">
                            <span class="author-role">${document.querySelector('.profile-info p').textContent}</span>
                            <span class="author-location">Maintenant</span>
                        </div>
                    </div>
                </div>
                <div class="publication-type">
                    <span class="type-badge advice">🌱 Conseil</span>
                </div>
            </div>
            <div class="publication-content">
                <p class="publication-text">${content}</p>
            </div>
            <div class="publication-actions">
                <button class="action-btn like-btn">
                    <i class="fas fa-heart"></i>
                    <span>0</span>
                </button>
                <button class="action-btn comment-btn">
                    <i class="fas fa-comment"></i>
                    <span>0</span>
                </button>
                <button class="action-btn share-btn">
                    <i class="fas fa-share"></i>
                    <span>0</span>
                </button>
                <button class="action-btn more-btn">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
            <div class="publication-stats">
                <span class="views-count">1 vue</span>
            </div>
        `;
        
        // Réattacher les événements
        setupPostInteractions(postElement);
        
        return postElement;
    }
    
    function setupPostInteractions(postElement) {
        const likeBtn = postElement.querySelector('.like-btn');
        const commentBtn = postElement.querySelector('.comment-btn');
        const shareBtn = postElement.querySelector('.share-btn');
        
        if (likeBtn) likeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleLike(this);
        });
        
        if (commentBtn) commentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCommentModal(this);
        });
        
        if (shareBtn) shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sharePost(this);
        });
    }
    
    // ===============================================================
    // 🔍 GESTION DE LA RECHERCHE
    // ===============================================================
    
    function setupSearchBar() {
        const searchInput = document.querySelector('.search-bar input');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                const query = this.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        performSearch(query);
                    }, 500);
                }
            });
        }
    }
    
    function performSearch(query) {
        console.log(`Recherche: "${query}"`);
        showNotification(`Recherche de "${query}"...`, 'info');
        
        // Ici on ferait une recherche côté serveur
        // Pour l'instant, on simule juste
    }
    
    // ===============================================================
    // 👥 GESTION DES SUIVIS
    // ===============================================================
    
    function setupFollowButtons() {
        const followButtons = document.querySelectorAll('.follow-btn');
        
        followButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFollow(this);
            });
        });
    }
    
    function toggleFollow(button) {
        const isFollowing = button.textContent === 'Suivi';
        
        if (isFollowing) {
            button.textContent = 'Suivre';
            button.style.background = 'var(--primary-green)';
            showNotification('Utilisateur non suivi', 'info');
        } else {
            button.textContent = 'Suivi';
            button.style.background = 'var(--text-muted)';
            showNotification('Utilisateur suivi !', 'success');
        }
    }
    
    // ===============================================================
    // 🎓 GESTION DES INSCRIPTIONS
    // ===============================================================
    
    function setupEnrollButtons() {
        const enrollButtons = document.querySelectorAll('.enroll-btn');
        
        enrollButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                enrollInFormation(this);
            });
        });
    }
    
    function enrollInFormation(button) {
        const formationTitle = button.closest('.formation-item').querySelector('h4').textContent;
        
        button.style.background = '#4CAF50';
        button.textContent = 'Inscrit';
        button.disabled = true;
        
        showNotification(`Inscription à "${formationTitle}" confirmée !`, 'success');
    }
    
    // ===============================================================
    // 📱 GESTION DU MENU MOBILE
    // ===============================================================
    
    function setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
            });
        }
    }
    
    // ===============================================================
    // ♾️ SCROLL INFINI
    // ===============================================================
    
    function setupInfiniteScroll() {
        let isLoading = false;
        
        window.addEventListener('scroll', function() {
            if (isLoading) return;
            
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                loadMorePosts();
            }
        });
    }
    
    function loadMorePosts() {
        if (isLoading) return;
        
        isLoading = true;
        showNotification('Chargement de plus de publications...', 'info');
        
        // Simulation du chargement
        setTimeout(() => {
            // Ici on chargerait plus de posts depuis le serveur
            isLoading = false;
            showNotification('Nouvelles publications chargées !', 'success');
        }, 2000);
    }
    
    // ===============================================================
    // 🔔 SYSTÈME DE NOTIFICATIONS
    // ===============================================================
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Gestion de la fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto-fermeture après 4 secondes
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // ===============================================================
    // 🎯 INITIALISATION FINALE
    // ===============================================================
    
    console.log('🎯 Fil d\'Actualités - Initialisation terminée!');
    
    // ===============================================================
    // 🎨 FONCTIONNALITÉS MODERNES
    // ===============================================================
    
    function initModernFeatures() {
        initAnimations();
        initMicroInteractions();
        initVisualEffects();
        initResponsiveFeatures();
        initMobileMenu();
    }
    
    function initAnimations() {
        // Animation d'apparition des cartes
        const cards = document.querySelectorAll('.publication-card, .widget-card, .create-post-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
    
    function initMicroInteractions() {
        // Effet ripple sur les boutons
        const actionBtns = document.querySelectorAll('.action-btn, .publish-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        });
        
        // Animation de survol sur les cartes
        const cards = document.querySelectorAll('.publication-card, .widget-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
                this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            });
        });
    }
    
    function initVisualEffects() {
        // Effet de shimmer sur les boutons
        const shimmerBtns = document.querySelectorAll('.publish-btn');
        shimmerBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)';
            });
        });
        
        // Animation des icônes météo
        const weatherIcons = document.querySelectorAll('.weather-icon');
        weatherIcons.forEach(icon => {
            icon.style.animation = 'pulse 2s infinite';
        });
    }
    
    function initResponsiveFeatures() {
        // Gestion du responsive
        function handleResize() {
            const width = window.innerWidth;
            
            if (width <= 768) {
                initMobileFeatures();
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Appel initial
    }
    
    function initMobileFeatures() {
        // Bouton flottant pour publier sur mobile
        if (!document.querySelector('.floating-publish-btn')) {
            const floatingBtn = document.createElement('button');
            floatingBtn.innerHTML = '🌾';
            floatingBtn.className = 'floating-publish-btn';
            floatingBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #0F9D58, #F2C94C);
                border: none;
                color: black;
            `;
            
            floatingBtn.addEventListener('click', function() {
                document.querySelector('.create-post-card').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
            
            document.body.appendChild(floatingBtn);
        }
    }
    
    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ===============================================================
    // 🍔 GESTION DU MENU MOBILE
    // ===============================================================
    
    function initMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const mobileHamburger = document.getElementById('mobile-hamburger');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const closeMenuBtn = document.getElementById('close-menu');
        
        // Fonction pour ouvrir le menu
        function openMenu() {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animation du bouton hamburger
            if (hamburgerBtn) hamburgerBtn.classList.add('active');
        }
        
        // Fonction pour fermer le menu
        function closeMenu() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Animation du bouton hamburger
            if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        }
        
        // Event listeners
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', openMenu);
        }
        
        if (mobileHamburger) {
            mobileHamburger.addEventListener('click', openMenu);
        }
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeMenu);
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }
        
        // Fermer le menu en cliquant sur un lien (ne pas bloquer la navigation)
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Laisser le lien fonctionner normalement
                if (item.href && item.href !== '#' && !item.hasAttribute('data-prevent-default')) {
                    // Fermer le menu après un court délai pour permettre la navigation
                    setTimeout(closeMenu, 100);
                } else {
                    // Si c'est un élément sans href ou avec #, fermer immédiatement
                    e.preventDefault();
                    setTimeout(closeMenu, 300);
                }
            });
        });
        
        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
    
    // Ajouter les styles CSS pour l'animation ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .floating-publish-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(15, 157, 88, 0.4);
        }
    `;
    document.head.appendChild(style);
});

/* ===============================================================
   🎯 FONCTIONS UTILITAIRES GLOBALES
   =============================================================== */

// Fonction pour formater les nombres
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Fonction pour formater les dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else {
        return `${days}j`;
    }
}

// Fonction pour valider les formulaires
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            field.style.borderColor = '#e4e6ea';
        }
    });
    
    return isValid;
}

/* ===============================================================
   🎯 FIN DU FICHIER
   =============================================================== */
