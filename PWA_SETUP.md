# Configuration PWA - Réseau Agricole du Sénégal

## ✅ Configuration terminée

La Progressive Web App (PWA) a été configurée avec succès pour l'application Réseau Agricole du Sénégal.

## 📁 Fichiers créés

### 1. Manifest (`manifest.json`)
- **Emplacement** : `agriculture/static/manifest.json`
- **Description** : Définit les métadonnées de l'application PWA
- **Contenu** : Nom, icônes, couleurs, raccourcis, etc.

### 2. Service Worker (`service-worker.js`)
- **Emplacement** : `agriculture/static/js/service-worker.js`
- **Description** : Gère la mise en cache et le fonctionnement hors ligne
- **Fonctionnalités** :
  - Cache des fichiers statiques (CSS, JS, images)
  - Stratégie Cache First pour les fichiers statiques
  - Stratégie Network First pour les pages HTML
  - Support hors ligne

### 3. Script PWA (`pwa.js`)
- **Emplacement** : `agriculture/static/js/pwa.js`
- **Description** : Enregistre le service worker et gère l'installation
- **Fonctionnalités** :
  - Enregistrement automatique du service worker
  - Détection des mises à jour
  - Bouton d'installation personnalisé
  - Gestion des prompts d'installation

### 4. Icônes PWA
- **Emplacement** : `agriculture/static/images/`
- **Tailles générées** : 16x16, 32x32, 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- **Script de génération** : `scripts/generate_pwa_icons.py`

### 5. Vues Django
- **Fichier** : `agriculture/personal_views/pwa_views.py`
- **Vues** :
  - `manifest_view` : Sert le manifest.json
  - `service_worker_view` : Sert le service-worker.js

### 6. URLs
- **Fichier** : `agriculture/personal_urls/pwa_urls.py`
- **Routes** :
  - `/manifest.json` → `manifest_view`
  - `/service-worker.js` → `service_worker_view`

### 7. Partial Template
- **Fichier** : `agriculture/templates/agriculture/partials/pwa_meta.html`
- **Description** : Contient toutes les balises meta PWA
- **Inclus dans** : Tous les templates principaux

## 🚀 Installation et test

### 1. Activer l'environnement virtuel
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Vérifier que le serveur Django fonctionne
```bash
python manage.py runserver
```

### 3. Tester la PWA

#### Sur Chrome/Edge (Desktop)
1. Ouvrir `http://127.0.0.1:8000/`
2. Ouvrir les DevTools (F12)
3. Aller dans l'onglet "Application" (ou "Application" en français)
4. Vérifier que le Service Worker est enregistré
5. Vérifier que le Manifest est détecté
6. Cliquer sur l'icône d'installation dans la barre d'adresse

#### Sur Chrome/Edge (Mobile)
1. Ouvrir `http://127.0.0.1:8000/` sur votre téléphone (même réseau)
2. Menu (3 points) → "Ajouter à l'écran d'accueil" ou "Installer l'application"

#### Sur Safari (iOS)
1. Ouvrir `http://127.0.0.1:8000/` sur Safari iOS
2. Partager → "Sur l'écran d'accueil"

#### Sur Firefox (Desktop)
1. Ouvrir `http://127.0.0.1:8000/`
2. Menu → "Installer" (si disponible)

## 📱 Fonctionnalités PWA

### ✅ Installation
- L'application peut être installée sur mobile et desktop
- Icône sur l'écran d'accueil
- Lancement en mode standalone (sans barre de navigation)

### ✅ Fonctionnement hors ligne
- Les fichiers statiques sont mis en cache
- Les pages visitées sont mises en cache
- Affichage d'une version en cache si le réseau est indisponible

### ✅ Mise à jour automatique
- Détection automatique des mises à jour du service worker
- Notification à l'utilisateur pour recharger la page

### ✅ Raccourcis
- Fil d'actualité
- Marketplace
- Dashboard

## 🔧 Configuration

### Couleurs PWA
- **Theme Color** : `#008753` (Vert sénégalais)
- **Background Color** : `#008753` (Vert sénégalais)

### Affichage
- **Mode** : `standalone` (sans barre de navigation du navigateur)
- **Orientation** : `portrait-primary` (portrait en priorité)

## 📝 Notes importantes

1. **HTTPS requis en production** : Les PWA nécessitent HTTPS en production (sauf localhost)

2. **Service Worker** : Le service worker est enregistré automatiquement au chargement de la page

3. **Mise en cache** : Les fichiers sont mis en cache automatiquement lors de la première visite

4. **Mise à jour** : Pour forcer une mise à jour, changer la version dans `service-worker.js` :
   ```javascript
   const CACHE_NAME = 'ras-v1.0.1'; // Incrémenter la version
   ```

5. **Icônes** : Pour régénérer les icônes, exécuter :
   ```bash
   python scripts/generate_pwa_icons.py
   ```

## 🐛 Dépannage

### Le service worker ne s'enregistre pas
- Vérifier la console du navigateur pour les erreurs
- Vérifier que le fichier `service-worker.js` est accessible
- Vérifier que l'URL `/service-worker.js` retourne bien le fichier

### Le manifest n'est pas détecté
- Vérifier que l'URL `/manifest.json` retourne bien le fichier
- Vérifier la console du navigateur
- Vérifier que les balises meta sont présentes dans le `<head>`

### L'icône ne s'affiche pas
- Vérifier que les icônes existent dans `agriculture/static/images/`
- Vérifier que les chemins dans `manifest.json` sont corrects
- Vérifier que les fichiers statiques sont collectés (`python manage.py collectstatic`)

## 📚 Ressources

- [MDN - Progressive Web Apps](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Configurer HTTPS
- [ ] Vérifier que tous les fichiers statiques sont servis correctement
- [ ] Tester l'installation sur différents navigateurs
- [ ] Tester le fonctionnement hors ligne
- [ ] Vérifier les icônes sur différents appareils
- [ ] Tester les raccourcis
- [ ] Vérifier les performances (Lighthouse PWA audit)

---

**Configuration PWA terminée avec succès ! 🎉**
