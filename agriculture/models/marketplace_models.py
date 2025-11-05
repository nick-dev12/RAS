from django.db import models
from .user_models import User


class Annonce(models.Model):
    STATUT_CHOICES = [
        ('active', 'Active'),
        ('en_attente', 'En attente de validation'),
        ('vendue', 'Vendue'),
        ('expiree', 'Expirée'),
        ('annulee', 'Annulée'),
    ]
    
    TYPE_PRODUIT_CHOICES = [
        ('produit_brut', 'Produit brut'),
        ('produit_transforme', 'Produit transformé'),
        ('intrant', 'Intrant'),
        ('equipement', 'Équipement'),
        ('service', 'Service'),
    ]
    
    vendeur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='annonces_vendeur')
    titre = models.CharField(max_length=200, verbose_name="Titre de l'annonce")
    produit = models.CharField(max_length=100, verbose_name="Produit")
    type_produit = models.CharField(
        max_length=20,
        choices=TYPE_PRODUIT_CHOICES,
        default='produit_brut',
        verbose_name="Type de produit"
    )
    quantite = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Quantité disponible"
    )
    unite = models.CharField(max_length=20, default='kg', verbose_name="Unité")
    prix = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Prix unitaire (FCFA)"
    )
    description = models.TextField(verbose_name="Description")
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente',
        verbose_name="Statut"
    )
    contacts_recus = models.IntegerField(default=0, verbose_name="Nombre de contacts")
    offres_recues = models.IntegerField(default=0, verbose_name="Nombre d'offres")
    date_expiration = models.DateTimeField(null=True, blank=True, verbose_name="Date d'expiration")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Annonce"
        verbose_name_plural = "Annonces"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.titre} - {self.vendeur.get_full_name()}"


class DemandeAchat(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('acceptee', 'Acceptée'),
        ('refusee', 'Refusée'),
        ('annulee', 'Annulée'),
    ]
    
    annonce = models.ForeignKey(Annonce, on_delete=models.CASCADE, related_name='demandes')
    acheteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='demandes_achat')
    quantite_demandee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Quantité demandée"
    )
    prix_propose = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        verbose_name="Prix proposé (FCFA)"
    )
    message = models.TextField(verbose_name="Message")
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente',
        verbose_name="Statut"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Demande d'achat"
        verbose_name_plural = "Demandes d'achat"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Demande de {self.acheteur.get_full_name()} pour {self.annonce.titre}"


class Vente(models.Model):
    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('terminee', 'Terminée'),
        ('annulee', 'Annulée'),
    ]
    
    annonce = models.ForeignKey(Annonce, on_delete=models.CASCADE, related_name='ventes')
    vendeur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ventes_vendeur')
    acheteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ventes_acheteur')
    quantite_vendue = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Quantité vendue"
    )
    prix_unitaire = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Prix unitaire (FCFA)"
    )
    montant_total = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        verbose_name="Montant total (FCFA)"
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_cours',
        verbose_name="Statut"
    )
    date_vente = models.DateTimeField(auto_now_add=True, verbose_name="Date de vente")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"
        ordering = ['-date_vente']
    
    def __str__(self):
        return f"Vente {self.id} - {self.vendeur.get_full_name()} → {self.acheteur.get_full_name()}"
