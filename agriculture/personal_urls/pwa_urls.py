"""
URLs pour la Progressive Web App (PWA)
"""
from django.urls import path
from agriculture.personal_views.pwa_views import manifest_view, service_worker_view
from agriculture.personal_views.offline_views import offline_view

urlpatterns = [
    path('manifest.json', manifest_view, name='manifest'),
    path('service-worker.js', service_worker_view, name='service_worker'),
    path('offline.html', offline_view, name='offline'),
]
