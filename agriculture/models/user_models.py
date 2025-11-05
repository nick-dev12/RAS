from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.gis.db import models as gis_models
from django.core.validators import RegexValidator

class User(AbstractUser):
    """
    Modèle utilisateur personnalisé pour le Réseau Agricole du Sénégal
    """
    
    # Types d'utilisateurs
    USER_TYPE_CHOICES = [
        ('agriculteur', 'Agriculteur'),
        ('formateur', 'Formateur'),
        ('expert', 'Expert'),
        ('investisseur', 'Investisseur'),
        ('admin', 'Administrateur'),
    ]
    
    # Statuts de validation
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    # Champs personnalisés
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='agriculteur',
        verbose_name="Type d'utilisateur"
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?221\d{9}$',
        message="Le numéro de téléphone doit être au format: '+221XXXXXXXXX'. 9 chiffres après +221."
    )
    phone_number = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        verbose_name="Numéro de téléphone"
    )
    
    # Localisation
    location = gis_models.PointField(
        null=True,
        blank=True,
        verbose_name="Localisation GPS"
    )
    region = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Région"
    )
    department = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Département"
    )
    village = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Village/Commune"
    )
    
    # Informations agricoles
    farm_size = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Taille de la ferme (hectares)"
    )
    main_crops = models.TextField(
        blank=True,
        verbose_name="Cultures principales"
    )
    farming_experience = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Années d'expérience agricole"
    )
    
    # Statut et validation
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Statut de validation"
    )
    bio = models.TextField(
        blank=True,
        verbose_name="Biographie"
    )
    profile_picture = models.ImageField(
        upload_to='profiles/',
        null=True,
        blank=True,
        verbose_name="Photo de profil"
    )
    
    # Informations de contact
    website = models.URLField(
        blank=True,
        verbose_name="Site web"
    )
    facebook = models.URLField(
        blank=True,
        verbose_name="Facebook"
    )
    twitter = models.URLField(
        blank=True,
        verbose_name="Twitter"
    )
    
    # Préférences
    language_preference = models.CharField(
        max_length=10,
        choices=[
            ('fr', 'Français'),
            ('wo', 'Wolof'),
            ('ar', 'Arabe'),
        ],
        default='fr',
        verbose_name="Langue préférée"
    )
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_user_type_display()})"
    
    def get_full_name(self):
        """Retourne le nom complet de l'utilisateur"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def get_user_type_display(self):
        """Retourne le type d'utilisateur formaté"""
        return dict(self.USER_TYPE_CHOICES).get(self.user_type, self.user_type)
    
    def is_approved(self):
        """Vérifie si l'utilisateur est approuvé"""
        return self.status == 'approved'
    
    def get_location_display(self):
        """Retourne la localisation formatée"""
        location_parts = [self.village, self.department, self.region]
        return ', '.join([part for part in location_parts if part])
