/* ===============================================================
   🎯 Dashboard Agriculteur - JavaScript
   📱 Interactions et animations pour le tableau de bord
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌾 Dashboard Agriculteur - JavaScript chargé avec succès!');
    
    // ===============================================================
    // 🧭 NAVIGATION PRINCIPALE - INITIALISATION EN PREMIER
    // ===============================================================
    
    // Gestion du menu mobile - Désactivé car géré par mobile_navigation.js
    // Le menu mobile est maintenant géré par le partial mobile_navigation.html
    
    // Gestion de la navigation entre sections
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    console.log('🔗 Navigation: Liens trouvés:', navLinks.length);
    console.log('📄 Sections trouvées:', sections.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetSection = this.getAttribute('data-section');
            const href = this.getAttribute('href');
            
            // Si le lien n'a pas d'attribut data-section OU si le href ne commence pas par #
            // C'est un lien externe, on le laisse passer normalement
            if (!targetSection || (href && !href.startsWith('#'))) {
                // C'est un lien externe (comme vers le fil d'actualité), on ne bloque pas
                return; // La navigation se fait normalement
            }
            
            // Sinon, c'est un lien interne vers une section du dashboard
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔄 Navigation vers:', targetSection);
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Masquer toutes les sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Afficher la section ciblée
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                console.log('✅ Section activée:', targetSection);
                
                // Fermer le menu mobile si ouvert (géré par mobile_navigation.js)
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const mobileOverlay = document.getElementById('mobile-menu-overlay');
                    if (mobileOverlay) mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Animation des éléments de la section avec délai pour éviter les erreurs
                setTimeout(() => {
                    if (typeof animateSectionElements === 'function') {
                        animateSectionElements(targetElement);
                    }
                }, 100);
            } else {
                console.error('❌ Section non trouvée:', targetSection);
            }
        });
    });
    
    // Gestion des liens de navigation dashboard dans le menu mobile
    const dashboardSectionLinks = document.querySelectorAll('.dashboard-section-link');
    dashboardSectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetSection = this.getAttribute('data-section');
            
            if (!targetSection) {
                return;
            }
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            dashboardSectionLinks.forEach(dLink => dLink.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            // Mettre à jour aussi les liens de la navbar desktop
            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-section') === targetSection) {
                    navLink.classList.add('active');
                }
            });
            
            // Masquer toutes les sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Afficher la section ciblée
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Fermer le menu mobile
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const mobileOverlay = document.getElementById('mobile-menu-overlay');
                    if (mobileOverlay) mobileOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Animation des éléments de la section
                setTimeout(() => {
                    if (typeof animateSectionElements === 'function') {
                        animateSectionElements(targetElement);
                    }
                }, 100);
            }
        });
    });
    
    // ===============================================================
    // 🧑‍🌾 GESTION MODAL PARCELLE
    // ===============================================================
    
    initializeParcelleModal();
    
    function initializeParcelleModal() {
        const modal = document.getElementById('modal-parcelle');
        const btnOpen = document.getElementById('btn-add-parcelle');
        const btnOpenEmpty = document.getElementById('btn-add-parcelle-empty');
        const btnClose = document.getElementById('close-modal-parcelle');
        const btnCancel = document.getElementById('cancel-modal-parcelle');
        
        // Ouvrir le modal
        if (btnOpen) {
            btnOpen.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        if (btnOpenEmpty) {
            btnOpenEmpty.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        }
        
        // Fermer le modal
        function closeModal() {
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        if (btnClose) {
            btnClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }
        
        if (btnCancel) {
            btnCancel.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                closeModal();
            });
        }
        
        // Fermer en cliquant sur l'overlay
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
        
        // Fermer avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // ===============================================================
    // 🔍 FILTRES PARCELLES
    // ===============================================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const parcelleCards = document.querySelectorAll('.parcelle-card-modern');
    
    if (filterButtons.length > 0 && parcelleCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const filter = this.getAttribute('data-filter');
                
                // Mettre à jour les boutons actifs
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filtrer les cartes
                parcelleCards.forEach(card => {
                    const statut = card.getAttribute('data-statut');
                    if (filter === 'all' || 
                        (filter === 'active' && statut && statut.includes('culture')) ||
                        (filter === 'jachere' && statut && statut.includes('jachère'))) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // ===============================================================
    // 🎨 ANIMATIONS ET EFFETS
    // ===============================================================
    
    // Animation des barres de progression
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            if (bar) {
                const width = bar.style.width || bar.getAttribute('data-width') || '0%';
                bar.style.width = '0%';
                
                setTimeout(() => {
                    if (bar) {
                        bar.style.width = width;
                    }
                }, 500);
            }
        });
    }
    
    // Animation des cartes au scroll avec effets modernes
    function animateSectionElements(section) {
        if (!section) return;
        
        const cards = section.querySelectorAll('.culture-field-3d, .formation-card, .post-card, .annonce-card, .stat-card, .meteo-card, .parcelle-card, .aide-card, .event-card, .alerte-item, .formation-item, .prev-card, .alerte-meteo, .conseils-list, .map-container, .parcelle-card, .certificat-card, .reco-card, .groupe-card, .annonce-card, .annonce-region-card, .aide-card, .demande-card, .event-card, .rappel-item, .summary-card');
        
        cards.forEach((card, index) => {
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px) scale(0.95)';
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    if (card) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                        
                        // Ajouter une animation de "pulse" pour les cartes importantes
                        if (card.classList.contains('stat-card') || card.classList.contains('summary-card')) {
                            setTimeout(() => {
                                card.style.animation = 'pulse 0.6s ease-in-out';
                            }, 200);
                        }
                    }
                }, index * 150);
            }
        });
        
        // Animer les barres de progression après l'animation des cartes
        setTimeout(animateProgressBars, 500);
        
        // Animer les icônes
        setTimeout(animateIcons, 300);
    }
    
    // Animation des icônes
    function animateIcons() {
        const icons = document.querySelectorAll('.summary-icon, .stat-icon, .nav-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.animation = 'bounceIn 0.6s ease-out';
            }, index * 100);
        });
    }
    
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observer toutes les cartes
    document.querySelectorAll('.culture-card, .formation-card, .post-card, .annonce-card, .stat-card, .meteo-card, .parcelle-card, .aide-card, .event-card').forEach(card => {
        card.classList.add('card-animate');
        observer.observe(card);
    });
    
    // ===============================================================
    // 💬 INTERACTIONS COMMUNAUTÉ
    // ===============================================================
    
    // Gestion du formulaire de publication rapide
    const publicationForm = document.querySelector('.publication-rapide');
    if (publicationForm) {
        const textarea = publicationForm.querySelector('textarea');
        const publishBtn = publicationForm.querySelector('.btn-primary');
        
        if (textarea && publishBtn) {
            textarea.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    publishBtn.style.opacity = '1';
                    publishBtn.style.transform = 'scale(1)';
                } else {
                    publishBtn.style.opacity = '0.7';
                    publishBtn.style.transform = 'scale(0.95)';
                }
            });
            
            publishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (textarea.value.trim().length > 0) {
                    // Simulation de publication
                    showNotification('Publication ajoutée avec succès!', 'success');
                    textarea.value = '';
                    publishBtn.style.opacity = '0.7';
                    publishBtn.style.transform = 'scale(0.95)';
                } else {
                    showNotification('Veuillez écrire quelque chose avant de publier.', 'error');
                }
            });
        }
    }
    
    // Gestion des likes et commentaires
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        const likeBtn = card.querySelector('.post-stats span:first-child');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
                this.style.color = this.style.color === 'rgb(220, 53, 69)' ? '#666' : '#dc3545';
                this.style.transform = this.style.transform === 'scale(1.2)' ? 'scale(1)' : 'scale(1.2)';
            });
        }
    });
    
    // ===============================================================
    // 🌦️ INTERACTIONS MÉTÉO
    // ===============================================================
    
    // Animation des cartes météo
    const meteoCards = document.querySelectorAll('.prev-card');
    meteoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ===============================================================
    // 🧑‍🌾 INTERACTIONS PARCELLES
    // ===============================================================
    
    // Gestion des boutons d'action des parcelles
    const parcelleCardsOld = document.querySelectorAll('.parcelle-card');
    parcelleCardsOld.forEach(card => {
        const modifyBtn = card.querySelector('.btn-action');
        const analysisBtn = card.querySelector('.btn-secondary');
        
        if (modifyBtn) {
            modifyBtn.addEventListener('click', function() {
                showNotification('Fonctionnalité de modification en cours de développement', 'info');
            });
        }
        
        if (analysisBtn) {
            analysisBtn.addEventListener('click', function() {
                showNotification('Analyse de sol demandée', 'success');
            });
        }
    });
    
    // ===============================================================
    // 🎓 INTERACTIONS FORMATIONS
    // ===============================================================
    
    // Gestion des boutons de formation
    const formationCards = document.querySelectorAll('.formation-card');
    formationCards.forEach(card => {
        const continueBtn = card.querySelector('.btn-action');
        if (continueBtn) {
            continueBtn.addEventListener('click', function() {
                showNotification('Redirection vers la formation...', 'info');
            });
        }
    });
    
    // Gestion des certificats
    const certificatCards = document.querySelectorAll('.certificat-card');
    certificatCards.forEach(card => {
        const downloadBtn = card.querySelector('.btn-sm');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                showNotification('Téléchargement du certificat...', 'success');
            });
        }
    });
    
    // ===============================================================
    // 💰 INTERACTIONS MARKETPLACE
    // ===============================================================
    
    // Gestion des annonces
    const annonceCards = document.querySelectorAll('.annonce-card, .annonce-region-card');
    annonceCards.forEach(card => {
        const contactBtn = card.querySelector('.btn-action');
        const modifyBtn = card.querySelector('.btn-secondary');
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                showNotification('Ouverture de la messagerie...', 'info');
            });
        }
        
        if (modifyBtn) {
            modifyBtn.addEventListener('click', function() {
                showNotification('Modification de l\'annonce...', 'info');
            });
        }
    });
    
    // ===============================================================
    // 🧭 INTERACTIONS ASSISTANCE
    // ===============================================================
    
    // Gestion des demandes d'aide
    const aideCards = document.querySelectorAll('.aide-card');
    aideCards.forEach(card => {
        const demandBtn = card.querySelector('.btn-action');
        if (demandBtn) {
            demandBtn.addEventListener('click', function() {
                showNotification('Demande d\'assistance envoyée!', 'success');
            });
        }
    });
    
    // ===============================================================
    // 📅 INTERACTIONS CALENDRIER
    // ===============================================================
    
    // Gestion des événements
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const modifyBtn = card.querySelector('.btn-sm');
        if (modifyBtn) {
            modifyBtn.addEventListener('click', function() {
                showNotification('Modification de l\'événement...', 'info');
            });
        }
    });
    
    // ===============================================================
    // 🔔 SYSTÈME DE NOTIFICATIONS
    // ===============================================================
    
    function showNotification(message, type = 'info') {
        // Créer l'élément de notification
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
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto-fermeture après 5 secondes
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ===============================================================
    // 📊 ANIMATIONS DES STATISTIQUES
    // ===============================================================
    
    // Animation des compteurs
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value');
        
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(parseFloat(target));
            
            if (isNumber) {
                const finalValue = parseFloat(target);
                let currentValue = 0;
                const increment = finalValue / 50;
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(currentValue);
                }, 30);
            }
        });
    }
    
    // ===============================================================
    // 🎯 INITIALISATION
    // ===============================================================
    
    // Animer la section active au chargement
    const activeSection = document.querySelector('.dashboard-section.active');
    if (activeSection) {
        animateSectionElements(activeSection);
    }
    
    // Animer les compteurs après un délai
    setTimeout(animateCounters, 1000);
    
    // ===============================================================
    // 📱 GESTION DU TOUCH POUR MOBILE
    // ===============================================================
    
    // Améliorer l'expérience tactile
    const touchElements = document.querySelectorAll('.btn-primary, .btn-action, .btn-secondary, .nav-link, .mobile-nav-link');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // ===============================================================
    // 🔄 GESTION DES ERREURS
    // ===============================================================
    
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.error);
        // Ne pas afficher de notification d'erreur pour éviter de gêner l'utilisateur
        // Les erreurs sont loggées dans la console pour le débogage
    });
    
    // ===============================================================
    // 📈 ANALYTIQUES SIMPLES
    // ===============================================================
    
    // Tracker les interactions utilisateur
    function trackInteraction(action, section) {
        console.log(`📊 Interaction: ${action} dans la section ${section}`);
        // Ici on pourrait envoyer des données à un service d'analytics
    }
    
    // Ajouter le tracking aux clics sur les sections
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            trackInteraction('navigation', section);
        });
    });
    
    console.log('🎯 Dashboard Agriculteur - Initialisation terminée!');
});

/* ===============================================================
   🎯 FONCTIONS UTILITAIRES GLOBALES
   =============================================================== */

// Fonction pour formater les nombres
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}

// Fonction pour formater les dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Fonction pour générer des couleurs aléatoires
function getRandomColor() {
    const colors = ['#008753', '#FDEF4C', '#D22831', '#F5E9D7', '#2c3e50'];
    return colors[Math.floor(Math.random() * colors.length)];
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
            field.style.borderColor = '#e9ecef';
        }
    });
    
    return isValid;
}

/* ===============================================================
   🎯 FIN DU FICHIER
   =============================================================== */
