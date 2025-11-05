from django.db import models
from .user_models import User


class Projet(models.Model):
    STATUT_CHOICES = [
        ('en_preparation', 'En préparation'),
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('suspendu', 'Suspendu'),
        ('annule', 'Annulé'),
    ]
    
    TYPE_CHOICES = [
        ('cooperatif', 'Coopératif'),
        ('communautaire', 'Communautaire'),
        ('recherche', 'Recherche'),
        ('formation', 'Formation'),
        ('commercial', 'Commercial'),
        ('infrastructure', 'Infrastructure'),
    ]
    
    nom = models.CharField(max_length=200, verbose_name="Nom du projet")
    description = models.TextField(verbose_name="Description")
    type_projet = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='cooperatif',
        verbose_name="Type de projet"
    )
    createur = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='projets_crees',
        verbose_name="Créateur"
    )
    etape_actuelle = models.IntegerField(default=1, verbose_name="Étape actuelle")
    etapes_totales = models.IntegerField(default=5, verbose_name="Nombre total d'étapes")
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_preparation',
        verbose_name="Statut"
    )
    budget_estime = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name="Budget estimé (FCFA)"
    )
    date_debut = models.DateField(null=True, blank=True, verbose_name="Date de début")
    date_fin_prevue = models.DateField(null=True, blank=True, verbose_name="Date de fin prévue")
    date_fin_reelle = models.DateField(null=True, blank=True, verbose_name="Date de fin réelle")
    region = models.CharField(max_length=100, blank=True, verbose_name="Région")
    is_public = models.BooleanField(default=True, verbose_name="Projet public")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nom} - {self.createur.get_full_name()}"
    
    @property
    def progression_pourcentage(self):
        """Calcule le pourcentage de progression du projet"""
        if self.etapes_totales > 0:
            return (self.etape_actuelle / self.etapes_totales) * 100
        return 0


class ParticipationProjet(models.Model):
    ROLE_CHOICES = [
        ('participant', 'Participant'),
        ('coordinateur', 'Coordinateur'),
        ('expert', 'Expert'),
        ('observateur', 'Observateur'),
        ('financeur', 'Financeur'),
    ]
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('acceptee', 'Acceptée'),
        ('refusee', 'Refusée'),
        ('active', 'Active'),
        ('terminee', 'Terminée'),
        ('exclue', 'Exclue'),
    ]
    
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='participations')
    participant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='participations_projet')
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='participant',
        verbose_name="Rôle"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente',
        verbose_name="Statut"
    )
    contribution = models.TextField(blank=True, verbose_name="Contribution")
    montant_contribution = models.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name="Montant de contribution (FCFA)"
    )
    date_invitation = models.DateTimeField(auto_now_add=True, verbose_name="Date d'invitation")
    date_acceptation = models.DateTimeField(null=True, blank=True, verbose_name="Date d'acceptation")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        verbose_name = "Participation à un projet"
        verbose_name_plural = "Participations aux projets"
        unique_together = ['projet', 'participant']
        ordering = ['-date_invitation']
    
    def __str__(self):
        return f"{self.participant.get_full_name()} - {self.projet.nom} ({self.role})"


class EtapeProjet(models.Model):
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='etapes')
    numero = models.IntegerField(verbose_name="Numéro d'étape")
    titre = models.CharField(max_length=200, verbose_name="Titre de l'étape")
    description = models.TextField(verbose_name="Description")
    date_debut_prevue = models.DateField(verbose_name="Date de début prévue")
    date_fin_prevue = models.DateField(verbose_name="Date de fin prévue")
    date_debut_reelle = models.DateField(null=True, blank=True, verbose_name="Date de début réelle")
    date_fin_reelle = models.DateField(null=True, blank=True, verbose_name="Date de fin réelle")
    is_terminee = models.BooleanField(default=False, verbose_name="Étape terminée")
    responsable = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='etapes_responsable',
        verbose_name="Responsable"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Étape de projet"
        verbose_name_plural = "Étapes de projet"
        unique_together = ['projet', 'numero']
        ordering = ['numero']
    
    def __str__(self):
        return f"{self.projet.nom} - Étape {self.numero}: {self.titre}"
