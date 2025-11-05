from django.urls import path
from agriculture.personal_views.auth_views import (
    register_view, 
    login_view, 
    logout_view, 
    profile_view,
    check_username,
    check_email,
    check_phone
)

urlpatterns = [
    # Pages d'authentification
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', profile_view, name='profile'),
    
    # Vérifications AJAX
    path('api/check-username/', check_username, name='check_username'),
    path('api/check-email/', check_email, name='check_email'),
    path('api/check-phone/', check_phone, name='check_phone'),
]
