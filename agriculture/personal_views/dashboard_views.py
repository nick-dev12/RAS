from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Sum
from ..models import User

@login_required
def agriculteur_dashboard(request):
    """
    Tableau de bord agriculteur - 9 sections principales selon les spécifications
    """
    if request.user.user_type != 'agriculteur':
        messages.error(request, 'Accès non autorisé. Cette page est réservée aux agriculteurs.')
        return redirect('home')
    
    user = request.user
    
    # 🏠 ACCUEIL / RÉSUMÉ
    profil_rapide = {
        'nom': user.get_full_name(),
        'region': user.region or 'Non spécifiée',
        'village': user.village or 'Non spécifié',
        'type_culture': user.main_crops or 'Non spécifié',
        'photo': user.profile_picture.url if hasattr(user, 'profile_picture') and user.profile_picture else None
    }
    
    statut_cultures = [
        {'culture': 'Arachide', 'statut': 'En floraison', 'pourcentage': 75, 'couleur': 'vert'},
        {'culture': 'Mil', 'statut': 'En croissance', 'pourcentage': 45, 'couleur': 'orange'},
        {'culture': 'Riz', 'statut': 'En semis', 'pourcentage': 20, 'couleur': 'bleu'}
    ]
    
    # Articles publiés par l'agriculteur
    articles_publies = [
        {
            'type': 'Conseil',
            'titre': 'Techniques d\'irrigation goutte-à-goutte',
            'contenu': 'Partage d\'une technique efficace pour économiser l\'eau dans mes cultures de tomates. Le rendement a augmenté de 30% !',
            'date_publication': '2024-01-15',
            'likes': 24,
            'commentaires': 8,
            'vues': 156
        },
        {
            'type': 'Photo',
            'titre': 'Récolte exceptionnelle cette année !',
            'contenu': 'Regardez cette belle récolte d\'arachide ! Merci aux conseils de la communauté R.A.S 🌾',
            'date_publication': '2024-01-10',
            'likes': 67,
            'commentaires': 15,
            'vues': 312
        },
        {
            'type': 'Article',
            'titre': 'Impact du changement climatique sur l\'agriculture sénégalaise',
            'contenu': 'Analyse des défis et opportunités pour adapter nos pratiques agricoles aux nouvelles conditions climatiques.',
            'date_publication': '2024-01-05',
            'likes': 89,
            'commentaires': 23,
            'vues': 456
        }
    ]
    
    # 🌦️ MÉTÉO & ALERTE
    meteo_actuelle = {
        'temperature': 32,
        'condition': 'Ensoleillé',
        'humidite': 65,
        'vent': 12,
        'icon': '☀️'
    }
    
    previsions_5j = [
        {'jour': 'Aujourd\'hui', 'temp_max': 32, 'temp_min': 24, 'condition': '☀️', 'pluie': 0},
        {'jour': 'Demain', 'temp_max': 30, 'temp_min': 22, 'condition': '🌧️', 'pluie': 80},
        {'jour': 'Après-demain', 'temp_max': 28, 'temp_min': 20, 'condition': '⛅', 'pluie': 20},
        {'jour': 'J+3', 'temp_max': 31, 'temp_min': 23, 'condition': '☀️', 'pluie': 0},
        {'jour': 'J+4', 'temp_max': 33, 'temp_min': 25, 'condition': '☀️', 'pluie': 0}
    ]
    
    alertes_meteo = [
        {'type': 'vent', 'message': 'Vent fort prévu - Protégez vos cultures', 'urgence': 'moyenne'},
        {'type': 'pluie', 'message': 'Pluie modérée demain - Bon pour l\'arrosage', 'urgence': 'faible'}
    ]
    
    conseils_saison = [
        'Préparez la terre pour le semis de mil',
        'Vérifiez l\'état de vos systèmes d\'irrigation',
        'Planifiez la rotation des cultures'
    ]
    
    # 🧑‍🌾 MES PARCELLES
    parcelles = [
        {
            'id': 1,
            'nom': 'Parcelle Nord',
            'superficie': 2.5,
            'culture': 'Arachide',
            'statut': 'En culture',
            'rendement_attendu': 1.8,
            'region': 'Dakar',
            'coordonnees': {'lat': 14.6928, 'lng': -17.4467},
            'analyse_sol': 'Disponible'
        },
        {
            'id': 2,
            'nom': 'Parcelle Sud',
            'superficie': 1.8,
            'culture': 'Mil',
            'statut': 'En jachère',
            'rendement_attendu': 0,
            'region': 'Thiès',
            'coordonnees': {'lat': 14.6920, 'lng': -17.4460},
            'analyse_sol': 'En attente'
        }
    ]
    
    # 🎓 FORMATIONS
    formations_disponibles = [
        {
            'titre': 'Techniques modernes de culture',
            'duree': '3h',
            'niveau': 'Débutant',
            'progression': 60,
            'type': 'vidéo'
        },
        {
            'titre': 'Gestion de l\'eau agricole',
            'duree': '2h',
            'niveau': 'Intermédiaire',
            'progression': 30,
            'type': 'interactif'
        }
    ]
    
    certificats_obtenus = [
        {'titre': 'Techniques de base', 'date': '2024-08-15', 'badge': '🏆'},
        {'titre': 'Gestion des sols', 'date': '2024-07-20', 'badge': '💧'}
    ]
    
    formations_recommandees = [
        {'titre': 'Rotation des cultures', 'raison': 'Basé sur vos cultures actuelles', 'duree': '2h'},
        {'titre': 'Lutte biologique', 'raison': 'Pour réduire l\'usage de pesticides', 'duree': '1.5h'}
    ]
    
    
    # 🧭 ASSISTANCE & CONSEILS
    types_aide = [
        {'nom': 'Analyse de sol', 'description': 'Étude de la composition de votre terre', 'duree': '2-3 jours'},
        {'nom': 'Conseil irrigation', 'description': 'Optimisation de l\'arrosage', 'duree': '1 jour'},
        {'nom': 'Choix des cultures', 'description': 'Recommandations selon votre région', 'duree': '1-2 jours'}
    ]
    
    demandes_en_cours = [
        {'type': 'Analyse de sol', 'statut': 'En cours', 'date': '2024-10-20', 'expert': 'Dr. Ndiaye'},
        {'type': 'Conseil irrigation', 'statut': 'Terminé', 'date': '2024-10-15', 'expert': 'Ing. Fall'}
    ]
    
    
    context = {
        'title': 'Tableau de Bord - Agriculteur',
        'user': user,
        # Accueil
        'profil_rapide': profil_rapide,
        'statut_cultures': statut_cultures,
        'articles_publies': articles_publies,
        # Météo
        'meteo_actuelle': meteo_actuelle,
        'previsions_5j': previsions_5j,
        'alertes_meteo': alertes_meteo,
        'conseils_saison': conseils_saison,
        # Parcelles
        'parcelles': parcelles,
        # Formations
        'formations_disponibles': formations_disponibles,
        'certificats_obtenus': certificats_obtenus,
        'formations_recommandees': formations_recommandees,
        # Assistance
        'types_aide': types_aide,
        'demandes_en_cours': demandes_en_cours,
    }
    
    return render(request, 'agriculture/dashboard/agriculteur_dashboard.html', context)

@login_required
def newsfeed_view(request):
    """
    Fil d'actualités agricole - Mur social pour tous les acteurs
    """
    user = request.user
    
    # Données simulées pour le fil d'actualités - Toutes liées à l'agriculture et la ferme
    publications = [
        {
            'id': 1,
            'auteur': {
                'nom': 'Aissatou Ndiaye',
                'photo': '👩‍🌾',
                'role': 'Agricultrice',
                'region': 'Thiès',
                'verifie': True
            },
            'date': '2h',
            'type': 'conseil',
            'titre': 'Techniques d\'irrigation goutte-à-goutte pour économiser l\'eau',
            'contenu': 'Partage d\'une technique efficace pour économiser l\'eau dans mes cultures de tomates. Le système d\'irrigation goutte-à-goutte permet d\'arroser directement les racines. Le rendement a augmenté de 30% !',
            'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop&q=80',
            'likes': 24,
            'commentaires': 8,
            'partages': 3,
            'vues': 156,
            'liked': False
        },
        {
            'id': 2,
            'auteur': {
                'nom': 'Moussa Sall',
                'photo': '👨‍🌾',
                'role': 'Technicien Agricole',
                'region': 'Dakar',
                'verifie': True
            },
            'date': '4h',
            'type': 'annonce',
            'titre': 'Formation gratuite - Gestion durable des sols agricoles',
            'contenu': 'L\'ANSD organise une formation gratuite sur la gestion durable des sols agricoles. Apprenez les techniques de fertilisation naturelle, la prévention de l\'érosion et l\'amélioration de la fertilité. Inscriptions ouvertes jusqu\'au 30 novembre.',
            'image': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=500&fit=crop&q=80',
            'likes': 45,
            'commentaires': 12,
            'partages': 7,
            'vues': 234,
            'liked': True
        },
        {
            'id': 3,
            'auteur': {
                'nom': 'Fatou Diop',
                'photo': '👩‍🌾',
                'role': 'Productrice d\'Arachide',
                'region': 'Kaolack',
                'verifie': False
            },
            'date': '6h',
            'type': 'photo',
            'titre': 'Récolte exceptionnelle d\'arachide cette année !',
            'contenu': 'Regardez cette belle récolte d\'arachide ! Les plants sont sains et les gousses bien remplies. Merci aux conseils de la communauté R.A.S sur la fertilisation bio 🌾',
            'image': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop&q=80',
            'likes': 67,
            'commentaires': 15,
            'partages': 9,
            'vues': 312,
            'liked': False
        },
        {
            'id': 4,
            'auteur': {
                'nom': 'Dr. Amadou Ba',
                'photo': '👨‍🔬',
                'role': 'Expert Agronome',
                'region': 'Dakar',
                'verifie': True
            },
            'date': '1j',
            'type': 'article',
            'titre': 'Impact du changement climatique sur l\'agriculture sénégalaise',
            'contenu': 'Analyse approfondie des défis et opportunités pour adapter nos pratiques agricoles aux nouvelles conditions climatiques. Stratégies de résilience pour les cultures locales.',
            'image': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop&q=80',
            'likes': 89,
            'commentaires': 23,
            'partages': 15,
            'vues': 456,
            'liked': True
        },
        {
            'id': 5,
            'auteur': {
                'nom': 'Coopérative de Ziguinchor',
                'photo': '🏢',
                'role': 'Coopérative Agricole',
                'region': 'Ziguinchor',
                'verifie': True
            },
            'date': '2j',
            'type': 'annonce',
            'titre': 'Achat groupé d\'engrais biologiques pour fermes',
            'contenu': 'Nous organisons un achat groupé d\'engrais biologiques certifiés. Compost, fumier et engrais verts disponibles. Prix préférentiel pour les membres de la coopérative. Contactez-nous !',
            'image': 'https://images.unsplash.com/photo-1584747420644-5c767eebcbe6?w=800&h=500&fit=crop&q=80',
            'likes': 34,
            'commentaires': 6,
            'partages': 4,
            'vues': 178,
            'liked': False
        },
        {
            'id': 6,
            'auteur': {
                'nom': 'Ousmane Dieng',
                'photo': '👨‍🌾',
                'role': 'Producteur de Riz',
                'region': 'Saint-Louis',
                'verifie': False
            },
            'date': '3j',
            'type': 'photo',
            'titre': 'Nouvelles plantations de riz dans les rizières',
            'contenu': 'Début de la saison des plantations de riz. Cette année on teste une nouvelle variété résistante à la sécheresse et aux maladies ! Les jeunes plants poussent bien dans les rizières.',
            'image': 'https://images.unsplash.com/photo-1659333555620-0d58d9fd1a5a?w=800&h=500&fit=crop&q=80',
            'likes': 52,
            'commentaires': 11,
            'partages': 5,
            'vues': 245,
            'liked': False
        },
        {
            'id': 7,
            'auteur': {
                'nom': 'Aminata Sarr',
                'photo': '👩‍🌾',
                'role': 'Maraîchère',
                'region': 'Thiès',
                'verifie': True
            },
            'date': '4j',
            'type': 'conseil',
            'titre': 'Technique de rotation des cultures en maraîchage',
            'contenu': 'La rotation des cultures a considérablement amélioré la qualité de mon sol et réduit les maladies. Cette année : tomates, puis haricots, puis choux. Partage d\'expérience avec la communauté !',
            'image': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=500&fit=crop&q=80',
            'likes': 78,
            'commentaires': 19,
            'partages': 12,
            'vues': 389,
            'liked': True
        },
        {
            'id': 8,
            'auteur': {
                'nom': 'Union des Coopératives',
                'photo': '🏢',
                'role': 'Coopérative Agricole',
                'region': 'Dakar',
                'verifie': True
            },
            'date': '5j',
            'type': 'annonce',
            'titre': 'Marché de producteurs agricoles - Samedi prochain',
            'contenu': 'Grand marché de producteurs locaux le samedi 23 novembre. Venez découvrir les produits frais de la région : légumes, fruits, céréales, produits laitiers de la ferme. Soutenez l\'agriculture locale !',
            'image': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=500&fit=crop&q=80',
            'likes': 91,
            'commentaires': 24,
            'partages': 18,
            'vues': 567,
            'liked': False
        },
        {
            'id': 9,
            'auteur': {
                'nom': 'Ibrahima Fall',
                'photo': '👨‍🌾',
                'role': 'Éleveur',
                'region': 'Louga',
                'verifie': True
            },
            'date': '6j',
            'type': 'conseil',
            'titre': 'Gestion du bétail en période de sécheresse',
            'contenu': 'Conseils pratiques pour nourrir et hydrater le bétail pendant la saison sèche. Stockage du foin, points d\'eau et compléments nutritionnels. Expérience de 15 ans d\'élevage !',
            'image': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&h=500&fit=crop&q=80',
            'likes': 56,
            'commentaires': 14,
            'partages': 8,
            'vues': 298,
            'liked': False
        },
        {
            'id': 10,
            'auteur': {
                'nom': 'Mariama Diallo',
                'photo': '👩‍🌾',
                'role': 'Productrice de Mil',
                'region': 'Tambacounda',
                'verifie': False
            },
            'date': '1 sem',
            'type': 'photo',
            'titre': 'Champs de mil en pleine croissance',
            'contenu': 'Mes champs de mil poussent magnifiquement cette saison ! Les épis commencent à se former. Variété locale adaptée au climat sénégalais. 🌾',
            'image': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop&q=80',
            'likes': 43,
            'commentaires': 9,
            'partages': 6,
            'vues': 201,
            'liked': True
        },
        {
            'id': 11,
            'auteur': {
                'nom': 'Coopérative de Diourbel',
                'photo': '🏢',
                'role': 'Coopérative Agricole',
                'region': 'Diourbel',
                'verifie': True
            },
            'date': '1 sem',
            'type': 'annonce',
            'titre': 'Formation sur l\'agriculture biologique',
            'contenu': 'Formation pratique sur les techniques d\'agriculture biologique : compostage, lutte biologique contre les ravageurs, associations de cultures. Certificat délivré à la fin.',
            'image': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop&q=80',
            'likes': 72,
            'commentaires': 18,
            'partages': 11,
            'vues': 423,
            'liked': False
        },
        {
            'id': 12,
            'auteur': {
                'nom': 'Papa Samba',
                'photo': '👨‍🌾',
                'role': 'Producteur de Maïs',
                'region': 'Kolda',
                'verifie': True
            },
            'date': '1 sem',
            'type': 'conseil',
            'titre': 'Récolte et stockage du maïs',
            'contenu': 'Moment crucial pour la récolte du maïs ! Partage de techniques pour bien sécher et stocker les épis pour éviter les moisissures et les pertes. Conservation optimale jusqu\'à la prochaine saison.',
            'image': 'https://images.unsplash.com/photo-1593113616828-c4b94bc5ab85?w=800&h=500&fit=crop&q=80',
            'likes': 61,
            'commentaires': 13,
            'partages': 7,
            'vues': 334,
            'liked': True
        }
    ]
    
    # Données pour la barre droite
    meteo_actuelle = {
        'temperature': 32,
        'condition': 'Ensoleillé',
        'humidite': 65,
        'icon': '☀️'
    }
    
    prix_marche = [
        {'produit': 'Arachide', 'prix': '320 FCFA/kg', 'variation': '+5%'},
        {'produit': 'Riz', 'prix': '500 FCFA/kg', 'variation': '+2%'},
        {'produit': 'Mil', 'prix': '350 FCFA/kg', 'variation': '-1%'},
        {'produit': 'Maïs', 'prix': '300 FCFA/kg', 'variation': '+3%'}
    ]
    
    suggestions_utilisateurs = [
        {'nom': 'Dr. Mariama Diallo', 'role': 'Vétérinaire', 'region': 'Dakar', 'mutual': 12},
        {'nom': 'Coopérative de Saint-Louis', 'role': 'Coopérative', 'region': 'Saint-Louis', 'mutual': 8},
        {'nom': 'Abdou Fall', 'role': 'Formateur', 'region': 'Thiès', 'mutual': 15}
    ]
    
    actualites_officielles = [
        {'titre': 'Nouvelle politique agricole 2024', 'source': 'Ministère Agriculture', 'date': '1j'},
        {'titre': 'Subventions pour l\'irrigation', 'source': 'ANSD', 'date': '2j'},
        {'titre': 'Formation gratuite bio', 'source': 'ISRA', 'date': '3j'}
    ]
    
    formations_recommandees = [
        {'titre': 'Gestion des sols', 'duree': '3h', 'niveau': 'Débutant'},
        {'titre': 'Irrigation moderne', 'duree': '2h', 'niveau': 'Intermédiaire'},
        {'titre': 'Agriculture bio', 'duree': '4h', 'niveau': 'Avancé'}
    ]
    
    context = {
        'title': 'Fil d\'Actualités - Réseau Agricole du Sénégal',
        'user': user,
        'publications': publications,
        'meteo_actuelle': meteo_actuelle,
        'prix_marche': prix_marche,
        'suggestions_utilisateurs': suggestions_utilisateurs,
        'actualites_officielles': actualites_officielles,
        'formations_recommandees': formations_recommandees,
    }
    
    return render(request, 'agriculture/newsfeed/newsfeed.html', context)

@login_required
def formateur_dashboard(request):
    """
    Tableau de bord pour les formateurs
    """
    if request.user.user_type != 'formateur':
        messages.error(request, 'Accès non autorisé. Cette page est réservée aux formateurs.')
        return redirect('home')
    
    context = {
        'title': 'Tableau de Bord - Formateur',
        'user': request.user
    }
    
    return render(request, 'agriculture/dashboard/formateur_dashboard.html', context)

@login_required
def expert_dashboard(request):
    """
    Tableau de bord pour les experts
    """
    if request.user.user_type != 'expert':
        messages.error(request, 'Accès non autorisé. Cette page est réservée aux experts.')
        return redirect('home')
    
    context = {
        'title': 'Tableau de Bord - Expert',
        'user': request.user
    }
    
    return render(request, 'agriculture/dashboard/expert_dashboard.html', context)

@login_required
def investisseur_dashboard(request):
    """
    Tableau de bord pour les investisseurs
    """
    if request.user.user_type != 'investisseur':
        messages.error(request, 'Accès non autorisé. Cette page est réservée aux investisseurs.')
        return redirect('home')
    
    context = {
        'title': 'Tableau de Bord - Investisseur',
        'user': request.user
    }
    
    return render(request, 'agriculture/dashboard/investisseur_dashboard.html', context)

@login_required
def dashboard_router(request):
    """
    Routeur pour rediriger vers le bon tableau de bord selon le type d'utilisateur
    """
    user_type = request.user.user_type
    
    if user_type == 'agriculteur':
        return redirect('agriculteur_dashboard')
    elif user_type == 'formateur':
        return redirect('formateur_dashboard')
    elif user_type == 'expert':
        return redirect('expert_dashboard')
    elif user_type == 'investisseur':
        return redirect('investisseur_dashboard')
    else:
        messages.error(request, 'Type d\'utilisateur non reconnu.')
        return redirect('home')

@login_required
def marketplace_view(request):
    """
    Page Annonces / Marché - Marketplace agricole avec filtres et recherche
    """
    # Données simulées pour les annonces (15-20 annonces variées)
    annonces = [
        {
            'id': 1,
            'titre': 'Arachide de qualité supérieure',
            'description': 'Arachide fraîche récoltée cette semaine, parfaite pour la consommation ou la transformation. Variété 55-437, rendement excellent.',
            'prix': 450,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Céréales',
            'region': 'Thiès',
            'vendeur': {
                'nom': 'Amadou Diop',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 77 123 45 67',
                'rating': 4.8
            },
            'date_publication': '2024-01-15',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1724058663142-e6e1a5e89f2d?w=400&h=300&fit=crop&q=80', 'https://images.unsplash.com/photo-1724058663142-e6e1a5e89f2d?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '500 kg',
            'localisation': 'Keur Moussa'
        },
        {
            'id': 2,
            'titre': 'Tomates cerises bio',
            'description': 'Tomates cerises cultivées sans pesticides, parfaites pour les salades et la cuisine. Récolte quotidienne garantie.',
            'prix': 800,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Légumes',
            'region': 'Dakar',
            'vendeur': {
                'nom': 'Fatou Sall',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-woman.jpg',
                'telephone': '+221 78 234 56 78',
                'rating': 4.9
            },
            'date_publication': '2024-01-14',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop'],
            'quantite_disponible': '200 kg',
            'localisation': 'Parcelles de Hann'
        },
        {
            'id': 3,
            'titre': 'Mangues Kent premium',
            'description': 'Mangues Kent de première qualité, sucrées et juteuses. Idéales pour l\'export ou la consommation locale.',
            'prix': 1200,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Fruits',
            'region': 'Ziguinchor',
            'vendeur': {
                'nom': 'Ibrahima Camara',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 76 345 67 89',
                'rating': 4.7
            },
            'date_publication': '2024-01-13',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1663018084454-86fd8150f950?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '1 tonne',
            'localisation': 'Bignona'
        },
        {
            'id': 4,
            'titre': 'Bœufs de race locale',
            'description': 'Bœufs en bonne santé, élevés en pâturage naturel. Disponibles pour la vente ou l\'élevage.',
            'prix': 250000,
            'prix_unite': 'FCFA/pièce',
            'categorie': 'Bétail',
            'region': 'Kolda',
            'vendeur': {
                'nom': 'Moussa Diallo',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 77 456 78 90',
                'rating': 4.6
            },
            'date_publication': '2024-01-12',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1690670022551-65b08fc9c486?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '5 têtes',
            'localisation': 'Vélingara'
        },
        {
            'id': 5,
            'titre': 'Semences de riz NERICA',
            'description': 'Semences de riz NERICA certifiées, adaptées aux conditions sénégalaises. Rendement garanti.',
            'prix': 1500,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Semences',
            'region': 'Saint-Louis',
            'vendeur': {
                'nom': 'Coopérative Agricole du Nord',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-cooperative-group.jpg',
                'telephone': '+221 33 123 45 67',
                'rating': 4.9
            },
            'date_publication': '2024-01-11',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1730127564699-9673611b2398?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '2 tonnes',
            'localisation': 'Podor'
        },
        {
            'id': 6,
            'titre': 'Service de labour avec tracteur',
            'description': 'Service de labour professionnel avec tracteur moderne. Tarif par hectare, disponible dans toute la région.',
            'prix': 15000,
            'prix_unite': 'FCFA/ha',
            'categorie': 'Services',
            'region': 'Kaolack',
            'vendeur': {
                'nom': 'Service Agricole Pro',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-service-provider.jpg',
                'telephone': '+221 77 567 89 01',
                'rating': 4.8
            },
            'date_publication': '2024-01-10',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1708417134532-58723b020afe?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': 'Illimité',
            'localisation': 'Kaolack et environs'
        },
        {
            'id': 7,
            'titre': 'Oignons de conservation',
            'description': 'Oignons de variété Violet de Galmi, excellente conservation. Récolte récente, stockage optimal.',
            'prix': 600,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Légumes',
            'region': 'Matam',
            'vendeur': {
                'nom': 'Aïcha Ba',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-woman.jpg',
                'telephone': '+221 78 678 90 12',
                'rating': 4.5
            },
            'date_publication': '2024-01-09',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1720240462804-6b4216e1ac5e?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '800 kg',
            'localisation': 'Matam'
        },
        {
            'id': 8,
            'titre': 'Moutons de race Peul',
            'description': 'Moutons de race Peul en excellente santé, vaccinés et déparasités. Idéals pour l\'élevage ou la consommation.',
            'prix': 80000,
            'prix_unite': 'FCFA/pièce',
            'categorie': 'Bétail',
            'region': 'Tambacounda',
            'vendeur': {
                'nom': 'Boubacar Sow',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 76 789 01 23',
                'rating': 4.7
            },
            'date_publication': '2024-01-08',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1590686824485-09dab5abe6f1?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '12 têtes',
            'localisation': 'Tambacounda'
        },
        {
            'id': 9,
            'titre': 'Citrons verts frais',
            'description': 'Citrons verts cueillis à maturité, parfaits pour la cuisine et les boissons. Acidité optimale.',
            'prix': 400,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Fruits',
            'region': 'Fatick',
            'vendeur': {
                'nom': 'Mariama Diouf',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-woman.jpg',
                'telephone': '+221 77 890 12 34',
                'rating': 4.6
            },
            'date_publication': '2024-01-07',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1578855691621-8a08ea00d1fb?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '300 kg',
            'localisation': 'Foundiougne'
        },
        {
            'id': 10,
            'titre': 'Mil rouge traditionnel',
            'description': 'Mil rouge de variété locale, cultivé selon les méthodes traditionnelles. Goût authentique garanti.',
            'prix': 350,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Céréales',
            'region': 'Louga',
            'vendeur': {
                'nom': 'Modou Faye',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 78 901 23 45',
                'rating': 4.8
            },
            'date_publication': '2024-01-06',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1653580524515-77b19c176b88?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '1 tonne',
            'localisation': 'Kébémer'
        },
        {
            'id': 11,
            'titre': 'Service de transport agricole',
            'description': 'Transport de produits agricoles avec véhicules réfrigérés. Dakar et environs, tarifs compétitifs.',
            'prix': 5000,
            'prix_unite': 'FCFA/tonne',
            'categorie': 'Services',
            'region': 'Dakar',
            'vendeur': {
                'nom': 'Transport Vert',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-service-provider.jpg',
                'telephone': '+221 77 012 34 56',
                'rating': 4.4
            },
            'date_publication': '2024-01-05',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1703597803465-20f393f84e0a?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': 'Illimité',
            'localisation': 'Dakar et environs'
        },
        {
            'id': 12,
            'titre': 'Pommes de terre nouvelles',
            'description': 'Pommes de terre nouvelles, récolte précoce. Texture ferme, goût délicat, parfaites pour la cuisine.',
            'prix': 700,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Légumes',
            'region': 'Diourbel',
            'vendeur': {
                'nom': 'Papa Ndiaye',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-man.jpg',
                'telephone': '+221 76 123 45 67',
                'rating': 4.7
            },
            'date_publication': '2024-01-04',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '600 kg',
            'localisation': 'Bambey'
        },
        {
            'id': 13,
            'titre': 'Semences de maïs hybride',
            'description': 'Semences de maïs hybride à haut rendement, adaptées aux zones arides. Résistance à la sécheresse.',
            'prix': 2000,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Semences',
            'region': 'Kaffrine',
            'vendeur': {
                'nom': 'Institut de Recherche Agricole',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-research-institute.jpg',
                'telephone': '+221 33 234 56 78',
                'rating': 4.9
            },
            'date_publication': '2024-01-03',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1701326786998-3688beceadda?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '5 tonnes',
            'localisation': 'Kaffrine'
        },
        {
            'id': 14,
            'titre': 'Chèvres laitières',
            'description': 'Chèvres laitières en bonne santé, production laitière excellente. Vaccinées et bien soignées.',
            'prix': 120000,
            'prix_unite': 'FCFA/pièce',
            'categorie': 'Bétail',
            'region': 'Sédhiou',
            'vendeur': {
                'nom': 'Fatou Bintou Mané',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-farmer-woman.jpg',
                'telephone': '+221 77 234 56 78',
                'rating': 4.8
            },
            'date_publication': '2024-01-02',
            'certification_bio': False,
            'images': ['https://images.unsplash.com/photo-1727113836223-b3ed82929ca3?w=400&h=300&fit=crop&q=80'],
            'quantite_disponible': '8 têtes',
            'localisation': 'Sédhiou'
        },
        {
            'id': 15,
            'titre': 'Oranges Valencia',
            'description': 'Oranges Valencia juteuses et sucrées, récolte de saison. Vitamine C naturelle, parfaites pour la santé.',
            'prix': 500,
            'prix_unite': 'FCFA/kg',
            'categorie': 'Fruits',
            'region': 'Ziguinchor',
            'vendeur': {
                'nom': 'Coopérative des Producteurs de Ziguinchor',
                'photo': 'https://st2.depositphotos.com/1000128/6009/i/450/depositphotos_60099901-stock-photo-cooperative-group.jpg',
                'telephone': '+221 33 345 67 89',
                'rating': 4.9
            },
            'date_publication': '2024-01-01',
            'certification_bio': True,
            'images': ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&h=300&fit=crop'],
            'quantite_disponible': '2 tonnes',
            'localisation': 'Ziguinchor'
        }
    ]
    
    # Filtres disponibles
    categories = ['Toutes', 'Céréales', 'Légumes', 'Fruits', 'Bétail', 'Semences', 'Services']
    regions = ['Toutes', 'Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Diourbel', 'Tambacounda', 'Kolda', 'Matam', 'Kaffrine', 'Fatick', 'Louga', 'Sédhiou']
    
    # Filtrage par paramètres GET
    categorie_filtre = request.GET.get('categorie', 'Toutes')
    region_filtre = request.GET.get('region', 'Toutes')
    prix_min = request.GET.get('prix_min', '')
    prix_max = request.GET.get('prix_max', '')
    bio_filtre = request.GET.get('bio', '')
    recherche = request.GET.get('recherche', '')
    
    # Appliquer les filtres
    annonces_filtrees = annonces.copy()
    
    if categorie_filtre != 'Toutes':
        annonces_filtrees = [a for a in annonces_filtrees if a['categorie'] == categorie_filtre]
    
    if region_filtre != 'Toutes':
        annonces_filtrees = [a for a in annonces_filtrees if a['region'] == region_filtre]
    
    if prix_min:
        try:
            prix_min_val = int(prix_min)
            annonces_filtrees = [a for a in annonces_filtrees if a['prix'] >= prix_min_val]
        except ValueError:
            pass
    
    if prix_max:
        try:
            prix_max_val = int(prix_max)
            annonces_filtrees = [a for a in annonces_filtrees if a['prix'] <= prix_max_val]
        except ValueError:
            pass
    
    if bio_filtre == 'on':
        annonces_filtrees = [a for a in annonces_filtrees if a['certification_bio']]
    
    if recherche:
        recherche_lower = recherche.lower()
        annonces_filtrees = [a for a in annonces_filtrees 
                           if recherche_lower in a['titre'].lower() 
                           or recherche_lower in a['description'].lower()]
    
    context = {
        'title': 'Annonces / Marché Agricole',
        'annonces': annonces_filtrees,
        'categories': categories,
        'regions': regions,
        'filtres_actifs': {
            'categorie': categorie_filtre,
            'region': region_filtre,
            'prix_min': prix_min,
            'prix_max': prix_max,
            'bio': bio_filtre,
            'recherche': recherche
        },
        'nombre_annonces': len(annonces_filtrees)
    }
    
    return render(request, 'agriculture/marketplace/marketplace.html', context)

@login_required
def terrain_agricole_view(request):
    """
    Page Terrain Agricole - Carte interactive des terrains agricoles avec Leaflet.js
    """
    # Données simulées pour les terrains agricoles (15-20 terrains avec coordonnées GPS réelles)
    terrains = [
        {
            'id': 1,
            'titre': 'Parcelle d\'arachide - Keur Moussa',
            'description': 'Terrain de 5 hectares spécialisé dans la culture d\'arachide. Sol fertile, accès à l\'eau par forage. Parfait pour l\'agriculture intensive.',
            'latitude': 14.7886,
            'longitude': -16.9260,
            'region': 'Thiès',
            'departement': 'Thiès',
            'village': 'Keur Moussa',
            'surface': 5.0,
            'type_culture': 'Arachide',
            'disponibilite': 'vente',
            'prix': 2500000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Amadou Diop',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 77 123 45 67',
                'rating': 4.8
            },
            'qualite_sol': 'Excellente',
            'acces_eau': 'Forage + puits',
            'photos': [
                'https://images.unsplash.com/photo-1638432546372-7c6adf2ec9f8?w=400&h=300&fit=crop&q=80',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'
            ],
            'date_publication': '2024-01-15',
            'infrastructure': 'Clôture, hangar de stockage',
            'certification': 'Bio en cours'
        },
        {
            'id': 2,
            'titre': 'Champ de riz irrigué - Podor',
            'description': 'Parcelle de 8 hectares avec système d\'irrigation moderne. Idéale pour la culture du riz. Proche du fleuve Sénégal.',
            'latitude': 16.0179,
            'longitude': -16.4897,
            'region': 'Saint-Louis',
            'departement': 'Podor',
            'village': 'Podor',
            'surface': 8.0,
            'type_culture': 'Riz',
            'disponibilite': 'location',
            'prix': 500000,
            'prix_unite': 'FCFA/an',
            'proprietaire': {
                'nom': 'Fatou Sall',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 78 234 56 78',
                'rating': 4.9
            },
            'qualite_sol': 'Très bonne',
            'acces_eau': 'Fleuve Sénégal + pompe',
            'photos': [
                'https://images.unsplash.com/photo-1714894323778-280ad00919d8?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-14',
            'infrastructure': 'Système d\'irrigation, route d\'accès',
            'certification': 'Conventionnel'
        },
        {
            'id': 3,
            'titre': 'Verger de mangues - Bignona',
            'description': 'Verger de 3 hectares avec 200 manguiers Kent. Production annuelle de 15 tonnes. Terrain en pente douce, bien drainé.',
            'latitude': 12.5833,
            'longitude': -16.2667,
            'region': 'Ziguinchor',
            'departement': 'Bignona',
            'village': 'Bignona',
            'surface': 3.0,
            'type_culture': 'Mangue',
            'disponibilite': 'visite',
            'prix': 0,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Ibrahima Camara',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 76 345 67 89',
                'rating': 4.7
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Puits + réservoir',
            'photos': [
                'https://images.unsplash.com/photo-1759162339512-c2e0f23d4dff?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-13',
            'infrastructure': 'Hangar, système d\'arrosage',
            'certification': 'Bio'
        },
        {
            'id': 4,
            'titre': 'Parcelle maraîchère - Hann',
            'description': 'Terrain de 2 hectares spécialisé dans le maraîchage. Serres modernes, système d\'irrigation goutte-à-goutte. Proche de Dakar.',
            'latitude': 14.7167,
            'longitude': -17.4677,
            'region': 'Dakar',
            'departement': 'Dakar',
            'village': 'Hann',
            'surface': 2.0,
            'type_culture': 'Maraîchage',
            'disponibilite': 'vente',
            'prix': 8000000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Mariama Diouf',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 77 456 78 90',
                'rating': 4.6
            },
            'qualite_sol': 'Excellente',
            'acces_eau': 'Réseau + forage',
            'photos': [
                'https://images.unsplash.com/photo-1677146342889-e229cb60acc8?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-12',
            'infrastructure': 'Serres, système d\'irrigation, hangar',
            'certification': 'Bio'
        },
        {
            'id': 5,
            'titre': 'Champ de mil - Kébémer',
            'description': 'Parcelle de 6 hectares pour la culture du mil. Sol sablo-argileux, adapté aux céréales. Possibilité de rotation avec arachide.',
            'latitude': 15.3500,
            'longitude': -16.4333,
            'region': 'Louga',
            'departement': 'Kébémer',
            'village': 'Kébémer',
            'surface': 6.0,
            'type_culture': 'Mil',
            'disponibilite': 'location',
            'prix': 300000,
            'prix_unite': 'FCFA/an',
            'proprietaire': {
                'nom': 'Modou Faye',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 78 567 89 01',
                'rating': 4.8
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Puits traditionnel',
            'photos': [
                'https://images.unsplash.com/photo-1717942026963-114a7ce1cb26?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-11',
            'infrastructure': 'Clôture basique',
            'certification': 'Conventionnel'
        },
        {
            'id': 6,
            'titre': 'Plantation de tomates - Bambey',
            'description': 'Serre de 1.5 hectares pour la culture de tomates. Système hydroponique, production continue. Marché local garanti.',
            'latitude': 14.1500,
            'longitude': -16.0833,
            'region': 'Diourbel',
            'departement': 'Bambey',
            'village': 'Bambey',
            'surface': 1.5,
            'type_culture': 'Tomate',
            'disponibilite': 'vente',
            'prix': 12000000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Papa Ndiaye',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 76 678 90 12',
                'rating': 4.7
            },
            'qualite_sol': 'Excellente',
            'acces_eau': 'Forage + système hydroponique',
            'photos': [
                'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-10',
            'infrastructure': 'Serre moderne, système hydroponique, hangar',
            'certification': 'Bio'
        },
        {
            'id': 7,
            'titre': 'Champ d\'oignons - Matam',
            'description': 'Parcelle de 4 hectares pour la culture d\'oignons. Sol argileux, excellent drainage. Production de 20 tonnes/an.',
            'latitude': 15.6500,
            'longitude': -13.2500,
            'region': 'Matam',
            'departement': 'Matam',
            'village': 'Matam',
            'surface': 4.0,
            'type_culture': 'Oignon',
            'disponibilite': 'visite',
            'prix': 0,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Aïcha Ba',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 78 789 01 23',
                'rating': 4.5
            },
            'qualite_sol': 'Très bonne',
            'acces_eau': 'Fleuve Sénégal + pompe',
            'photos': [
                'https://images.unsplash.com/photo-1720240462804-6b4216e1ac5e?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-09',
            'infrastructure': 'Hangar de stockage, route d\'accès',
            'certification': 'Conventionnel'
        },
        {
            'id': 8,
            'titre': 'Parcelle de maïs - Kaffrine',
            'description': 'Terrain de 7 hectares pour la culture du maïs. Sol fertile, irrigation par aspersion. Variétés hybrides recommandées.',
            'latitude': 14.0833,
            'longitude': -15.5500,
            'region': 'Kaffrine',
            'departement': 'Kaffrine',
            'village': 'Kaffrine',
            'surface': 7.0,
            'type_culture': 'Maïs',
            'disponibilite': 'location',
            'prix': 400000,
            'prix_unite': 'FCFA/an',
            'proprietaire': {
                'nom': 'Institut de Recherche Agricole',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 33 890 12 34',
                'rating': 4.9
            },
            'qualite_sol': 'Excellente',
            'acces_eau': 'Forage + système d\'aspersion',
            'photos': [
                'https://images.unsplash.com/photo-1701326786998-3688beceadda?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-08',
            'infrastructure': 'Laboratoire, hangar, système d\'irrigation',
            'certification': 'Recherche'
        },
        {
            'id': 9,
            'titre': 'Verger d\'agrumes - Foundiougne',
            'description': 'Verger de 3.5 hectares avec orangers, citronniers et mandariniers. Système d\'irrigation goutte-à-goutte. Production bio.',
            'latitude': 14.1333,
            'longitude': -16.4667,
            'region': 'Fatick',
            'departement': 'Foundiougne',
            'village': 'Foundiougne',
            'surface': 3.5,
            'type_culture': 'Agrumes',
            'disponibilite': 'vente',
            'prix': 6000000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Mariama Diouf',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 77 901 23 45',
                'rating': 4.6
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Forage + système goutte-à-goutte',
            'photos': [
                'https://images.unsplash.com/photo-1755288618719-6cabec04f01d?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-07',
            'infrastructure': 'Hangar, système d\'irrigation, clôture',
            'certification': 'Bio'
        },

        {
            'id': 11,
            'titre': 'Parcelle de pommes de terre - Tambacounda',
            'description': 'Terrain de 2.5 hectares pour la culture de pommes de terre. Sol sablo-argileux, irrigation par aspersion. Variétés précoces.',
            'latitude': 13.7833,
            'longitude': -13.6667,
            'region': 'Tambacounda',
            'departement': 'Tambacounda',
            'village': 'Tambacounda',
            'surface': 2.5,
            'type_culture': 'Pomme de terre',
            'disponibilite': 'visite',
            'prix': 0,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Boubacar Sow',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 77 123 45 67',
                'rating': 4.7
            },
            'qualite_sol': 'Très bonne',
            'acces_eau': 'Forage + système d\'aspersion',
            'photos': [
                'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-05',
            'infrastructure': 'Hangar, système d\'irrigation',
            'certification': 'Conventionnel'
        },
        {
            'id': 12,
            'titre': 'Champ de niébé - Sédhiou',
            'description': 'Parcelle de 4.5 hectares pour la culture du niébé. Sol fertile, rotation avec arachide. Variétés améliorées disponibles.',
            'latitude': 12.7000,
            'longitude': -15.5500,
            'region': 'Sédhiou',
            'departement': 'Sédhiou',
            'village': 'Sédhiou',
            'surface': 4.5,
            'type_culture': 'Niébé',
            'disponibilite': 'vente',
            'prix': 3000000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Fatou Bintou Mané',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 77 234 56 78',
                'rating': 4.8
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Puits + réservoir',
            'photos': [
                'https://images.unsplash.com/photo-1740344109534-926227ad9e79?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-04',
            'infrastructure': 'Hangar, clôture',
            'certification': 'Bio en cours'
        },
        {
            'id': 13,
            'titre': 'Parcelle de pastèque - Kaolack',
            'description': 'Terrain de 3 hectares pour la culture de pastèques. Sol sablonneux, excellent drainage. Irrigation par goutte-à-goutte.',
            'latitude': 14.1500,
            'longitude': -16.0833,
            'region': 'Kaolack',
            'departement': 'Kaolack',
            'village': 'Kaolack',
            'surface': 3.0,
            'type_culture': 'Pastèque',
            'disponibilite': 'location',
            'prix': 350000,
            'prix_unite': 'FCFA/an',
            'proprietaire': {
                'nom': 'Coopérative Agricole du Centre',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 33 345 67 89',
                'rating': 4.9
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Forage + système goutte-à-goutte',
            'photos': [
                'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-03',
            'infrastructure': 'Hangar, système d\'irrigation, route d\'accès',
            'certification': 'Conventionnel'
        },
        {
            'id': 14,
            'titre': 'Verger de bananes - Ziguinchor',
            'description': 'Plantation de 6 hectares avec bananiers Cavendish. Sol fertile, climat favorable. Production de 50 tonnes/an.',
            'latitude': 12.5833,
            'longitude': -16.2667,
            'region': 'Ziguinchor',
            'departement': 'Ziguinchor',
            'village': 'Ziguinchor',
            'surface': 6.0,
            'type_culture': 'Banane',
            'disponibilite': 'visite',
            'prix': 0,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Coopérative des Producteurs de Ziguinchor',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 33 456 78 90',
                'rating': 4.9
            },
            'qualite_sol': 'Excellente',
            'acces_eau': 'Rivière + système d\'irrigation',
            'photos': [
                'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-02',
            'infrastructure': 'Hangar, système d\'irrigation, route d\'accès',
            'certification': 'Bio'
        },
        {
            'id': 15,
            'titre': 'Champ de sorgho - Louga',
            'description': 'Parcelle de 8 hectares pour la culture du sorgho. Sol profond, résistant à la sécheresse. Variétés locales et améliorées.',
            'latitude': 15.3500,
            'longitude': -16.4333,
            'region': 'Louga',
            'departement': 'Louga',
            'village': 'Louga',
            'surface': 8.0,
            'type_culture': 'Sorgho',
            'disponibilite': 'vente',
            'prix': 4000000,
            'prix_unite': 'FCFA',
            'proprietaire': {
                'nom': 'Modou Faye',
                'photo': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                'telephone': '+221 78 567 89 01',
                'rating': 4.8
            },
            'qualite_sol': 'Bonne',
            'acces_eau': 'Puits traditionnel',
            'photos': [
                'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop&q=80'
            ],
            'date_publication': '2024-01-01',
            'infrastructure': 'Hangar, clôture',
            'certification': 'Conventionnel'
        }
    ]
    
    # Filtres disponibles
    regions = ['Toutes', 'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Diourbel', 'Tambacounda', 'Kolda', 'Matam', 'Kaffrine', 'Fatick', 'Louga', 'Sédhiou']
    types_culture = ['Toutes', 'Arachide', 'Riz', 'Mangue', 'Maraîchage', 'Mil', 'Tomate', 'Oignon', 'Maïs', 'Agrumes', 'Manioc', 'Pomme de terre', 'Niébé', 'Pastèque', 'Banane', 'Sorgho']
    disponibilites = ['Toutes', 'vente', 'location', 'visite']
    
    # Filtrage par paramètres GET
    region_filtre = request.GET.get('region', 'Toutes')
    type_culture_filtre = request.GET.get('type_culture', 'Toutes')
    surface_min = request.GET.get('surface_min', '')
    surface_max = request.GET.get('surface_max', '')
    recherche = request.GET.get('recherche', '')
    
    # Appliquer les filtres
    terrains_filtres = terrains.copy()
    
    if region_filtre != 'Toutes':
        terrains_filtres = [t for t in terrains_filtres if t['region'] == region_filtre]
    
    if type_culture_filtre != 'Toutes':
        terrains_filtres = [t for t in terrains_filtres if t['type_culture'] == type_culture_filtre]
    
    if surface_min:
        try:
            surface_min_val = float(surface_min)
            terrains_filtres = [t for t in terrains_filtres if t['surface'] >= surface_min_val]
        except ValueError:
            pass
    
    if surface_max:
        try:
            surface_max_val = float(surface_max)
            terrains_filtres = [t for t in terrains_filtres if t['surface'] <= surface_max_val]
        except ValueError:
            pass
    
    if recherche:
        recherche_lower = recherche.lower()
        terrains_filtres = [t for t in terrains_filtres 
                           if recherche_lower in t['titre'].lower() 
                           or recherche_lower in t['description'].lower()
                           or recherche_lower in t['village'].lower()]
    
    context = {
        'title': 'Terrains Agricoles - Réseau Agricole du Sénégal',
        'terrains': terrains_filtres,
        'regions': regions,
        'types_culture': types_culture,
        'disponibilites': disponibilites,
        'filtres_actifs': {
            'region': region_filtre,
            'type_culture': type_culture_filtre,
            'surface_min': surface_min,
            'surface_max': surface_max,
            'recherche': recherche
        },
        'nombre_terrains': len(terrains_filtres)
    }
    
    return render(request, 'agriculture/terrain/terrain_agricole.html', context)

@login_required
def communaute_view(request):
    """
    Page Communauté Agricole - Espace pour connecter les acteurs agricoles
    """
    user = request.user
    
    # Statistiques de la communauté
    stats = {
        'total_membres': 1247,
        'total_groupes': 45,
        'posts_jour': 89,
        'experts_actifs': 23,
        'cooperatives': 67
    }
    
    # Groupes par région
    groupes_region = [
        {'id': 1, 'nom': 'Dakar', 'membres': 234, 'posts': 456, 'icone': 'fas fa-city', 'actif': True},
        {'id': 2, 'nom': 'Thiès', 'membres': 189, 'posts': 389, 'icone': 'fas fa-seedling', 'actif': True},
        {'id': 3, 'nom': 'Saint-Louis', 'membres': 156, 'posts': 312, 'icone': 'fas fa-water', 'actif': True},
        {'id': 4, 'nom': 'Kaolack', 'membres': 178, 'posts': 345, 'icone': 'fas fa-tractor', 'actif': True},
        {'id': 5, 'nom': 'Ziguinchor', 'membres': 142, 'posts': 278, 'icone': 'fas fa-tree', 'actif': True},
        {'id': 6, 'nom': 'Diourbel', 'membres': 134, 'posts': 267, 'icone': 'fas fa-wheat-awn', 'actif': False},
        {'id': 7, 'nom': 'Tambacounda', 'membres': 98, 'posts': 198, 'icone': 'fas fa-sun', 'actif': False},
    ]
    
    # Groupes par type de culture
    groupes_culture = [
        {'id': 1, 'nom': 'Arachide', 'membres': 456, 'posts': 1234, 'icone': 'fas fa-peanut', 'couleur': '#FFA500'},
        {'id': 2, 'nom': 'Riz', 'membres': 289, 'posts': 678, 'icone': 'fas fa-grain', 'couleur': '#90EE90'},
        {'id': 3, 'nom': 'Maraîchage', 'membres': 312, 'posts': 789, 'icone': 'fas fa-carrot', 'couleur': '#FF6347'},
        {'id': 4, 'nom': 'Mangue', 'membres': 178, 'posts': 456, 'icone': 'fas fa-apple-alt', 'couleur': '#FFD700'},
        {'id': 5, 'nom': 'Tomate', 'membres': 234, 'posts': 567, 'icone': 'fas fa-pepper-hot', 'couleur': '#FF4500'},
        {'id': 6, 'nom': 'Mil', 'membres': 267, 'posts': 645, 'icone': 'fas fa-wheat-awn', 'couleur': '#DAA520'},
    ]
    
    # Membres actifs (agriculteurs, experts, formateurs) avec images
    membres_actifs = [
        {'id': 1, 'nom': 'Amadou Diallo', 'role': 'Agriculteur', 'region': 'Thiès', 'specialite': 'Arachide', 'avatar': 'AD', 'connecte': True, 'note': 4.8, 'posts': 45, 'image': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop', 'membres_groupe': 456},
        {'id': 2, 'nom': 'Fatou Sarr', 'role': 'Expert', 'region': 'Dakar', 'specialite': 'Maraîchage', 'avatar': 'FS', 'connecte': True, 'note': 4.9, 'posts': 67, 'image': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop', 'membres_groupe': 312},
        {'id': 3, 'nom': 'Moussa Ba', 'role': 'Formateur', 'region': 'Kaolack', 'specialite': 'Riz', 'avatar': 'MB', 'connecte': False, 'note': 4.7, 'posts': 89, 'image': 'https://images.unsplash.com/photo-1604644401890-0bd678b8372c?w=400&h=300&fit=crop', 'membres_groupe': 289},
        {'id': 4, 'nom': 'Aissatou Diop', 'role': 'Agriculteur', 'region': 'Saint-Louis', 'specialite': 'Tomate', 'avatar': 'AD', 'connecte': True, 'note': 4.6, 'posts': 34, 'image': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop', 'membres_groupe': 234},
        {'id': 5, 'nom': 'Ibrahima Ndiaye', 'role': 'Expert', 'region': 'Ziguinchor', 'specialite': 'Mangue', 'avatar': 'IN', 'connecte': True, 'note': 5.0, 'posts': 123, 'image': 'https://images.unsplash.com/photo-1546468492-7212d63a302a?w=400&h=300&fit=crop', 'membres_groupe': 178},
        {'id': 6, 'nom': 'Khady Fall', 'role': 'Agriculteur', 'region': 'Thiès', 'specialite': 'Mil', 'avatar': 'KF', 'connecte': False, 'note': 4.5, 'posts': 28, 'image': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop', 'membres_groupe': 267},
        {'id': 7, 'nom': 'Ousmane Sy', 'role': 'Formateur', 'region': 'Dakar', 'specialite': 'Agriculture Bio', 'avatar': 'OS', 'connecte': True, 'note': 4.8, 'posts': 56, 'image': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop', 'membres_groupe': 189},
        {'id': 8, 'nom': 'Mariama Seck', 'role': 'Agriculteur', 'region': 'Kaolack', 'specialite': 'Arachide', 'avatar': 'MS', 'connecte': True, 'note': 4.7, 'posts': 39, 'image': 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=400&h=300&fit=crop', 'membres_groupe': 456},
    ]
    
    # Coopératives agricoles
    cooperatives = [
        {'id': 1, 'nom': 'Coopérative Arachide Thiès', 'region': 'Thiès', 'membres': 145, 'fondee': '2018', 'activite': 'Production & Vente'},
        {'id': 2, 'nom': 'Union Maraîchers Dakar', 'region': 'Dakar', 'membres': 89, 'fondee': '2020', 'activite': 'Maraîchage'},
        {'id': 3, 'nom': 'Coopérative Rizicole Podor', 'region': 'Saint-Louis', 'membres': 234, 'fondee': '2015', 'activite': 'Riziculture'},
        {'id': 4, 'nom': 'GIE Fruits Casamance', 'region': 'Ziguinchor', 'membres': 167, 'fondee': '2019', 'activite': 'Fruits'},
        {'id': 5, 'nom': 'Coopérative Bio Sénégalaise', 'region': 'Kaolack', 'membres': 112, 'fondee': '2021', 'activite': 'Agriculture Bio'},
    ]
    
    # Experts disponibles
    experts = [
        {'id': 1, 'nom': 'Dr. Cheikh Ndiaye', 'specialite': 'Agronomie', 'region': 'Dakar', 'disponibilite': 'Disponible', 'consults': 234, 'note': 4.9},
        {'id': 2, 'nom': 'Mme. Fatou Dieng', 'specialite': 'Gestion des sols', 'region': 'Thiès', 'disponibilite': 'Disponible', 'consults': 189, 'note': 4.8},
        {'id': 3, 'nom': 'Ing. Mamadou Fall', 'specialite': 'Irrigation', 'region': 'Saint-Louis', 'disponibilite': 'Occupé', 'consults': 312, 'note': 5.0},
        {'id': 4, 'nom': 'Dr. Awa Mbaye', 'specialite': 'Phytopathologie', 'region': 'Kaolack', 'disponibilite': 'Disponible', 'consults': 267, 'note': 4.7},
        {'id': 5, 'nom': 'Ing. Ibrahima Sow', 'specialite': 'Machinisme agricole', 'region': 'Ziguinchor', 'disponibilite': 'Disponible', 'consults': 145, 'note': 4.6},
    ]
    
    # Événements communautaires à venir
    evenements = [
        {'id': 1, 'titre': 'Foire Agricole de Dakar', 'date': '15 Nov 2024', 'lieu': 'Dakar', 'type': 'Foire', 'participants': 567},
        {'id': 2, 'titre': 'Formation Irrigation Moderne', 'date': '20 Nov 2024', 'lieu': 'Thiès', 'type': 'Formation', 'participants': 89},
        {'id': 3, 'titre': 'Rencontre Riziculteurs Podor', 'date': '25 Nov 2024', 'lieu': 'Podor', 'type': 'Rencontre', 'participants': 134},
        {'id': 4, 'titre': 'Webinaire Agriculture Bio', 'date': '28 Nov 2024', 'lieu': 'En ligne', 'type': 'Webinaire', 'participants': 234},
    ]
    
    # Groupes recommandés pour l'utilisateur (basé sur son profil)
    groupes_recommandes = [
        {'id': 1, 'nom': 'Votre région : ' + (getattr(user, 'region', 'Dakar') or 'Dakar'), 'membres': 234, 'raison': 'Basé sur votre localisation'},
        {'id': 2, 'nom': 'Agriculteurs Confirmés', 'membres': 456, 'raison': 'Selon votre expérience'},
        {'id': 3, 'nom': 'Échanges Techniques', 'membres': 567, 'raison': 'Vous pourriez être intéressé'},
    ]
    
    # Filtres actifs
    region_filtre = request.GET.get('region', '')
    role_filtre = request.GET.get('role', '')
    specialite_filtre = request.GET.get('specialite', '')
    recherche = request.GET.get('recherche', '')
    
    # Appliquer les filtres aux membres
    membres_filtres = membres_actifs.copy()
    if region_filtre:
        membres_filtres = [m for m in membres_filtres if m['region'] == region_filtre]
    if role_filtre:
        membres_filtres = [m for m in membres_filtres if m['role'] == role_filtre]
    if specialite_filtre:
        membres_filtres = [m for m in membres_filtres if specialite_filtre.lower() in m['specialite'].lower()]
    if recherche:
        recherche_lower = recherche.lower()
        membres_filtres = [m for m in membres_filtres 
                           if recherche_lower in m['nom'].lower() 
                           or recherche_lower in m['specialite'].lower()]
    
    regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Diourbel', 'Tambacounda', 'Kolda']
    roles = ['Agriculteur', 'Expert', 'Formateur', 'Investisseur']
    specialites = ['Arachide', 'Riz', 'Maraîchage', 'Mangue', 'Tomate', 'Mil', 'Agriculture Bio']
    
    context = {
        'title': 'Communauté Agricole - Réseau Agricole du Sénégal',
        'user': user,
        'groupes_region': groupes_region,
        'membres_actifs': membres_filtres,
        'experts': experts,
        'evenements': evenements,
        'groupes_recommandes': groupes_recommandes,
        'regions': regions,
        'roles': roles,
        'specialites': specialites,
        'filtres_actifs': {
            'region': region_filtre,
            'role': role_filtre,
            'specialite': specialite_filtre,
            'recherche': recherche
        },
        'nombre_membres': len(membres_filtres)
    }
    
    return render(request, 'agriculture/communaute/communaute.html', context)
