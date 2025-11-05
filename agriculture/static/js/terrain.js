let map;
let markers = [];
let currentTerrains = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🗺️ Terrains Agricoles - JavaScript chargé avec succès!');
    
    initMap();
    initFilters();
    initCardInteractions();
    initMobileMenu();
});

// ===============================================================
// 🗺️ INITIALISATION DE LA CARTE
// ===============================================================

function initMap() {
    // Vérifier que Leaflet est chargé
    if (typeof L === 'undefined') {
        console.error('Leaflet n\'est pas chargé');
        return;
    }
    
    // Vérifier que l'élément map existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Élément map non trouvé');
        return;
    }
    
    // Initialiser la carte centrée sur le Sénégal
    map = L.map('map').setView([14.6928, -17.4467], 7);
    
    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Charger les terrains depuis le contexte Django
    loadTerrains();
}

// ===============================================================
// 🎯 CRÉER LES MARQUEURS PERSONNALISÉS
// ===============================================================

function createCustomIcon(statut) {
    const colors = {
        'vente': '#4CAF50',
        'location': '#9C27B0',
        'visite': '#FF9800'
    };
    
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${colors[statut] || '#4CAF50'}; 
                           width: 30px; height: 30px; 
                           border-radius: 50%; 
                           border: 3px solid white;
                           box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

function loadTerrains() {
    // Récupérer les terrains depuis les data attributes
    const terrainCards = document.querySelectorAll('.terrain-card-compact');
    
    terrainCards.forEach(card => {
        const terrain = {
            id: card.dataset.id,
            lat: parseFloat(card.dataset.lat),
            lng: parseFloat(card.dataset.lng),
            titre: card.querySelector('h3').textContent,
            statut: card.querySelector('.badge-status').classList[1]
        };
        
        currentTerrains.push(terrain);
        addMarker(terrain);
    });
    
    // Ajuster la vue pour afficher tous les marqueurs
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function addMarker(terrain) {
    const marker = L.marker([terrain.lat, terrain.lng], {
        icon: createCustomIcon(terrain.statut)
    }).addTo(map);
    
    // Popup au clic
    marker.bindPopup(`
        <div class="marker-popup">
            <h4>${terrain.titre}</h4>
            <button onclick="zoomToTerrain(${terrain.id})" class="popup-btn">
                Voir détails
            </button>
        </div>
    `);
    
    // Stocker l'ID pour la synchronisation
    marker.terrainId = terrain.id;
    markers.push(marker);
}

// ===============================================================
// 🔄 SYNCHRONISATION CARTE ↔ LISTE
// ===============================================================

function zoomToTerrain(terrainId) {
    // Trouver le marqueur correspondant
    const marker = markers.find(m => m.terrainId == terrainId);
    if (marker) {
        map.setView(marker.getLatLng(), 15);
        marker.openPopup();
    }
    
    // Highlight la carte dans la liste
    highlightCard(terrainId);
    
    // Scroll vers la carte
    const card = document.querySelector(`[data-id="${terrainId}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function highlightCard(terrainId) {
    // Retirer tous les highlights
    document.querySelectorAll('.terrain-card-compact').forEach(c => {
        c.classList.remove('highlighted');
    });
    
    // Ajouter le highlight
    const card = document.querySelector(`[data-id="${terrainId}"]`);
    if (card) {
        card.classList.add('highlighted');
        setTimeout(() => card.classList.remove('highlighted'), 3000);
    }
}

function initCardInteractions() {
    document.querySelectorAll('.terrain-card-compact').forEach(card => {
        card.addEventListener('click', function(e) {
            // Ne pas déclencher si on clique sur un bouton
            if (e.target.closest('button')) return;
            
            const terrainId = this.dataset.id;
            zoomToTerrain(terrainId);
        });
    });
}

// ===============================================================
// 🔍 FILTRAGE EN TEMPS RÉEL
// ===============================================================

function initFilters() {
    const applyBtn = document.getElementById('apply-filters');
    const resetBtn = document.getElementById('reset-filters');
    
    if (applyBtn) applyBtn.addEventListener('click', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

function applyFilters() {
    const region = document.getElementById('region-filter')?.value || '';
    const culture = document.getElementById('culture-filter')?.value || '';
    const surfaceMin = parseFloat(document.getElementById('surface-min')?.value) || 0;
    const surfaceMax = parseFloat(document.getElementById('surface-max')?.value) || Infinity;
    const statut = document.getElementById('statut-filter')?.value || '';
    
    let visibleCount = 0;
    
    document.querySelectorAll('.terrain-card-compact').forEach(card => {
        const cardRegion = card.dataset.region;
        const cardCulture = card.dataset.culture;
        const cardSurface = parseFloat(card.dataset.surface);
        const cardStatut = card.querySelector('.badge-status').classList[1];
        
        const matchRegion = !region || cardRegion === region;
        const matchCulture = !culture || cardCulture === culture;
        const matchSurface = cardSurface >= surfaceMin && cardSurface <= surfaceMax;
        const matchStatut = !statut || cardStatut === statut;
        
        if (matchRegion && matchCulture && matchSurface && matchStatut) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mettre à jour le compteur
    const terrainCount = document.getElementById('terrain-count');
    if (terrainCount) {
        terrainCount.textContent = visibleCount;
    }
    
    // Mettre à jour les marqueurs
    updateMarkers();
}

function updateMarkers() {
    // Retirer tous les marqueurs
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    // Ajouter uniquement les marqueurs visibles
    document.querySelectorAll('.terrain-card-compact').forEach(card => {
        if (card.style.display !== 'none') {
            const terrain = {
                id: card.dataset.id,
                lat: parseFloat(card.dataset.lat),
                lng: parseFloat(card.dataset.lng),
                titre: card.querySelector('h3').textContent,
                statut: card.querySelector('.badge-status').classList[1]
            };
            addMarker(terrain);
        }
    });
    
    // Ajuster la vue
    if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function resetFilters() {
    const regionFilter = document.getElementById('region-filter');
    const cultureFilter = document.getElementById('culture-filter');
    const surfaceMin = document.getElementById('surface-min');
    const surfaceMax = document.getElementById('surface-max');
    const statutFilter = document.getElementById('statut-filter');
    
    if (regionFilter) regionFilter.value = '';
    if (cultureFilter) cultureFilter.value = '';
    if (surfaceMin) surfaceMin.value = '';
    if (surfaceMax) surfaceMax.value = '';
    if (statutFilter) statutFilter.value = '';
    
    applyFilters();
}

// ===============================================================
// 💬 MODAL DE CONTACT
// ===============================================================

function openContactModal(terrainId) {
    const card = document.querySelector(`[data-id="${terrainId}"]`);
    const modal = document.getElementById('contact-modal');
    
    if (!card || !modal) return;
    
    // Remplir les infos du terrain
    const img = card.querySelector('.card-image img');
    const title = card.querySelector('h3');
    const location = card.querySelector('.location');
    
    if (img) document.getElementById('modal-terrain-img').src = img.src;
    if (title) document.getElementById('modal-terrain-title').textContent = title.textContent;
    if (location) document.getElementById('modal-terrain-location').textContent = location.textContent;
    
    // Afficher le modal
    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Fermer au clic sur l'overlay
document.addEventListener('click', function(e) {
    const modal = document.getElementById('contact-modal');
    if (modal && e.target === modal) {
        closeContactModal();
    }
});

// Gérer la soumission du formulaire
document.addEventListener('submit', function(e) {
    if (e.target.id === 'contact-form') {
        e.preventDefault();
        
        // Simuler l'envoi
        alert('Message envoyé avec succès !');
        closeContactModal();
        e.target.reset();
    }
});

// ===============================================================
// 🍔 GESTION DU MENU MOBILE
// ===============================================================

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu');
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('active');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animation du bouton hamburger
        if (hamburgerBtn) hamburgerBtn.classList.add('active');
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Animation du bouton hamburger
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    }
    
    // Event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }
    
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
// 🎨 FONCTIONNALITÉS MODERNES
// ===============================================================

// Animation d'apparition des cartes
function initAnimations() {
    const cards = document.querySelectorAll('.terrain-card-compact');
    
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

// Initialiser les animations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAnimations, 100);
    initFiltersToggle();
});

// ===============================================================
// 🔍 GESTION DU TOGGLE DES FILTRES MOBILE
// ===============================================================

function initFiltersToggle() {
    const toggleBtn = document.getElementById('filters-toggle');
    const filtersContent = document.getElementById('filters-content');
    
    if (toggleBtn && filtersContent) {
        toggleBtn.addEventListener('click', function() {
            filtersContent.classList.toggle('show');
            
            // Changer l'icône et le texte du bouton
            const icon = toggleBtn.querySelector('i');
            const text = toggleBtn.querySelector('span');
            
            if (filtersContent.classList.contains('show')) {
                icon.className = 'fas fa-times';
                text.textContent = 'Fermer';
            } else {
                icon.className = 'fas fa-filter';
                text.textContent = 'Filtres';
            }
        });
    }
}

// ===============================================================
// 🎯 FONCTIONS GLOBALES POUR LES ONCLICK
// ===============================================================

// Fonctions globales pour les boutons onclick
window.zoomToTerrain = zoomToTerrain;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;