/* ===============================================================
   🛒 MARKETPLACE AGRICOLE - JAVASCRIPT
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Marketplace - JavaScript chargé avec succès!');
    
    // ===============================================================
    // 🎯 INITIALISATION
    // ===============================================================
    
    initializeMarketplace();
    initModernFeatures();
    
    function initializeMarketplace() {
        setupSearchBar();
        setupFilters();
        setupSorting();
        setupContactModal();
        setupPhoneReveal();
        setupFavorites();
        setupMobileMenu();
        setupAnimations();
    }
    
    // ===============================================================
    // 🔍 RECHERCHE ET FILTRAGE
    // ===============================================================
    
    function setupSearchBar() {
        const mainSearchInput = document.getElementById('main-search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (!mainSearchInput) return;
        
        let searchTimeout;
        
        // Recherche en temps réel
        mainSearchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAnnonces();
            }, 300);
        });
        
        // Recherche au clic sur le bouton
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                filterAnnonces();
            });
        }
        
        // Recherche avec Entrée
        mainSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterAnnonces();
            }
        });
    }
    
    function setupFilters() {
        const filterForm = document.getElementById('filters-form');
        if (!filterForm) return;
        
        // Filtrage automatique lors du changement des filtres
        const filterInputs = filterForm.querySelectorAll('select, input[type="number"], input[type="checkbox"]');
        filterInputs.forEach(input => {
            input.addEventListener('change', function() {
                filterAnnonces();
            });
        });
        
        // Soumission du formulaire
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterAnnonces();
        });
    }
    
    function filterAnnonces() {
        const mainSearchInput = document.getElementById('main-search-input');
        const categorieSelect = document.getElementById('categorie');
        const regionSelect = document.getElementById('region');
        const prixMinInput = document.getElementById('prix_min');
        const prixMaxInput = document.getElementById('prix_max');
        
        const searchTerm = mainSearchInput ? mainSearchInput.value.toLowerCase() : '';
        const categorie = categorieSelect ? categorieSelect.value : 'Toutes';
        const region = regionSelect ? regionSelect.value : 'Toutes';
        const prixMin = prixMinInput ? parseInt(prixMinInput.value) || 0 : 0;
        const prixMax = prixMaxInput ? parseInt(prixMaxInput.value) || Infinity : Infinity;
        
        const annonceCards = document.querySelectorAll('.annonce-card');
        let visibleCount = 0;
        
        annonceCards.forEach(card => {
            const titre = card.querySelector('.annonce-titre').textContent.toLowerCase();
            const description = card.querySelector('.annonce-description').textContent.toLowerCase();
            const cardCategorie = card.dataset.categorie;
            const cardRegion = card.querySelector('.annonce-location span').textContent.split(', ')[1];
            const cardPrix = parseInt(card.dataset.prix);
            const isBio = card.querySelector('.badge-bio') !== null;
            
            let isVisible = true;
            
            // Filtre par recherche
            if (searchTerm && !titre.includes(searchTerm) && !description.includes(searchTerm)) {
                isVisible = false;
            }
            
            // Filtre par catégorie
            if (categorie !== 'Toutes' && cardCategorie !== categorie) {
                isVisible = false;
            }
            
            // Filtre par région
            if (region !== 'Toutes' && cardRegion !== region) {
                isVisible = false;
            }
            
            // Filtre par prix
            if (cardPrix < prixMin || cardPrix > prixMax) {
                isVisible = false;
            }
            
            // Filtre par certification bio supprimé
            
            // Afficher/masquer la carte
            if (isVisible) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                visibleCount++;
                
                // Animation d'apparition
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 100);
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });
        
        // Mettre à jour le compteur
        updateResultsCount(visibleCount);
    }
    
    function updateResultsCount(count) {
        const resultsHeader = document.querySelector('.results-header h2');
        if (resultsHeader) {
            resultsHeader.textContent = `${count} annonce${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`;
        }
    }
    
    // ===============================================================
    // 📊 TRI
    // ===============================================================
    
    function setupSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            sortAnnonces(this.value);
        });
    }
    
    function sortAnnonces(sortBy) {
        const annoncesGrid = document.getElementById('annonces-grid');
        if (!annoncesGrid) return;
        
        const annonceCards = Array.from(annoncesGrid.querySelectorAll('.annonce-card:not(.hidden)'));
        
        annonceCards.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.querySelector('.annonce-date span').textContent.split('/').reverse().join('-')) - 
                           new Date(a.querySelector('.annonce-date span').textContent.split('/').reverse().join('-'));
                
                case 'date-asc':
                    return new Date(a.querySelector('.annonce-date span').textContent.split('/').reverse().join('-')) - 
                           new Date(b.querySelector('.annonce-date span').textContent.split('/').reverse().join('-'));
                
                case 'prix-asc':
                    return parseInt(a.dataset.prix) - parseInt(b.dataset.prix);
                
                case 'prix-desc':
                    return parseInt(b.dataset.prix) - parseInt(a.dataset.prix);
                
                case 'rating-desc':
                    return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
                
                default:
                    return 0;
            }
        });
        
        // Réorganiser les cartes dans le DOM
        annonceCards.forEach((card, index) => {
            annoncesGrid.appendChild(card);
            
            // Animation de réorganisation
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0.7';
            
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 50);
        });
    }
    
    // ===============================================================
    // 📞 MODAL DE CONTACT
    // ===============================================================
    
    function setupContactModal() {
        const contactModal = document.getElementById('contact-modal');
        const modalClose = document.getElementById('modal-close');
        const btnCancel = document.getElementById('btn-cancel');
        const contactForm = document.getElementById('contact-form');
        
        if (!contactModal) return;
        
        // Ouvrir la modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-contact')) {
                e.preventDefault();
                openContactModal(e.target.dataset.vendeur);
            }
        });
        
        // Fermer la modal
        function closeContactModal() {
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Réinitialiser le formulaire
            if (contactForm) {
                contactForm.reset();
            }
        }
        
        function openContactModal(vendeurNom) {
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Pré-remplir le message avec le nom du vendeur
            const messageField = document.getElementById('contact-message');
            if (messageField && vendeurNom) {
                messageField.value = `Bonjour ${vendeurNom},\n\nJe suis intéressé(e) par votre annonce. Pourriez-vous me donner plus d'informations ?\n\nCordialement`;
            }
        }
        
        // Event listeners pour fermer la modal
        if (modalClose) {
            modalClose.addEventListener('click', closeContactModal);
        }
        
        if (btnCancel) {
            btnCancel.addEventListener('click', closeContactModal);
        }
        
        // Fermer en cliquant sur l'overlay
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
        
        // Soumission du formulaire
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleContactFormSubmission(this);
            });
        }
    }
    
    function handleContactFormSubmission(form) {
        const formData = new FormData(form);
        const nom = formData.get('nom');
        const email = formData.get('email');
        const telephone = formData.get('telephone');
        const message = formData.get('message');
        
        // Validation simple
        if (!nom || !email || !message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Simulation d'envoi
        const submitBtn = form.querySelector('.btn-send');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message envoyé avec succès ! Le vendeur vous contactera bientôt.', 'success');
            form.reset();
            document.getElementById('contact-modal').classList.remove('active');
            document.body.style.overflow = '';
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // ===============================================================
    // 📱 RÉVÉLATION DU TÉLÉPHONE
    // ===============================================================
    
    function setupPhoneReveal() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-phone')) {
                e.preventDefault();
                const btn = e.target.closest('.btn-phone');
                const phoneText = btn.querySelector('.phone-text');
                const phoneNumber = btn.querySelector('.phone-number');
                
                if (phoneText && phoneNumber) {
                    // Révéler le numéro
                    phoneText.style.display = 'none';
                    phoneNumber.style.display = 'inline';
                    btn.classList.add('revealed');
                    
                    // Copier le numéro dans le presse-papiers
                    navigator.clipboard.writeText(phoneNumber.textContent).then(() => {
                        showNotification('Numéro copié dans le presse-papiers !', 'success');
                    }).catch(() => {
                        showNotification('Numéro affiché !', 'info');
                    });
                    
                    // Animation
                    btn.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
    }
    
    // ===============================================================
    // ❤️ GESTION DES FAVORIS
    // ===============================================================
    
    function setupFavorites() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn-favorite')) {
                e.preventDefault();
                const btn = e.target.closest('.btn-favorite');
                const annonceId = btn.dataset.annonceId;
                
                toggleFavorite(annonceId, btn);
            }
        });
        
        // Charger les favoris sauvegardés
        loadFavorites();
    }
    
    function toggleFavorite(annonceId, btn) {
        const favorites = getFavorites();
        const isFavorited = favorites.includes(annonceId);
        
        if (isFavorited) {
            // Retirer des favoris
            const index = favorites.indexOf(annonceId);
            favorites.splice(index, 1);
            btn.classList.remove('favorited');
            btn.querySelector('i').className = 'far fa-heart';
            showNotification('Retiré des favoris', 'info');
        } else {
            // Ajouter aux favoris
            favorites.push(annonceId);
            btn.classList.add('favorited');
            btn.querySelector('i').className = 'fas fa-heart';
            showNotification('Ajouté aux favoris', 'success');
        }
        
        // Sauvegarder
        localStorage.setItem('marketplace_favorites', JSON.stringify(favorites));
    }
    
    function getFavorites() {
        const favorites = localStorage.getItem('marketplace_favorites');
        return favorites ? JSON.parse(favorites) : [];
    }
    
    function loadFavorites() {
        const favorites = getFavorites();
        favorites.forEach(annonceId => {
            const btn = document.querySelector(`[data-annonce-id="${annonceId}"]`);
            if (btn) {
                btn.classList.add('favorited');
                btn.querySelector('i').className = 'fas fa-heart';
            }
        });
    }
    
    // ===============================================================
    // 🍔 MENU MOBILE
    // ===============================================================
    
    function setupMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const closeMenuBtn = document.getElementById('close-menu');
        
        if (!hamburgerBtn || !mobileMenu || !mobileOverlay) return;
        
        function openMenu() {
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburgerBtn.classList.add('active');
        }
        
        function closeMenu() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburgerBtn.classList.remove('active');
        }
        
        // Event listeners
        hamburgerBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileOverlay.addEventListener('click', closeMenu);
        
        // Fermer le menu en cliquant sur un lien
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                setTimeout(closeMenu, 300);
            });
        });
        
        // Gestion du redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }
    
    // ===============================================================
    // 🎭 ANIMATIONS
    // ===============================================================
    
    function setupAnimations() {
        // Animation d'apparition des cartes au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observer toutes les cartes d'annonces
        const annonceCards = document.querySelectorAll('.annonce-card');
        annonceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
        
        // Animation des boutons au survol
        const actionBtns = document.querySelectorAll('.btn-contact, .btn-phone, .btn-favorite');
        actionBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // ===============================================================
    // 🎨 FONCTIONNALITÉS MODERNES
    // ===============================================================
    
    function initModernFeatures() {
        initRippleEffects();
        initSmoothScrolling();
        initKeyboardNavigation();
    }
    
    function initRippleEffects() {
        const rippleBtns = document.querySelectorAll('.btn-contact, .btn-phone, .btn-filter, .btn-send');
        
        rippleBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                createRippleEffect(e, this);
            });
        });
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
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function initSmoothScrolling() {
        // Smooth scroll pour les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    function initKeyboardNavigation() {
        // Navigation au clavier pour la modal
        document.addEventListener('keydown', function(e) {
            const modal = document.getElementById('contact-modal');
            if (modal && modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
    
    // ===============================================================
    // 📢 NOTIFICATIONS
    // ===============================================================
    
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Bouton de fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-fermeture après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
    
    function getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }
    
    // ===============================================================
    // 🎯 INITIALISATION FINALE
    // ===============================================================
    
    console.log('🎯 Marketplace - Initialisation terminée!');
    
    // Ajouter les styles CSS pour l'animation ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.2s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
});
