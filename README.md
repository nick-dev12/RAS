# 🌾 Réseau Agricole du Sénégal (RAS)

## 📋 Description

Plateforme numérique innovante pour connecter, former et accompagner tous les acteurs de l'écosystème agricole sénégalais. Le RAS facilite les échanges, la collaboration et l'apprentissage entre agriculteurs, experts, formateurs et investisseurs.

## 🎯 Objectifs

- **Connecter** : Mettre en relation tous les acteurs agricoles
- **Former** : Offrir des formations adaptées aux réalités sénégalaises
- **Accompagner** : Fournir un suivi personnalisé et des conseils experts
- **Moderniser** : Digitaliser l'agriculture sénégalaise

## 🛠️ Technologies

- **Backend** : Django 5.2.7
- **Base de données** : PostgreSQL avec PostGIS
- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Dépendances** : Pillow, django-cors-headers, python-decouple

## 📁 Structure du Projet

```
reseau_agricole_senegal/
├── agriculture/                    # 🌾 Application principale
│   ├── personal_views/            # Vues personnalisées
│   │   ├── __init__.py
│   │   └── home_views.py         # Vue de la page d'accueil
│   ├── personal_urls/            # URLs personnalisées
│   │   ├── __init__.py
│   │   └── home_urls.py          # URLs de la page d'accueil
│   ├── static/                   # Fichiers statiques
│   │   ├── css/
│   │   │   └── style.css         # Styles CSS avec variables
│   │   ├── js/
│   │   │   └── main.js           # JavaScript principal
│   │   └── images/               # Images et icônes
│   ├── templates/                # Templates HTML
│   │   └── agriculture/
│   │       └── home.html         # Template de la landing page
│   ├── urls.py                   # Configuration URLs de l'app
│   └── ...
├── reseau_agricole_senegal/      # Configuration du projet
│   ├── settings.py               # Configuration Django
│   └── urls.py                   # URLs principales
├── requirements.txt              # Dépendances Python
└── manage.py                     # Script de gestion Django
```

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd reseau_agricole_senegal
   ```

2. **Activer l'environnement virtuel**
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurer la base de données**
   - Installer PostgreSQL avec PostGIS
   - Créer une base de données `gestion_agricole`
   - Configurer les variables d'environnement dans `.env`

5. **Lancer les migrations**
   ```bash
   python manage.py migrate
   ```

6. **Démarrer le serveur**
   ```bash
   python manage.py runserver
   ```

## 🎨 Design System

### Couleurs
- **Vert sénégalais** : `#008753` (primaire)
- **Jaune soleil** : `#FDEF4C` (accent)
- **Rouge drapeau** : `#D22831` (alertes)
- **Beige terre** : `#F5E9D7` (fond)

### Typographie
- **Police principale** : Inter
- **Tailles** : xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl

### Composants
- Boutons avec effets hover
- Cartes de services interactives
- Animations au scroll
- Menu mobile responsive

## 📱 Fonctionnalités

### Landing Page
- ✅ Hero section avec CTA
- ✅ Section services (6 cartes)
- ✅ À propos du réseau
- ✅ Comment ça marche (4 étapes)
- ✅ Statistiques animées
- ✅ Appel à l'action
- ✅ Footer complet

### Responsive Design
- ✅ Mobile-first
- ✅ Tablette
- ✅ Desktop

### Interactions
- ✅ Menu mobile
- ✅ Smooth scroll
- ✅ Animations au scroll
- ✅ Effets hover
- ✅ Compteurs animés

## 🔧 Développement

### Structure des vues
Les vues sont organisées dans `agriculture/personal_views/` :
- `home_views.py` : Page d'accueil

### Structure des URLs
Les URLs sont organisées dans `agriculture/personal_urls/` :
- `home_urls.py` : URLs de la page d'accueil

### Templates
Les templates suivent la convention Django :
- `agriculture/templates/agriculture/home.html`

## 📊 Modules à développer

1. **Authentification & Profils** (MVP Phase 1)
2. **Marketplace** (MVP Phase 1)
3. **Carte des opportunités** (MVP Phase 1)
4. **Formations** (MVP Phase 1)
5. **Réseau social** (MVP Phase 1)
6. **Projets communs** (Phase 2)
7. **Système d'alerte** (Phase 2)
8. **Accompagnement** (Phase 2)

## 🌍 Localisation

- **Langue** : Français
- **Fuseau horaire** : Africa/Dakar
- **Région** : Sénégal

## 📞 Contact

- **Email** : contact@reseauagricole.sn
- **Téléphone** : +221 33 XXX XX XX
- **Adresse** : Dakar, Sénégal

---

*Développé avec ❤️ pour l'agriculture sénégalaise* 🌾🇸🇳
