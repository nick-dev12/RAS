from django.db import models
from django.contrib.gis.db import models as gis_models
from .user_models import User


class Parcelle(models.Model):
    STATUT_CHOICES = [
        ('en_culture', 'En culture'),
        ('en_jachere', 'En jachère'),
        ('a_vendre', 'À vendre'),
        ('a_louer', 'À louer'),
        ('en_preparation', 'En préparation'),
    ]
    
    agriculteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parcelles')
    nom = models.CharField(max_length=200, verbose_name="Nom de la parcelle")
    superficie = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Superficie (hectares)"
    )
    location = gis_models.PointField(
        null=True, 
        blank=True, 
        verbose_name="Localisation GPS"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_jachere',
        verbose_name="Statut"
    )
    description = models.TextField(blank=True, verbose_name="Description")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Parcelle"
        verbose_name_plural = "Parcelles"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nom} ({self.superficie} ha) - {self.agriculteur.get_full_name()}"


class Culture(models.Model):
    ETAT_CHOICES = [
        ('semis', 'Semis'),
        ('levee', 'Levée'),
        ('croissance', 'Croissance'),
        ('floraison', 'Floraison'),
        ('fructification', 'Fructification'),
        ('maturation', 'Maturation'),
        ('recolte', 'Récolte'),
        ('terminee', 'Terminée'),
    ]
    
    parcelle = models.ForeignKey(Parcelle, on_delete=models.CASCADE, related_name='cultures')
    nom_culture = models.CharField(max_length=100, verbose_name="Nom de la culture")
    date_semis = models.DateField(verbose_name="Date de semis")
    superficie = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Superficie cultivée (hectares)"
    )
    etat = models.CharField(
        max_length=20,
        choices=ETAT_CHOICES,
        default='semis',
        verbose_name="État actuel"
    )
    prochaine_action = models.CharField(
        max_length=200, 
        blank=True, 
        verbose_name="Prochaine action"
    )
    rendement_attendu = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name="Rendement attendu (kg/ha)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Culture"
        verbose_name_plural = "Cultures"
        ordering = ['-date_semis']
    
    def __str__(self):
        return f"{self.nom_culture} - {self.parcelle.nom} ({self.etat})"
