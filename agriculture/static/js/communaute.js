/* ===============================================================
   👥 Communauté Agricole - JavaScript
   🌾 Interactions et fonctionnalités de la communauté
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('👥 Communauté Agricole - JavaScript chargé avec succès!');
    
    // ===============================================================
    // 🎯 INITIALISATION
    // ===============================================================
    
    initializeCommunaute();
    
    function initializeCommunaute() {
        setupSearch();
        setupFilters();
        setupFollowButtons();
        setupJoinButtons();
        setupContactButtons();
        setupConsulterButtons();
        setupMobileMenu();
        setupHoverEffects();
        setupMembresCarousel();
        setupCloseCardButtons();
        setupMobileTabs();
    }
    
    // ===============================================================
    // 🔍 RECHERCHE
    // ===============================================================
    
    function setupSearch() {
        const globalSearch = document.getElementById('global-search');
        const searchMembres = document.getElementById('search-membres');
        const btnSearch = document.querySelector('.btn-search');
        
        if (globalSearch) {
            globalSearch.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performGlobalSearch(this.value);
                }
            });
        }
        
        if (searchMembres) {
            searchMembres.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filterMembres();
                }
            });
        }
        
        if (btnSearch) {
            btnSearch.addEventListener('click', function() {
                const searchValue = searchMembres?.value || '';
                filterMembres(searchValue);
            });
        }
    }
    
    function performGlobalSearch(query) {
        if (!query.trim()) return;
        
        console.log('Recherche globale:', query);
        // Ici on pourrait rediriger vers une page de résultats de recherche
        // ou filtrer les éléments de la page
        showToast('Recherche: ' + query, 'info');
    }
    
    function filterMembres(query) {
        const searchValue = query || document.getElementById('search-membres')?.value || '';
        const regionFilter = document.getElementById('filter-region')?.value || '';
        const roleFilter = document.getElementById('filter-role')?.value || '';
        const specialiteFilter = document.getElementById('filter-specialite')?.value || '';
        
        // Construire l'URL avec les filtres
        const params = new URLSearchParams();
        if (searchValue) params.append('recherche', searchValue);
        if (regionFilter) params.append('region', regionFilter);
        if (roleFilter) params.append('role', roleFilter);
        if (specialiteFilter) params.append('specialite', specialiteFilter);
        
        // Rediriger avec les filtres
        window.location.href = window.location.pathname + '?' + params.toString();
    }
    
    // ===============================================================
    // 🔧 FILTRES
    // ===============================================================
    
    function setupFilters() {
        const filterRegion = document.getElementById('filter-region');
        const filterRole = document.getElementById('filter-role');
        const filterSpecialite = document.getElementById('filter-specialite');
        const btnReset = document.querySelector('.btn-reset-filters');
        
        if (filterRegion) {
            filterRegion.addEventListener('change', function() {
                applyFilters();
            });
        }
        
        if (filterRole) {
            filterRole.addEventListener('change', function() {
                applyFilters();
            });
        }
        
        if (filterSpecialite) {
            filterSpecialite.addEventListener('change', function() {
                applyFilters();
            });
        }
        
        if (btnReset) {
            btnReset.addEventListener('click', function() {
                resetFilters();
            });
        }
    }
    
    function applyFilters() {
        const regionFilter = document.getElementById('filter-region')?.value || '';
        const roleFilter = document.getElementById('filter-role')?.value || '';
        const specialiteFilter = document.getElementById('filter-specialite')?.value || '';
        const searchValue = document.getElementById('search-membres')?.value || '';
        
        // Construire l'URL avec les filtres
        const params = new URLSearchParams();
        if (searchValue) params.append('recherche', searchValue);
        if (regionFilter) params.append('region', regionFilter);
        if (roleFilter) params.append('role', roleFilter);
        if (specialiteFilter) params.append('specialite', specialiteFilter);
        
        // Rediriger avec les filtres
        window.location.href = window.location.pathname + '?' + params.toString();
    }
    
    function resetFilters() {
        // Rediriger sans paramètres
        window.location.href = window.location.pathname;
    }
    
    // ===============================================================
    // 👤 ACTIONS MEMBRES
    // ===============================================================
    
    function setupFollowButtons() {
        const followButtons = document.querySelectorAll('.btn-follow');
        
        followButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleFollow(this);
            });
        });
    }
    
    function toggleFollow(button) {
        const isFollowing = button.classList.contains('following');
        
        if (isFollowing) {
            button.classList.remove('following');
            button.textContent = 'Suivre';
            button.style.background = 'var(--bg-primary)';
            button.style.color = 'var(--primary-green)';
            showToast('Vous ne suivez plus ce membre', 'info');
        } else {
            button.classList.add('following');
            button.textContent = 'Suivi';
            button.style.background = 'var(--primary-green)';
            button.style.color = 'white';
            showToast('Vous suivez maintenant ce membre', 'success');
        }
    }
    
    function setupContactButtons() {
        const contactButtons = document.querySelectorAll('.btn-contact, .btn-contact-coop');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.membre-card, .cooperative-item');
                if (card) {
                    const nom = card.querySelector('h3, h4')?.textContent || 'Membre';
                    showContactModal(nom);
                }
            });
        });
    }
    
    function showContactModal(nom) {
        // Créer une modale simple pour contacter
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Contacter ${nom}</h3>
                <form class="contact-form">
                    <textarea placeholder="Votre message..." rows="5" required></textarea>
                    <div class="modal-actions">
                        <button type="submit" class="btn-send">Envoyer</button>
                        <button type="button" class="btn-cancel">Annuler</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fermer la modale
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });
        
        // Soumettre le formulaire
        modal.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Message envoyé avec succès!', 'success');
            modal.remove();
        });
        
        // Clic en dehors pour fermer
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ===============================================================
    // 👨‍🔬 ACTIONS EXPERTS
    // ===============================================================
    
    function setupConsulterButtons() {
        const consulterButtons = document.querySelectorAll('.btn-consulter');
        
        consulterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const expertItem = this.closest('.expert-item');
                if (expertItem) {
                    const nom = expertItem.querySelector('h4')?.textContent || 'Expert';
                    const specialite = expertItem.querySelector('p')?.textContent || '';
                    showConsulterModal(nom, specialite);
                }
            });
        });
    }
    
    function showConsulterModal(nom, specialite) {
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Consulter ${nom}</h3>
                <p class="expert-specialite">${specialite}</p>
                <form class="contact-form">
                    <label>Type de consultation</label>
                    <select required>
                        <option value="">Sélectionner...</option>
                        <option value="conseil">Conseil technique</option>
                        <option value="diagnostic">Diagnostic</option>
                        <option value="formation">Formation</option>
                        <option value="autre">Autre</option>
                    </select>
                    <textarea placeholder="Décrivez votre besoin..." rows="5" required></textarea>
                    <div class="modal-actions">
                        <button type="submit" class="btn-send">Demander une consultation</button>
                        <button type="button" class="btn-cancel">Annuler</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            showToast('Demande de consultation envoyée!', 'success');
            modal.remove();
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // ===============================================================
    // 👥 ACTIONS GROUPES
    // ===============================================================
    
    function setupJoinButtons() {
        const joinButtons = document.querySelectorAll('.btn-join, .btn-join-culture, .btn-join-group');
        
        joinButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                toggleJoinGroup(this);
            });
        });
    }
    
    function toggleJoinGroup(button) {
        const isJoined = button.classList.contains('joined');
        
        if (isJoined) {
            button.classList.remove('joined');
            if (button.classList.contains('btn-join-culture')) {
                button.textContent = 'Rejoindre le groupe';
            } else if (button.classList.contains('btn-join-group')) {
                button.textContent = 'Rejoindre';
            } else {
                button.textContent = 'Rejoindre';
            }
            showToast('Vous avez quitté', 'info');
        } else {
            button.classList.add('joined');
            if (button.classList.contains('btn-join-culture')) {
                button.textContent = 'Rejoint ✓';
            } else if (button.classList.contains('btn-join-group')) {
                button.textContent = 'Rejoint';
            } else {
                button.textContent = 'Rejoint ✓';
            }
            showToast('Vous avez rejoint!', 'success');
        }
    }
    
    // ===============================================================
    // 📱 MENU MOBILE
    // ===============================================================
    // Note: La gestion du menu mobile est maintenant dans mobile_navigation.js
    // Cette fonction est conservée pour compatibilité mais peut être supprimée
    function setupMobileMenu() {
        // Le menu mobile est géré par mobile_navigation.js
        // Cette fonction est appelée pour compatibilité mais ne fait rien
    }
    
    // ===============================================================
    // 🎠 CAROUSEL MEMBRES
    // ===============================================================
    
    function setupMembresCarousel() {
        const carousel = document.getElementById('membresCarousel');
        const nextBtn = document.getElementById('nextMembres');
        
        if (!carousel || !nextBtn) return;
        
        // Fonction pour faire défiler le carousel
        function scrollCarousel(direction) {
            const cardWidth = 300 + 16; // Largeur de la carte + gap
            const scrollAmount = cardWidth * 2; // Défilement de 2 cartes à la fois
            
            if (direction === 'next') {
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
        
        // Bouton suivant
        if (nextBtn) {
            nextBtn.addEventListener('click', () => scrollCarousel('next'));
        }
        
        // Gestion de la visibilité des boutons de navigation selon la position du scroll
        function updateNavButtons() {
            const { scrollLeft, scrollWidth, clientWidth } = carousel;
            const isAtStart = scrollLeft === 0;
            const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 10;
            
            // Afficher/masquer les boutons selon la position
            const prevBtn = document.querySelector('.carousel-prev');
            if (prevBtn) {
                prevBtn.style.display = isAtStart ? 'none' : 'flex';
            }
            if (nextBtn) {
                nextBtn.style.display = isAtEnd ? 'none' : 'flex';
            }
        }
        
        // Écouter le scroll pour mettre à jour les boutons
        carousel.addEventListener('scroll', updateNavButtons);
        updateNavButtons(); // Initialisation
    }
    
    // ===============================================================
    // ❌ BOUTONS FERMER CARTE
    // ===============================================================
    
    function setupCloseCardButtons() {
        const closeButtons = document.querySelectorAll('.close-card-btn');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.membre-card-group');
                if (card) {
                    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.remove();
                        showToast('Membre retiré de la liste');
                    }, 300);
                }
            });
        });
    }
    
    // ===============================================================
    // 📑 ONGLETS MOBILE/TABLETTE
    // ===============================================================
    
    function setupMobileTabs() {
        const tabs = document.querySelectorAll('.mobile-tab');
        const contents = document.querySelectorAll('.mobile-tab-content');
        
        // Sur mobile, masquer tous les contenus sauf celui actif
        if (window.innerWidth <= 768) {
            contents.forEach(content => {
                if (!content.classList.contains('active')) {
                    content.style.display = 'none';
                }
            });
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Retirer active de tous les onglets
                tabs.forEach(t => t.classList.remove('active'));
                
                // Ajouter active à l'onglet cliqué
                this.classList.add('active');
                
                // Masquer tous les contenus
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (window.innerWidth <= 768) {
                        content.style.display = 'none';
                    }
                });
                
                // Afficher uniquement le contenu correspondant
                const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    if (window.innerWidth <= 768) {
                        targetContent.style.display = 'block';
                    }
                    
                    // Scroll vers le contenu si nécessaire
                    setTimeout(() => {
                        if (window.innerWidth <= 768) {
                            targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }, 100);
                }
            });
        });
        
        // Gérer le redimensionnement de la fenêtre
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    // Sur desktop, afficher tous les contenus
                    contents.forEach(content => {
                        content.style.display = '';
                        content.classList.add('active');
                    });
                } else {
                    // Sur mobile, afficher uniquement le contenu actif
                    const activeTab = document.querySelector('.mobile-tab.active');
                    if (activeTab) {
                        const activeTabData = activeTab.getAttribute('data-tab');
                        contents.forEach(content => {
                            const contentTab = content.getAttribute('data-content');
                            if (contentTab === activeTabData) {
                                content.style.display = 'block';
                                content.classList.add('active');
                            } else {
                                content.style.display = 'none';
                                content.classList.remove('active');
                            }
                        });
                    }
                }
            }, 250);
        });
    }
    
    // ===============================================================
    // ✨ EFFETS HOVER
    // ===============================================================
    
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.membre-card-group, .groupe-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // ===============================================================
    // 🔔 TOAST NOTIFICATIONS
    // ===============================================================
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-green)' : type === 'error' ? 'var(--danger-red)' : 'var(--info-blue)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-medium);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});

// Styles pour les modales (ajout dynamique)
const style = document.createElement('style');
style.textContent = `
    .contact-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }
    
    .contact-form label {
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .contact-form textarea,
    .contact-form select {
        padding: 12px;
        border: 1px solid #e4e6ea;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
    }
    
    .contact-form textarea:focus,
    .contact-form select:focus {
        outline: none;
        border-color: var(--primary-green);
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
    }
    
    .btn-send,
    .btn-cancel {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .btn-send {
        background: var(--primary-green);
        color: white;
    }
    
    .btn-send:hover {
        background: #0d8a4d;
    }
    
    .btn-cancel {
        background: var(--bg-secondary);
        color: var(--text-secondary);
    }
    
    .btn-cancel:hover {
        background: #e4e6ea;
    }
    
    .expert-specialite {
        color: var(--text-secondary);
        font-style: italic;
        margin: 10px 0;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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

