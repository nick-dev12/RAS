from django.db import models
from django.utils import timezone


class Alerte(models.Model):
    TYPE_ALERTE_CHOICES = [
        ('meteo', 'Météo'),
        ('marche', 'Marché'),
        ('calendrier', 'Calendrier cultural'),
        ('formation', 'Formation'),
        ('projet', 'Projet'),
        ('visite', 'Visite'),
        ('echeance', 'Échéance'),
        ('systeme', 'Système'),
    ]
    
    URGENCE_CHOICES = [
        ('faible', 'Faible'),
        ('moyenne', 'Moyenne'),
        ('haute', 'Haute'),
        ('critique', 'Critique'),
    ]
    
    type_alerte = models.CharField(
        max_length=20,
        choices=TYPE_ALERTE_CHOICES,
        verbose_name="Type d'alerte"
    )
    titre = models.CharField(max_length=200, verbose_name="Titre")
    message = models.TextField(verbose_name="Message")
    region = models.CharField(max_length=100, blank=True, verbose_name="Région cible")
    village = models.CharField(max_length=100, blank=True, verbose_name="Village cible")
    urgence = models.CharField(
        max_length=20,
        choices=URGENCE_CHOICES,
        default='moyenne',
        verbose_name="Niveau d'urgence"
    )
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    date_expiration = models.DateTimeField(verbose_name="Date d'expiration")
    is_active = models.BooleanField(default=True, verbose_name="Alerte active")
    is_read = models.BooleanField(default=False, verbose_name="Alerte lue")
    icon = models.CharField(max_length=10, default='⚠️', verbose_name="Icône")
    couleur = models.CharField(
        max_length=20,
        default='warning',
        verbose_name="Couleur d'affichage"
    )
    lien_action = models.URLField(blank=True, verbose_name="Lien d'action")
    donnees_meteo = models.JSONField(null=True, blank=True, verbose_name="Données météo")
    donnees_marche = models.JSONField(null=True, blank=True, verbose_name="Données marché")
    
    class Meta:
        verbose_name = "Alerte"
        verbose_name_plural = "Alertes"
        ordering = ['-urgence', '-date_creation']
    
    def __str__(self):
        return f"{self.titre} ({self.get_urgence_display()})"
    
    @property
    def is_expired(self):
        """Vérifie si l'alerte est expirée"""
        return timezone.now() > self.date_expiration
    
    def mark_as_read(self):
        """Marque l'alerte comme lue"""
        self.is_read = True
        self.save()


class AlerteUtilisateur(models.Model):
    """Modèle pour lier les alertes aux utilisateurs spécifiques"""
    alerte = models.ForeignKey(Alerte, on_delete=models.CASCADE, related_name='utilisateurs_cibles')
    utilisateur = models.ForeignKey(
        'agriculture.User', 
        on_delete=models.CASCADE, 
        related_name='alertes_recues'
    )
    is_read = models.BooleanField(default=False, verbose_name="Alerte lue par l'utilisateur")
    date_lecture = models.DateTimeField(null=True, blank=True, verbose_name="Date de lecture")
    action_effectuee = models.BooleanField(default=False, verbose_name="Action effectuée")
    
    class Meta:
        verbose_name = "Alerte utilisateur"
        verbose_name_plural = "Alertes utilisateurs"
        unique_together = ['alerte', 'utilisateur']
        ordering = ['-alerte__date_creation']
    
    def __str__(self):
        return f"{self.utilisateur.get_full_name()} - {self.alerte.titre}"


class NotificationPreference(models.Model):
    """Préférences de notification des utilisateurs"""
    utilisateur = models.OneToOneField(
        'agriculture.User', 
        on_delete=models.CASCADE, 
        related_name='preferences_notification'
    )
    alertes_meteo = models.BooleanField(default=True, verbose_name="Alertes météo")
    alertes_marche = models.BooleanField(default=True, verbose_name="Alertes marché")
    alertes_calendrier = models.BooleanField(default=True, verbose_name="Alertes calendrier")
    alertes_formation = models.BooleanField(default=True, verbose_name="Alertes formation")
    alertes_projet = models.BooleanField(default=True, verbose_name="Alertes projet")
    alertes_visite = models.BooleanField(default=True, verbose_name="Alertes visite")
    alertes_echeance = models.BooleanField(default=True, verbose_name="Alertes échéance")
    notification_email = models.BooleanField(default=True, verbose_name="Notifications par email")
    notification_sms = models.BooleanField(default=False, verbose_name="Notifications par SMS")
    notification_push = models.BooleanField(default=True, verbose_name="Notifications push")
    frequence_alertes = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immédiate'),
            ('quotidienne', 'Quotidienne'),
            ('hebdomadaire', 'Hebdomadaire'),
        ],
        default='immediate',
        verbose_name="Fréquence des alertes"
    )
    
    class Meta:
        verbose_name = "Préférence de notification"
        verbose_name_plural = "Préférences de notification"
    
    def __str__(self):
        return f"Préférences de {self.utilisateur.get_full_name()}"
