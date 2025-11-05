// ===============================================================
// 📊 JavaScript pour la page Projets Communs
// ===============================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Éléments du DOM
    const projetsGrid = document.getElementById('projets-grid');
    const projetCards = document.querySelectorAll('.projet-card');
    const searchInput = document.getElementById('search-projets');
    const filterCategorie = document.getElementById('filter-categorie');
    const filterRegion = document.getElementById('filter-region');
    const filterStatut = document.getElementById('filter-statut');
    const btnCreateProjet = document.getElementById('btn-create-projet');
    const projetModal = document.getElementById('projet-modal');
    const modalClose = document.getElementById('modal-close');
    
    // Données des projets (seront remplacées par des données réelles depuis le serveur)
    const projetsData = Array.from(projetCards).map(card => ({
        id: card.querySelector('.btn-contribuer')?.dataset.projetId || '',
        titre: card.querySelector('.projet-titre')?.textContent || '',
        description: card.querySelector('.projet-description')?.textContent || '',
        categorie: card.dataset.categorie || '',
        region: card.dataset.region || '',
        statut: card.dataset.statut || '',
    }));
    
    // ===============================================================
    // 🔍 Recherche et Filtres
    // ===============================================================
    
    function filterProjets() {
        const searchTerm = (searchInput?.value || '').toLowerCase();
        const categorieFilter = filterCategorie?.value || 'all';
        const regionFilter = filterRegion?.value || 'all';
        const statutFilter = filterStatut?.value || 'all';
        
        projetCards.forEach((card, index) => {
            const projet = projetsData[index];
            if (!projet) return;
            
            const matchesSearch = !searchTerm || 
                projet.titre.toLowerCase().includes(searchTerm) ||
                projet.description.toLowerCase().includes(searchTerm);
            
            const matchesCategorie = categorieFilter === 'all' || 
                projet.categorie === categorieFilter;
            
            const matchesRegion = regionFilter === 'all' || 
                projet.region === regionFilter;
            
            const matchesStatut = statutFilter === 'all' || 
                projet.statut === statutFilter;
            
            if (matchesSearch && matchesCategorie && matchesRegion && matchesStatut) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Afficher le message "Aucun projet" si aucun résultat
        const visibleCards = Array.from(projetCards).filter(card => 
            card.style.display !== 'none'
        );
        
        let noProjetsMsg = document.querySelector('.no-projets');
        if (visibleCards.length === 0) {
            if (!noProjetsMsg && projetsGrid) {
                noProjetsMsg = document.createElement('div');
                noProjetsMsg.className = 'no-projets';
                noProjetsMsg.innerHTML = `
                    <i class="fas fa-project-diagram"></i>
                    <h3>Aucun projet trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche</p>
                `;
                projetsGrid.appendChild(noProjetsMsg);
            }
        } else if (noProjetsMsg) {
            noProjetsMsg.remove();
        }
    }
    
    // Event listeners pour les filtres
    if (searchInput) {
        searchInput.addEventListener('input', filterProjets);
    }
    
    if (filterCategorie) {
        filterCategorie.addEventListener('change', filterProjets);
    }
    
    if (filterRegion) {
        filterRegion.addEventListener('change', filterProjets);
    }
    
    if (filterStatut) {
        filterStatut.addEventListener('change', filterProjets);
    }
    
    // ===============================================================
    // ➕ Créer un Projet
    // ===============================================================
    
    if (btnCreateProjet) {
        btnCreateProjet.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Ouvrir un modal pour créer un projet
            alert('Fonctionnalité de création de projet à venir !');
        });
    }
    
    // ===============================================================
    // 💝 Contribuer à un Projet
    // ===============================================================
    
    document.querySelectorAll('.btn-contribuer').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projetId = this.dataset.projetId;
            
            // TODO: Ouvrir un modal pour contribuer
            alert(`Contribution au projet ${projetId} - Fonctionnalité à venir !`);
        });
    });
    
    // ===============================================================
    // 👥 Rejoindre un Projet
    // ===============================================================
    
    document.querySelectorAll('.btn-rejoindre').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projetId = this.dataset.projetId;
            
            // TODO: Envoyer une requête pour rejoindre le projet
            if (confirm('Voulez-vous rejoindre ce projet ?')) {
                // TODO: Requête AJAX pour rejoindre
                alert(`Vous avez rejoint le projet ${projetId} !`);
                this.innerHTML = '<i class="fas fa-check"></i> <span>Rejoint</span>';
                this.classList.add('joined');
                this.disabled = true;
            }
        });
    });
    
    // ===============================================================
    // ℹ️ Détails du Projet (Modal)
    // ===============================================================
    
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const projetId = this.dataset.projetId;
            const projetCard = this.closest('.projet-card');
            
            if (!projetCard || !projetModal) return;
            
            // Récupérer les données du projet depuis la carte
            const titre = projetCard.querySelector('.projet-titre')?.textContent || '';
            const description = projetCard.querySelector('.projet-description')?.textContent || '';
            const porteurNom = projetCard.querySelector('.porteur-nom')?.textContent || '';
            const porteurRole = projetCard.querySelector('.porteur-role')?.textContent || '';
            const region = projetCard.querySelector('.projet-region span')?.textContent || '';
            const statut = projetCard.querySelector('.projet-badge-statut')?.textContent || '';
            const categorie = projetCard.querySelector('.projet-badge-categorie')?.textContent || '';
            const participants = projetCard.querySelector('.stat-item span')?.textContent || '';
            const budget = projetCard.querySelector('.budget-percentage')?.textContent || '';
            
            // Mettre à jour le modal
            const modalTitre = document.getElementById('modal-projet-titre');
            const modalContent = document.getElementById('modal-projet-content');
            
            if (modalTitre) modalTitre.textContent = titre;
            
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="projet-details">
                        <div class="detail-section">
                            <h3>Description</h3>
                            <p>${description}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Porteur du projet</h3>
                            <p><strong>${porteurNom}</strong> - ${porteurRole}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h3>Informations</h3>
                            <ul>
                                <li><strong>Région:</strong> ${region}</li>
                                <li><strong>Statut:</strong> ${statut}</li>
                                <li><strong>Catégorie:</strong> ${categorie}</li>
                                <li><strong>Participants:</strong> ${participants}</li>
                                <li><strong>Budget:</strong> ${budget}</li>
                            </ul>
                        </div>
                        
                        <div class="detail-actions">
                            <button class="btn-contribuer" data-projet-id="${projetId}">
                                <i class="fas fa-hand-holding-heart"></i>
                                Contribuer
                            </button>
                            <button class="btn-rejoindre" data-projet-id="${projetId}">
                                <i class="fas fa-user-plus"></i>
                                Rejoindre
                            </button>
                        </div>
                    </div>
                `;
            }
            
            // Afficher le modal
            projetModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fermer le modal
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            if (projetModal) {
                projetModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Fermer le modal en cliquant sur l'overlay
    if (projetModal) {
        projetModal.addEventListener('click', function(e) {
            if (e.target === projetModal) {
                projetModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Fermer le modal avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projetModal && projetModal.classList.contains('show')) {
            projetModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    // ===============================================================
    // 🎨 Animations CSS
    // ===============================================================
    
    // Ajouter l'animation fadeIn si elle n'existe pas
    if (!document.getElementById('projets-animations')) {
        const style = document.createElement('style');
        style.id = 'projets-animations';
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

