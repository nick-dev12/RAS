// ===============================================================
// 🎯 Réseau Agricole du Sénégal - JavaScript Principal
// 🌾 Interactions et animations pour la plateforme agricole
// ===============================================================

document.addEventListener('DOMContentLoaded', function() {
    // ===============================================================
    // 📱 Menu Mobile
    // ===============================================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Fermer le menu quand on clique à l'extérieur
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // ===============================================================
    // 🎯 Smooth Scroll pour la navigation
    // ===============================================================
    // Ne s'applique que si on n'est pas sur le dashboard
    if (!window.location.pathname.includes('/dashboard/')) {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===============================================================
    // ✨ Animations au scroll (Intersection Observer)
    // ===============================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.service-card, .step, .stat-item, .feature');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===============================================================
    // 📊 Animation des compteurs
    // ===============================================================
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    };

    // Observer les statistiques pour les animer
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    if (!isNaN(target)) {
                        stat.textContent = '0';
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ===============================================================
    // 🎨 Effets hover sur les cartes de services
    // ===============================================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===============================================================
    // 📱 Header scroll effect
    // ===============================================================
    // Ne s'applique que si on n'est pas sur le dashboard
    if (!window.location.pathname.includes('/dashboard/')) {
        const header = document.querySelector('.header');
        if (header) {
            let lastScrollY = window.scrollY;

            window.addEventListener('scroll', function() {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }

                // Masquer/afficher le header selon la direction du scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }

                lastScrollY = currentScrollY;
            });
        }
    }

    // ===============================================================
    // 🎯 Parallax effect pour le hero
    // ===============================================================
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroVisual.style.transform = `translateY(${rate}px)`;
        });
    }

    // ===============================================================
    // 🌟 Animation de typing rapide pour le titre principal
    // ===============================================================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Construire le titre avec les éléments DOM
        const titleText = "Connectons l'agriculture du Sénégal";
        const highlightText = "l'agriculture";
        
        // Vider le titre et ajouter la classe typing
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        heroTitle.classList.add('typing');
        
        // Variables pour l'animation
        let currentText = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < titleText.length) {
                currentText += titleText.charAt(i);
                
                // Construire le HTML avec le highlight
                const beforeHighlight = currentText.substring(0, currentText.indexOf(highlightText));
                const afterHighlight = currentText.substring(currentText.indexOf(highlightText) + highlightText.length);
                
                if (currentText.includes(highlightText)) {
                    heroTitle.innerHTML = beforeHighlight + 
                        '<span class="highlight">' + highlightText + '</span>' + 
                        afterHighlight;
                } else {
                    heroTitle.innerHTML = currentText;
                }
                
                i++;
                
                // Vitesse plus rapide
                let delay = 30;
                if (titleText.charAt(i-1) === ' ') delay = 50;
                
                setTimeout(typeWriter, delay);
            } else {
                // Supprimer le curseur et lancer l'animation finale
                heroTitle.classList.remove('typing');
                
                // Animation finale du highlight
                setTimeout(() => {
                    const highlightSpan = heroTitle.querySelector('.highlight');
                    if (highlightSpan) {
                        highlightSpan.style.animation = 'highlightPulse 1.5s ease-in-out';
                        
                        // Ajouter un effet de rebond
                        setTimeout(() => {
                            highlightSpan.style.transform = 'scale(1.1)';
                            setTimeout(() => {
                                highlightSpan.style.transform = 'scale(1)';
                            }, 200);
                        }, 800);
                    }
                }, 200);
            }
        };
        
        // Démarrer immédiatement
        typeWriter();
    }

    // ===============================================================
    // 🎨 Animation des boutons
    // ===============================================================
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });

    // ===============================================================
    // 📱 Détection de la taille d'écran
    // ===============================================================
    const checkScreenSize = () => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Ajouter des classes pour des styles spécifiques
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // ===============================================================
    // 🎯 Lazy loading pour les images SVG
    // ===============================================================
    const lazyImages = document.querySelectorAll('svg[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ===============================================================
    // 🌟 Effet de particules pour le hero (optionnel)
    // ===============================================================
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--Vert-sénégalais)';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.6';
        particle.style.pointerEvents = 'none';
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 0.6 },
            { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    };

    // Créer des particules périodiquement
    if (window.innerWidth > 768) {
        setInterval(createParticle, 2000);
    }

    // ===============================================================
    // 🎯 Console log pour le développement
    // ===============================================================
    console.log('🌾 Réseau Agricole du Sénégal - JavaScript chargé avec succès!');
    console.log('📱 Version: 1.0.0');
    console.log('🔧 Fonctionnalités: Menu mobile, animations, parallax, compteurs');
});
