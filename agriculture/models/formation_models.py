from django.db import models
from .user_models import User


class Formation(models.Model):
    NIVEAU_CHOICES = [
        ('debutant', 'Débutant'),
        ('intermediaire', 'Intermédiaire'),
        ('avance', 'Avancé'),
        ('expert', 'Expert'),
    ]
    
    CATEGORIE_CHOICES = [
        ('technique', 'Technique agricole'),
        ('gestion', 'Gestion d\'exploitation'),
        ('commercial', 'Commercialisation'),
        ('environnement', 'Environnement'),
        ('innovation', 'Innovation'),
        ('certification', 'Certification'),
    ]
    
    titre = models.CharField(max_length=200, verbose_name="Titre de la formation")
    description = models.TextField(verbose_name="Description")
    contenu = models.TextField(verbose_name="Contenu détaillé")
    duree = models.IntegerField(verbose_name="Durée (heures)")
    niveau = models.CharField(
        max_length=20,
        choices=NIVEAU_CHOICES,
        default='debutant',
        verbose_name="Niveau"
    )
    categorie = models.CharField(
        max_length=20,
        choices=CATEGORIE_CHOICES,
        default='technique',
        verbose_name="Catégorie"
    )
    formateur = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='formations_enseignees',
        verbose_name="Formateur"
    )
    prix = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        verbose_name="Prix (FCFA)"
    )
    certificat_disponible = models.BooleanField(
        default=True,
        verbose_name="Certificat disponible"
    )
    is_active = models.BooleanField(default=True, verbose_name="Formation active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Formation"
        verbose_name_plural = "Formations"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.titre} ({self.niveau})"


class InscriptionFormation(models.Model):
    STATUT_CHOICES = [
        ('inscrit', 'Inscrit'),
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
        ('abandonnee', 'Abandonnée'),
    ]
    
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscriptions_formation')
    formation = models.ForeignKey(Formation, on_delete=models.CASCADE, related_name='inscriptions')
    progression = models.IntegerField(
        default=0, 
        verbose_name="Progression (%)",
        help_text="Pourcentage de progression de 0 à 100"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='inscrit',
        verbose_name="Statut"
    )
    terminee = models.BooleanField(default=False, verbose_name="Formation terminée")
    certificat_obtenu = models.BooleanField(default=False, verbose_name="Certificat obtenu")
    date_inscription = models.DateTimeField(auto_now_add=True, verbose_name="Date d'inscription")
    date_debut = models.DateTimeField(null=True, blank=True, verbose_name="Date de début")
    date_fin = models.DateTimeField(null=True, blank=True, verbose_name="Date de fin")
    notes = models.TextField(blank=True, verbose_name="Notes personnelles")
    
    class Meta:
        verbose_name = "Inscription à une formation"
        verbose_name_plural = "Inscriptions aux formations"
        unique_together = ['utilisateur', 'formation']
        ordering = ['-date_inscription']
    
    def __str__(self):
        return f"{self.utilisateur.get_full_name()} - {self.formation.titre}"


class Certificat(models.Model):
    inscription = models.OneToOneField(
        InscriptionFormation, 
        on_delete=models.CASCADE, 
        related_name='certificat'
    )
    numero_certificat = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name="Numéro de certificat"
    )
    date_emission = models.DateTimeField(auto_now_add=True, verbose_name="Date d'émission")
    date_expiration = models.DateTimeField(null=True, blank=True, verbose_name="Date d'expiration")
    fichier_pdf = models.FileField(
        upload_to='certificats/',
        null=True,
        blank=True,
        verbose_name="Fichier PDF"
    )
    is_valid = models.BooleanField(default=True, verbose_name="Certificat valide")
    
    class Meta:
        verbose_name = "Certificat"
        verbose_name_plural = "Certificats"
        ordering = ['-date_emission']
    
    def __str__(self):
        return f"Certificat {self.numero_certificat} - {self.inscription.utilisateur.get_full_name()}"
