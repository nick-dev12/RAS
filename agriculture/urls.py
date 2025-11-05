from django.urls import path, include

urlpatterns = [
    path('', include('agriculture.personal_urls.home_urls')),
    path('', include('agriculture.personal_urls.auth_urls')),
    path('', include('agriculture.personal_urls.dashboard_urls')),
    path('formations/', include('agriculture.personal_urls.formation_urls')),
    path('', include('agriculture.personal_urls.pwa_urls')),  # URLs PWA
]
