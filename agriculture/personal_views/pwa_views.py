"""
Vues pour la Progressive Web App (PWA)
"""
from django.http import JsonResponse, HttpResponse
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET
from django.conf import settings
import json
import os


@require_GET
@cache_control(max_age=3600, public=True)
def manifest_view(request):
    """
    Vue pour servir le manifest.json de la PWA
    """
    manifest_path = os.path.join(settings.BASE_DIR, 'agriculture', 'static', 'manifest.json')
    
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_data = json.load(f)
        
        # Ajouter des informations dynamiques si nécessaire
        manifest_data['start_url'] = '/'
        manifest_data['scope'] = '/'
        
        response = JsonResponse(manifest_data, json_dumps_params={'ensure_ascii': False, 'indent': 2})
        response['Content-Type'] = 'application/manifest+json'
        return response
    except FileNotFoundError:
        return JsonResponse({'error': 'Manifest file not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid manifest file'}, status=500)


@require_GET
@cache_control(max_age=3600, public=True)
def service_worker_view(request):
    """
    Vue pour servir le service worker JavaScript
    """
    sw_path = os.path.join(settings.BASE_DIR, 'agriculture', 'static', 'js', 'service-worker.js')
    
    try:
        with open(sw_path, 'r', encoding='utf-8') as f:
            sw_content = f.read()
        
        response = HttpResponse(sw_content, content_type='application/javascript')
        response['Service-Worker-Allowed'] = '/'
        return response
    except FileNotFoundError:
        return HttpResponse('// Service Worker not found', status=404, content_type='application/javascript')
