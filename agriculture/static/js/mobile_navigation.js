/* ===============================================================
   📱 Navigation Mobile - JavaScript Commun
   🌾 Gestion du menu coulissant et de la barre inférieure
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Mobile Navigation - JavaScript chargé');
    
    setupMobileNavigation();
    
    function setupMobileNavigation() {
        const hamburger = document.getElementById('hamburger-menu');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileOverlay = document.getElementById('mobile-menu-overlay');
        const closeMenu = document.getElementById('close-menu');
        const mobileHamburger = document.getElementById('mobile-hamburger');
        
        // Fonction pour ouvrir le menu
        function openMenu() {
            if (mobileMenu && mobileOverlay) {
                mobileMenu.classList.add('active');
                mobileOverlay.classList.add('active');
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Fonction pour fermer le menu
        function closeMenuHandler() {
            if (mobileMenu && mobileOverlay) {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        }
        
        // Bouton hamburger de la navbar supérieure
        if (hamburger) {
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                openMenu();
            });
        }
        
        // Bouton hamburger de la barre inférieure
        if (mobileHamburger) {
            mobileHamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                openMenu();
            });
        }
        
        // Bouton fermer
        if (closeMenu) {
            closeMenu.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMenuHandler();
            });
        }
        
        // Overlay (cliquer en dehors pour fermer)
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMenuHandler();
            });
        }
        
        // Fermer le menu en cliquant sur un lien valide
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Si c'est un lien valide, fermer le menu après un court délai
                if (this.href && this.href !== '#' && !this.href.includes('javascript:')) {
                    setTimeout(() => {
                        closeMenuHandler();
                    }, 100);
                } else {
                    // Si c'est un élément sans href valide, fermer le menu immédiatement
                    e.preventDefault();
                    setTimeout(() => {
                        closeMenuHandler();
                    }, 300);
                }
            });
        });
        
        // Fermer le menu avec la touche ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
                closeMenuHandler();
            }
        });
    }
});
