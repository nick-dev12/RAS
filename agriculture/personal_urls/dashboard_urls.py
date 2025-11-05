from django.urls import path
from agriculture.personal_views.dashboard_views import (
    agriculteur_dashboard,
    formateur_dashboard,
    expert_dashboard,
    investisseur_dashboard,
    dashboard_router,
    newsfeed_view,
    marketplace_view,
    terrain_agricole_view,
    communaute_view
)
from agriculture.personal_views.videos_views import videos_view

urlpatterns = [
    # Routeur principal pour rediriger vers le bon tableau de bord
    path('dashboard/', dashboard_router, name='dashboard'),
    
    # Tableaux de bord spécifiques par type d'utilisateur
    path('dashboard/agriculteur/', agriculteur_dashboard, name='agriculteur_dashboard'),
    path('dashboard/formateur/', formateur_dashboard, name='formateur_dashboard'),
    path('dashboard/expert/', expert_dashboard, name='expert_dashboard'),
    path('dashboard/investisseur/', investisseur_dashboard, name='investisseur_dashboard'),
    
    # Fil d'actualités agricole
    path('newsfeed/', newsfeed_view, name='newsfeed'),
    
    # Marketplace / Annonces
    path('marketplace/', marketplace_view, name='marketplace'),
    
    # Terrains Agricoles
    path('terrain-agricole/', terrain_agricole_view, name='terrain_agricole'),
    
    # Communauté Agricole
    path('communaute/', communaute_view, name='communaute'),
    
    # Vidéos Agricoles (format vertical TikTok)
    path('videos/', videos_view, name='videos')
]
