from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from ..models.user_models import User


@login_required
def formations_view(request):
    """
    Vue principale pour afficher toutes les formations disponibles
    """
    user = request.user
    
    # Récupérer les filtres depuis la requête
    recherche = request.GET.get('recherche', '')
    categorie = request.GET.get('categorie', '')
    niveau = request.GET.get('niveau', '')
    prix_min = request.GET.get('prix_min', '')
    prix_max = request.GET.get('prix_max', '')
    gratuite = request.GET.get('gratuite', '')
    
    # Formations disponibles (mock data pour l'instant)
    formations_disponibles = [
        {
            'id': 1,
            'titre': 'Techniques Modernes de l\'Arachide',
            'description': 'Apprenez les meilleures techniques pour cultiver l\'arachide avec des rendements optimaux.',
            'categorie': 'Technique agricole',
            'niveau': 'Débutant',
            'duree': 20,
            'prix': 0,
            'gratuite': True,
            'image': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop',
            'formateur': 'Dr. Cheikh Ndiaye',
            'participants': 456,
            'note': 4.8,
            'certificat': True,
            'date_creation': '2024-01-15'
        },
        {
            'id': 2,
            'titre': 'Gestion Économique d\'une Exploitation',
            'description': 'Maîtrisez les bases de la gestion financière et comptable pour votre exploitation agricole.',
            'categorie': 'Gestion d\'exploitation',
            'niveau': 'Intermédiaire',
            'duree': 30,
            'prix': 15000,
            'gratuite': False,
            'image': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
            'formateur': 'Mme. Fatou Dieng',
            'participants': 234,
            'note': 4.6,
            'certificat': True,
            'date_creation': '2024-01-10'
        },
        {
            'id': 3,
            'titre': 'Agriculture Biologique et Durable',
            'description': 'Découvrez les principes de l\'agriculture biologique et les pratiques durables pour préserver l\'environnement.',
            'categorie': 'Environnement',
            'niveau': 'Débutant',
            'duree': 25,
            'prix': 0,
            'gratuite': True,
            'image': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&h=300&fit=crop',
            'formateur': 'Ing. Mamadou Fall',
            'participants': 678,
            'note': 4.9,
            'certificat': True,
            'date_creation': '2024-01-05'
        },
        {
            'id': 4,
            'titre': 'Commercialisation et Marché Agricole',
            'description': 'Techniques pour commercialiser efficacement vos produits et accéder aux meilleurs marchés.',
            'categorie': 'Commercialisation',
            'niveau': 'Intermédiaire',
            'duree': 18,
            'prix': 10000,
            'gratuite': False,
            'image': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
            'formateur': 'Dr. Aissatou Ba',
            'participants': 345,
            'note': 4.7,
            'certificat': True,
            'date_creation': '2024-01-08'
        },
        {
            'id': 5,
            'titre': 'Irrigation Moderne et Gestion de l\'Eau',
            'description': 'Apprenez les systèmes d\'irrigation modernes pour optimiser l\'utilisation de l\'eau.',
            'categorie': 'Technique agricole',
            'niveau': 'Avancé',
            'duree': 35,
            'prix': 20000,
            'gratuite': False,
            'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=300&fit=crop',
            'formateur': 'Ing. Ousmane Sy',
            'participants': 189,
            'note': 4.9,
            'certificat': True,
            'date_creation': '2024-01-12'
        },
        {
            'id': 6,
            'titre': 'Innovation en Agriculture : Technologies Smart',
            'description': 'Découvrez les dernières innovations technologiques pour l\'agriculture de précision.',
            'categorie': 'Innovation',
            'niveau': 'Expert',
            'duree': 40,
            'prix': 25000,
            'gratuite': False,
            'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&h=300&fit=crop',
            'formateur': 'Dr. Khady Seck',
            'participants': 123,
            'note': 5.0,
            'certificat': True,
            'date_creation': '2024-01-20'
        },
        {
            'id': 7,
            'titre': 'Certification Bio : Processus et Réglementation',
            'description': 'Guide complet pour obtenir la certification bio pour vos produits agricoles.',
            'categorie': 'Certification',
            'niveau': 'Intermédiaire',
            'duree': 15,
            'prix': 12000,
            'gratuite': False,
            'image': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&h=300&fit=crop',
            'formateur': 'Mme. Mariama Diop',
            'participants': 267,
            'note': 4.8,
            'certificat': True,
            'date_creation': '2024-01-18'
        },
        {
            'id': 8,
            'titre': 'Culture du Riz en Zone Soudano-Sahélienne',
            'description': 'Techniques spécifiques pour la culture du riz adaptées au climat sénégalais.',
            'categorie': 'Technique agricole',
            'niveau': 'Débutant',
            'duree': 22,
            'prix': 0,
            'gratuite': True,
            'image': 'https://images.unsplash.com/photo-1604644401890-0bd678b8372c?w=500&h=300&fit=crop',
            'formateur': 'Dr. Ibrahima Ndiaye',
            'participants': 512,
            'note': 4.7,
            'certificat': True,
            'date_creation': '2024-01-14'
        }
    ]
    
    # Formations en cours de l'utilisateur (mock data)
    formations_en_cours = [
        {
            'id': 3,
            'titre': 'Agriculture Biologique et Durable',
            'progression': 65,
            'statut': 'En cours',
            'date_debut': '2024-01-20',
            'date_fin_prevu': '2024-02-15'
        },
        {
            'id': 1,
            'titre': 'Techniques Modernes de l\'Arachide',
            'progression': 30,
            'statut': 'En cours',
            'date_debut': '2024-01-25',
            'date_fin_prevu': '2024-02-20'
        }
    ]
    
    # Filtrer les formations
    formations_filtrees = formations_disponibles.copy()
    
    if recherche:
        recherche_lower = recherche.lower()
        formations_filtrees = [f for f in formations_filtrees 
                               if recherche_lower in f['titre'].lower() 
                               or recherche_lower in f['description'].lower()]
    
    if categorie:
        formations_filtrees = [f for f in formations_filtrees if f['categorie'] == categorie]
    
    if niveau:
        formations_filtrees = [f for f in formations_filtrees if f['niveau'] == niveau]
    
    if gratuite == 'true':
        formations_filtrees = [f for f in formations_filtrees if f['gratuite']]
    
    if prix_min:
        try:
            prix_min_int = int(prix_min)
            formations_filtrees = [f for f in formations_filtrees if f['prix'] >= prix_min_int]
        except ValueError:
            pass
    
    if prix_max:
        try:
            prix_max_int = int(prix_max)
            formations_filtrees = [f for f in formations_filtrees if f['prix'] <= prix_max_int]
        except ValueError:
            pass
    
    # Catégories disponibles
    categories = ['Technique agricole', 'Gestion d\'exploitation', 'Commercialisation', 
                  'Environnement', 'Innovation', 'Certification']
    
    # Niveaux disponibles
    niveaux = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert']
    
    context = {
        'title': 'Formations - Réseau Agricole du Sénégal',
        'user': user,
        'formations': formations_filtrees,
        'formations_en_cours': formations_en_cours,
        'categories': categories,
        'niveaux': niveaux,
        'filtres_actifs': {
            'recherche': recherche,
            'categorie': categorie,
            'niveau': niveau,
            'prix_min': prix_min,
            'prix_max': prix_max,
            'gratuite': gratuite
        },
        'nombre_formations': len(formations_filtrees)
    }
    
    return render(request, 'agriculture/formations/formations.html', context)

