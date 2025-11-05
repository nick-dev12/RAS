from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages

@login_required
def projets_view(request):
    """
    Page des projets communs - Voir, contribuer et rejoindre des projets
    """
    user = request.user
    
    # Données simulées des projets
    projets = [
        {
            'id': 1,
            'titre': 'Coopérative de production de riz bio',
            'description': 'Création d\'une coopérative pour la production et la commercialisation de riz biologique certifié dans la région de Saint-Louis.',
            'porteur': {
                'nom': 'Amadou Diallo',
                'role': 'Agriculteur',
                'region': 'Saint-Louis',
                'photo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
            },
            'statut': 'En cours',
            'categorie': 'Production',
            'region': 'Saint-Louis',
            'participants': 12,
            'participants_max': 20,
            'budget': 5000000,
            'budget_collecte': 3200000,
            'date_creation': '2024-01-15',
            'date_fin': '2024-06-30',
            'tags': ['Riz', 'Bio', 'Coopérative', 'Saint-Louis'],
            'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Financement', 'montant': 500000},
                {'type': 'Terrain', 'superficie': '2 hectares'},
                {'type': 'Équipement', 'description': 'Tracteur'},
            ]
        },
        {
            'id': 2,
            'titre': 'Installation de système d\'irrigation solaire',
            'description': 'Projet d\'installation de systèmes d\'irrigation alimentés par l\'énergie solaire pour améliorer la productivité agricole.',
            'porteur': {
                'nom': 'Fatou Sarr',
                'role': 'Expert',
                'region': 'Thiès',
                'photo': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
            },
            'statut': 'Recherche de financement',
            'categorie': 'Innovation',
            'region': 'Thiès',
            'participants': 8,
            'participants_max': 15,
            'budget': 8000000,
            'budget_collecte': 1500000,
            'date_creation': '2024-02-01',
            'date_fin': '2024-08-31',
            'tags': ['Irrigation', 'Solaire', 'Innovation', 'Thiès'],
            'image': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Expertise', 'description': 'Conseil technique'},
                {'type': 'Financement', 'montant': 200000},
            ]
        },
        {
            'id': 3,
            'titre': 'Formation en agroécologie',
            'description': 'Organisation de sessions de formation sur les pratiques agroécologiques pour les agriculteurs de la région de Kaolack.',
            'porteur': {
                'nom': 'Moussa Ba',
                'role': 'Formateur',
                'region': 'Kaolack',
                'photo': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
            },
            'statut': 'En cours',
            'categorie': 'Formation',
            'region': 'Kaolack',
            'participants': 25,
            'participants_max': 30,
            'budget': 2000000,
            'budget_collecte': 1800000,
            'date_creation': '2024-01-20',
            'date_fin': '2024-05-15',
            'tags': ['Formation', 'Agroécologie', 'Kaolack'],
            'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Formation', 'description': 'Animation de sessions'},
                {'type': 'Financement', 'montant': 300000},
            ]
        },
        {
            'id': 4,
            'titre': 'Marché de producteurs locaux',
            'description': 'Création d\'un marché hebdomadaire pour les producteurs locaux afin de vendre directement leurs produits aux consommateurs.',
            'porteur': {
                'nom': 'Aissatou Diop',
                'role': 'Agriculteur',
                'region': 'Dakar',
                'photo': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
            },
            'statut': 'Recherche de participants',
            'categorie': 'Commercialisation',
            'region': 'Dakar',
            'participants': 5,
            'participants_max': 50,
            'budget': 3000000,
            'budget_collecte': 800000,
            'date_creation': '2024-02-10',
            'date_fin': '2024-07-31',
            'tags': ['Marché', 'Commerce', 'Dakar'],
            'image': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Terrain', 'description': 'Espace de marché'},
            ]
        },
        {
            'id': 5,
            'titre': 'Transformation de fruits et légumes',
            'description': 'Mise en place d\'une unité de transformation de fruits et légumes pour créer de la valeur ajoutée et réduire le gaspillage.',
            'porteur': {
                'nom': 'Ibrahima Ndiaye',
                'role': 'Investisseur',
                'region': 'Ziguinchor',
                'photo': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
            },
            'statut': 'En cours',
            'categorie': 'Transformation',
            'region': 'Ziguinchor',
            'participants': 15,
            'participants_max': 25,
            'budget': 10000000,
            'budget_collecte': 6500000,
            'date_creation': '2024-01-05',
            'date_fin': '2024-09-30',
            'tags': ['Transformation', 'Fruits', 'Légumes', 'Ziguinchor'],
            'image': 'https://images.unsplash.com/photo-1603561596112-20b8dc1d0f25?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Financement', 'montant': 1000000},
                {'type': 'Matériel', 'description': 'Équipements de transformation'},
            ]
        },
        {
            'id': 6,
            'titre': 'Élevage de volailles bio',
            'description': 'Projet d\'élevage de volailles en mode biologique avec certification pour répondre à la demande croissante.',
            'porteur': {
                'nom': 'Mariama Fall',
                'role': 'Agriculteur',
                'region': 'Louga',
                'photo': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
            },
            'statut': 'Recherche de financement',
            'categorie': 'Élevage',
            'region': 'Louga',
            'participants': 10,
            'participants_max': 18,
            'budget': 6000000,
            'budget_collecte': 2200000,
            'date_creation': '2024-02-15',
            'date_fin': '2024-10-31',
            'tags': ['Élevage', 'Volailles', 'Bio', 'Louga'],
            'image': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=400&fit=crop',
            'contributions': [
                {'type': 'Financement', 'montant': 400000},
                {'type': 'Terrain', 'superficie': '1 hectare'},
            ]
        },
    ]
    
    # Statistiques globales
    stats = {
        'total_projets': len(projets),
        'projets_en_cours': len([p for p in projets if p['statut'] == 'En cours']),
        'total_participants': sum([p['participants'] for p in projets]),
        'total_budget': sum([p['budget'] for p in projets]),
        'total_collecte': sum([p['budget_collecte'] for p in projets]),
    }
    
    # Catégories disponibles
    categories = ['Toutes', 'Production', 'Innovation', 'Formation', 'Commercialisation', 'Transformation', 'Élevage']
    
    # Régions disponibles
    regions = ['Toutes', 'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Louga']
    
    # Statuts disponibles
    statuts = ['Tous', 'En cours', 'Recherche de financement', 'Recherche de participants']
    
    context = {
        'title': 'Projets Communs',
        'projets': projets,
        'stats': stats,
        'categories': categories,
        'regions': regions,
        'statuts': statuts,
        'user': user,
    }
    
    return render(request, 'agriculture/projets/projets.html', context)

