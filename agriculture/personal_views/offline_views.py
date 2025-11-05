"""
Vue pour la page offline de la PWA
"""
from django.shortcuts import render


def offline_view(request):
    """
    Vue pour afficher la page offline
    """
    return render(request, 'agriculture/offline.html')
