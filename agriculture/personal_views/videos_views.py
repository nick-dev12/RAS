from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def videos_view(request):
    """
    Page Vidéos - Format vertical type TikTok
    Affichage de vidéos agricoles en format portrait
    """
    user = request.user
    
    # Données simulées de vidéos agricoles
    videos = [
        {
            'id': 1,
            'titre': 'Techniques de semis du mil',
            'description': 'Découvrez les meilleures pratiques pour semer le mil au Sénégal',
            'auteur': {
                'nom': 'Amadou Diallo',
                'avatar': 'AD',
                'specialite': 'Expert en céréales'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            'likes': 1250,
            'commentaires': 89,
            'partages': 45,
            'is_liked': False,
            'vue': 12500
        },
        {
            'id': 2,
            'titre': 'Récolte de l\'arachide dans la région de Thiès',
            'description': 'Regardez comment nous récoltons nos arachides avec des techniques modernes',
            'auteur': {
                'nom': 'Fatou Sarr',
                'avatar': 'FS',
                'specialite': 'Agricultrice'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
            'likes': 3450,
            'commentaires': 234,
            'partages': 120,
            'is_liked': True,
            'vue': 45600
        },
        {
            'id': 3,
            'titre': 'Installation d\'un système d\'irrigation goutte à goutte',
            'description': 'Tutoriel complet pour installer un système d\'irrigation efficace',
            'auteur': {
                'nom': 'Moussa Fall',
                'avatar': 'MF',
                'specialite': 'Ingénieur agricole'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            'likes': 2890,
            'commentaires': 156,
            'partages': 78,
            'is_liked': False,
            'vue': 34200
        },
        {
            'id': 4,
            'titre': 'Marché agricole de Dakar - Prix du jour',
            'description': 'Les prix des produits agricoles au marché central de Dakar',
            'auteur': {
                'nom': 'Mariama Ba',
                'avatar': 'MB',
                'specialite': 'Commerçante'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
            'likes': 1560,
            'commentaires': 67,
            'partages': 34,
            'is_liked': False,
            'vue': 18900
        },
        {
            'id': 5,
            'titre': 'Formation sur la gestion des sols',
            'description': 'Comment analyser et améliorer la qualité de votre sol',
            'auteur': {
                'nom': 'Dr. Ousmane Ndiaye',
                'avatar': 'ON',
                'specialite': 'Agronome'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
            'likes': 4320,
            'commentaires': 289,
            'partages': 156,
            'is_liked': True,
            'vue': 67800
        },
        {
            'id': 6,
            'titre': 'Visite d\'une coopérative agricole à Kaolack',
            'description': 'Découvrez le fonctionnement d\'une coopérative réussie',
            'auteur': {
                'nom': 'Ibrahima Diop',
                'avatar': 'ID',
                'specialite': 'Coopérative'
            },
            'video_url': 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4',
            'thumbnail': 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
            'likes': 2890,
            'commentaires': 178,
            'partages': 92,
            'is_liked': False,
            'vue': 42300
        }
    ]
    
    context = {
        'title': 'Vidéos Agricoles',
        'user': user,
        'videos': videos
    }
    
    return render(request, 'agriculture/videos/videos.html', context)

