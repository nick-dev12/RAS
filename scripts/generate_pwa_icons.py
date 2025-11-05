#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script pour générer les icônes PWA de différentes tailles
Utilise Pillow pour créer les icônes à partir d'une image source
"""
import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Configurer l'encodage pour Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Ajouter le répertoire parent au path pour les imports
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Tailles d'icônes requises pour la PWA
ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

# Couleurs du projet
VERT_SENEGALAIS = (0, 135, 83)  # #008753
JAUNE_SOLEIL = (253, 239, 76)   # #FDEF4C
BEIGE_TERRE = (245, 233, 215)   # #F5E9D7


def create_icon(size):
    """
    Crée une icône de la taille spécifiée avec le logo RAS
    """
    # Créer une image avec fond vert
    img = Image.new('RGB', (size, size), VERT_SENEGALAIS)
    draw = ImageDraw.Draw(img)
    
    # Ajouter un cercle blanc pour le logo
    margin = size // 8
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        fill=BEIGE_TERRE,
        outline=JAUNE_SOLEIL,
        width=max(2, size // 32)
    )
    
    # Ajouter le texte "RAS" au centre
    try:
        # Essayer d'utiliser une police système
        font_size = size // 3
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", font_size)
        except:
            # Police par défaut si aucune police n'est trouvée
            font = ImageFont.load_default()
    
    # Calculer la position du texte pour le centrer
    text = "RAS"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - text_height // 4
    
    # Dessiner le texte
    draw.text(
        (text_x, text_y),
        text,
        fill=VERT_SENEGALAIS,
        font=font
    )
    
    return img


def generate_all_icons():
    """
    Génère toutes les icônes nécessaires pour la PWA
    """
    # Créer le dossier de destination s'il n'existe pas
    icons_dir = BASE_DIR / 'agriculture' / 'static' / 'images'
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"Génération des icônes PWA dans {icons_dir}...")
    
    for size in ICON_SIZES:
        icon = create_icon(size)
        icon_path = icons_dir / f'icon-{size}x{size}.png'
        icon.save(icon_path, 'PNG')
        print(f"[OK] Icône {size}x{size} créée: {icon_path}")
    
    print("\n[SUCCESS] Toutes les icônes PWA ont été générées avec succès!")


if __name__ == '__main__':
    try:
        generate_all_icons()
    except Exception as e:
        print(f"[ERROR] Erreur lors de la génération des icônes: {e}")
        sys.exit(1)
