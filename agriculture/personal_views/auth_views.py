from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password, check_password
from ..models import User

def register_view(request):
    """
    Vue pour l'inscription des utilisateurs
    """
    if request.user.is_authenticated:
        return redirect('newsfeed')
    
    if request.method == 'POST':
        # Récupérer les données du formulaire
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        phone_number = request.POST.get('phone_number', '').strip()
        user_type = request.POST.get('user_type', 'agriculteur')
        village = request.POST.get('village', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')
        
        # Validation des données
        errors = []
        
        if not first_name:
            errors.append('Le prénom est requis.')
        if not last_name:
            errors.append('Le nom de famille est requis.')
        if not username:
            errors.append('Le nom d\'utilisateur est requis.')
        elif User.objects.filter(username=username).exists():
            errors.append('Ce nom d\'utilisateur est déjà utilisé.')
        if not email:
            errors.append('L\'adresse email est requise.')
        elif User.objects.filter(email=email).exists():
            errors.append('Cette adresse email est déjà utilisée.')
        if not phone_number:
            errors.append('Le numéro de téléphone est requis.')
        elif User.objects.filter(phone_number=phone_number).exists():
            errors.append('Ce numéro de téléphone est déjà utilisé.')
        if not village:
            errors.append('Le village/commune est requis.')
        if not password1:
            errors.append('Le mot de passe est requis.')
        elif len(password1) < 8:
            errors.append('Le mot de passe doit contenir au moins 8 caractères.')
        if password1 != password2:
            errors.append('Les mots de passe ne correspondent pas.')
        
        if not errors:
            # Créer l'utilisateur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                user_type=user_type,
                village=village
            )
            
            messages.success(
                request, 
                f'Inscription réussie ! Bienvenue {user.get_full_name()}. '
                'Votre compte est en attente de validation par nos administrateurs.'
            )
            
            # Connexion automatique après inscription
            login(request, user)
            return redirect('newsfeed')
        else:
            for error in errors:
                messages.error(request, error)
    
    context = {
        'title': 'Inscription - Réseau Agricole du Sénégal'
    }
    return render(request, 'agriculture/auth/register.html', context)

def login_view(request):
    """
    Vue pour la connexion des utilisateurs
    """
    if request.user.is_authenticated:
        return redirect('newsfeed')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '')
        
        if not username or not password:
            messages.error(request, 'Veuillez remplir tous les champs.')
        else:
            # Essayer de se connecter avec le nom d'utilisateur ou l'email
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                if user.is_active:
                    login(request, user)
                    messages.success(request, f'Bienvenue {user.get_full_name()} !')
                    
                    # Redirection vers la page demandée ou le fil d'actualités
                    next_url = request.GET.get('next', 'newsfeed')
                    return redirect(next_url)
                else:
                    messages.error(request, 'Votre compte est désactivé.')
            else:
                messages.error(request, 'Nom d\'utilisateur/email ou mot de passe incorrect.')
    
    context = {
        'title': 'Connexion - Réseau Agricole du Sénégal'
    }
    return render(request, 'agriculture/auth/login.html', context)

@login_required
def logout_view(request):
    """
    Vue pour la déconnexion des utilisateurs
    """
    logout(request)
    messages.success(request, 'Vous avez été déconnecté avec succès.')
    return redirect('home')

@login_required
def profile_view(request):
    """
    Vue pour afficher et modifier le profil utilisateur
    """
    if request.method == 'POST':
        # Récupérer les données du formulaire
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email = request.POST.get('email', '').strip()
        phone_number = request.POST.get('phone_number', '').strip()
        village = request.POST.get('village', '').strip()
        bio = request.POST.get('bio', '').strip()
        
        # Validation des données
        errors = []
        
        if not first_name:
            errors.append('Le prénom est requis.')
        if not last_name:
            errors.append('Le nom de famille est requis.')
        if not email:
            errors.append('L\'adresse email est requise.')
        elif User.objects.filter(email=email).exclude(id=request.user.id).exists():
            errors.append('Cette adresse email est déjà utilisée.')
        if not phone_number:
            errors.append('Le numéro de téléphone est requis.')
        elif User.objects.filter(phone_number=phone_number).exclude(id=request.user.id).exists():
            errors.append('Ce numéro de téléphone est déjà utilisé.')
        if not village:
            errors.append('Le village/commune est requis.')
        
        if not errors:
            # Mettre à jour l'utilisateur
            request.user.first_name = first_name
            request.user.last_name = last_name
            request.user.email = email
            request.user.phone_number = phone_number
            request.user.village = village
            request.user.bio = bio
            request.user.save()
            
            messages.success(request, 'Votre profil a été mis à jour avec succès.')
            return redirect('profile')
        else:
            for error in errors:
                messages.error(request, error)
    
    context = {
        'user': request.user,
        'title': 'Mon Profil - Réseau Agricole du Sénégal'
    }
    return render(request, 'agriculture/auth/profile.html', context)

def check_username(request):
    """
    Vérification AJAX de la disponibilité du nom d'utilisateur
    """
    if request.method == 'GET':
        username = request.GET.get('username')
        if username:
            exists = User.objects.filter(username=username).exists()
            return JsonResponse({'available': not exists})
    return JsonResponse({'available': False})

def check_email(request):
    """
    Vérification AJAX de la disponibilité de l'email
    """
    if request.method == 'GET':
        email = request.GET.get('email')
        if email:
            exists = User.objects.filter(email=email).exists()
            return JsonResponse({'available': not exists})
    return JsonResponse({'available': False})

def check_phone(request):
    """
    Vérification AJAX de la disponibilité du numéro de téléphone
    """
    if request.method == 'GET':
        phone = request.GET.get('phone')
        if phone:
            exists = User.objects.filter(phone_number=phone).exists()
            return JsonResponse({'available': not exists})
    return JsonResponse({'available': False})
