/* ===============================================================
   🎓 Formations - JavaScript
   🌾 Interactions et fonctionnalités des formations
   =============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Formations - JavaScript chargé');
    
    initializeFormations();
    
    function initializeFormations() {
        setupInscriptionButtons();
        setupDetailsButtons();
        setupProgressBars();
        setupFilters();
    }
    
    // ===============================================================
    // 📝 BOUTONS D'INSCRIPTION
    // ===============================================================
    
    function setupInscriptionButtons() {
        const inscrireButtons = document.querySelectorAll('.btn-inscrire');
        
        inscrireButtons.forEach(button => {
            button.addEventListener('click', function() {
                const formationId = this.getAttribute('data-formation-id');
                inscrireFormation(formationId, this);
            });
        });
    }
    
    function inscrireFormation(formationId, button) {
        // Simulation d'inscription (à remplacer par un appel API)
        const formationCard = button.closest('.formation-card');
        const formationTitle = formationCard.querySelector('.formation-title').textContent;
        
        // Animation de chargement
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
        
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-check"></i> Inscrit';
            button.style.background = '#4CAF50';
            button.classList.add('inscrit');
            
            showToast(`Vous êtes inscrit à "${formationTitle}"`, 'success');
            
            // Ajouter un effet visuel
            formationCard.style.border = '2px solid var(--primary-green)';
            
            setTimeout(() => {
                formationCard.style.border = '';
            }, 2000);
        }, 1500);
    }
    
    // ===============================================================
    // 📄 BOUTONS DÉTAILS
    // ===============================================================
    
    function setupDetailsButtons() {
        const detailsButtons = document.querySelectorAll('.btn-details');
        
        detailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const formationId = this.getAttribute('data-formation-id');
                afficherDetails(formationId);
            });
        });
    }
    
    function afficherDetails(formationId) {
        // Simulation d'affichage des détails (à remplacer par une modal ou une page dédiée)
        showToast('Page de détails à venir...', 'info');
        console.log('Afficher détails formation:', formationId);
    }
    
    // ===============================================================
    // 📊 BARRES DE PROGRESSION
    // ===============================================================
    
    function setupProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // ===============================================================
    // 🔍 FILTRES
    // ===============================================================
    
    function setupFilters() {
        const filterSelects = document.querySelectorAll('#filter-categorie, #filter-niveau');
        const filterForm = document.querySelector('.filters-form');
        
        // Auto-submit sur changement de filtre
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                if (filterForm) {
                    filterForm.submit();
                }
            });
        });
        
        // Toggle checkbox gratuit
        const checkboxGratuit = document.querySelector('input[name="gratuite"]');
        if (checkboxGratuit) {
            checkboxGratuit.addEventListener('change', function() {
                if (filterForm) {
                    filterForm.submit();
                }
            });
        }
    }
    
    // ===============================================================
    // 🎯 TOAST NOTIFICATIONS
    // ===============================================================
    
    function showToast(message, type = 'info') {
        // Créer l'élément toast si il n'existe pas
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 250px;
            animation: slideInRight 0.3s ease;
        `;
        
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Ajouter les animations CSS si elles n'existent pas
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
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
});

