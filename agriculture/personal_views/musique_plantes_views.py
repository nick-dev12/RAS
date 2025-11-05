"""
Vue pour la page Musique pour les plantes
"""
from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def musique_plantes_view(request):
    """
    Vue pour afficher les produits audio pour les plantes
    """
    # Données simulées pour les produits audio
    produits_audio = [
        {
            'id': 1,
            'titre': 'Sons de la Nature - Forêt Tropicale',
            'description': 'Enregistrement authentique des sons de la forêt tropicale. Aide à la croissance et au bien-être des plantes.',
            'duree': '60:00',
            'format': 'MP3',
            'categorie': 'Nature',
            'prix': 0,
            'gratuit': True,
            'image': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'auteur': 'Nature Sounds Studio',
            'rating': 4.8,
            'ecoutes': 1250,
            'tags': ['relaxation', 'nature', 'croissance']
        },
        {
            'id': 2,
            'titre': 'Fréquences de Croissance - 432 Hz',
            'description': 'Musique spécialement composée à la fréquence 432 Hz pour stimuler la croissance des plantes. Scientifiquement prouvé.',
            'duree': '45:00',
            'format': 'MP3',
            'categorie': 'Scientifique',
            'prix': 500,
            'gratuit': False,
            'prix_unite': 'FCFA',
            'image': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            'auteur': 'Dr. Amadou Diallo',
            'rating': 4.9,
            'ecoutes': 890,
            'tags': ['scientifique', 'croissance', 'fréquence']
        },
        {
            'id': 3,
            'titre': 'Pluie Douce - Sons de Pluie',
            'description': 'Enregistrement de pluie douce pour créer un environnement naturel. Idéal pour les plantes d\'intérieur.',
            'duree': '90:00',
            'format': 'MP3',
            'categorie': 'Nature',
            'prix': 0,
            'gratuit': True,
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
            'auteur': 'Rain Sounds Co.',
            'rating': 4.7,
            'ecoutes': 2100,
            'tags': ['pluie', 'nature', 'relaxation']
        },
        {
            'id': 4,
            'titre': 'Mélodies Classiques pour Jardin',
            'description': 'Sélection de mélodies classiques adaptées pour stimuler la croissance des plantes de jardin.',
            'duree': '120:00',
            'format': 'MP3',
            'categorie': 'Classique',
            'prix': 800,
            'gratuit': False,
            'prix_unite': 'FCFA',
            'image': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
            'auteur': 'Classical Garden Music',
            'rating': 4.6,
            'ecoutes': 560,
            'tags': ['classique', 'jardin', 'mélodie']
        },
        {
            'id': 5,
            'titre': 'Vibrations Foliaires - Sons de Croissance',
            'description': 'Fréquences binaurales spécialement conçues pour stimuler la photosynthèse et la croissance foliaire.',
            'duree': '30:00',
            'format': 'MP3',
            'categorie': 'Scientifique',
            'prix': 1000,
            'gratuit': False,
            'prix_unite': 'FCFA',
            'image': 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
            'auteur': 'BioAcoustic Research',
            'rating': 4.9,
            'ecoutes': 750,
            'tags': ['scientifique', 'croissance', 'photosynthèse']
        },
        {
            'id': 6,
            'titre': 'Chants d\'Oiseaux du Sénégal',
            'description': 'Enregistrement authentique des chants d\'oiseaux du Sénégal. Crée un environnement naturel pour vos plantes.',
            'duree': '75:00',
            'format': 'MP3',
            'categorie': 'Nature',
            'prix': 0,
            'gratuit': True,
            'image': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
            'auteur': 'Wildlife Senegal',
            'rating': 4.8,
            'ecoutes': 1450,
            'tags': ['oiseaux', 'nature', 'sénégal']
        },
        {
            'id': 7,
            'titre': 'Méditation Végétale - 528 Hz',
            'description': 'Fréquence de guérison 528 Hz pour le bien-être des plantes. Aide à la récupération et la régénération.',
            'duree': '60:00',
            'format': 'MP3',
            'categorie': 'Thérapeutique',
            'prix': 600,
            'gratuit': False,
            'prix_unite': 'FCFA',
            'image': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
            'auteur': 'Healing Frequencies',
            'rating': 4.7,
            'ecoutes': 920,
            'tags': ['thérapeutique', 'guérison', 'méditation']
        },
        {
            'id': 8,
            'titre': 'Vent dans les Feuilles',
            'description': 'Son apaisant du vent dans les feuilles. Crée une ambiance naturelle relaxante pour vos plantes.',
            'duree': '90:00',
            'format': 'MP3',
            'categorie': 'Nature',
            'prix': 0,
            'gratuit': True,
            'image': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
            'audio_url': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
            'auteur': 'Wind Sounds',
            'rating': 4.5,
            'ecoutes': 1100,
            'tags': ['vent', 'nature', 'relaxation']
        },
    ]
    
    # Catégories disponibles
    categories = ['Toutes', 'Nature', 'Scientifique', 'Classique', 'Thérapeutique']
    
    # Filtrage par catégorie
    categorie_filtre = request.GET.get('categorie', 'Toutes')
    if categorie_filtre != 'Toutes':
        produits_audio = [p for p in produits_audio if p['categorie'] == categorie_filtre]
    
    # Recherche
    recherche = request.GET.get('recherche', '')
    if recherche:
        recherche_lower = recherche.lower()
        produits_audio = [p for p in produits_audio 
                         if recherche_lower in p['titre'].lower() 
                         or recherche_lower in p['description'].lower()]
    
    context = {
        'title': 'Musique pour les Plantes - Réseau Agricole du Sénégal',
        'produits_audio': produits_audio,
        'categories': categories,
        'categorie_active': categorie_filtre,
        'nombre_produits': len(produits_audio),
        'recherche': recherche,
    }
    
    return render(request, 'agriculture/musique_plantes/musique_plantes.html', context)
