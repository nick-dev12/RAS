from django.shortcuts import render

def home_view(request):
    """Vue pour la page d'accueil / landing page"""
    context = {
        'page_title': 'Réseau Agricole du Sénégal',
        'meta_description': 'Plateforme numérique pour connecter, former et accompagner les acteurs agricoles au Sénégal'
    }
    return render(request, 'agriculture/home.html', context)
