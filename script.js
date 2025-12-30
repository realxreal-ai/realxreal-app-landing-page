// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger to X
        if (navMenu.classList.contains('active')) {
            mobileToggle.innerHTML = '✕';
        } else {
            mobileToggle.innerHTML = '☰';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.innerHTML = '☰';
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for same-page anchors
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Update Copyright Year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Theme Switching Based on Section
const sections = document.querySelectorAll('.section[data-theme]');
const body = document.body;

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const theme = entry.target.getAttribute('data-theme');
            body.setAttribute('data-section-theme', theme);
        }
    });
}, {
    threshold: 0.5
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add hover effect to feature cards
const featureCards = document.querySelectorAll('.feature-card, .step-card, .use-case-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Smooth appearance for hero elements on load
window.addEventListener('load', () => {
    const animateElements = document.querySelectorAll('.animate-on-load');
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add active state to navigation based on scroll position
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add shadow to nav on scroll
    if (currentScrollY > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// Parallax effect for hero logo (subtle)
const heroLogo = document.querySelector('.hero-logo');
if (heroLogo) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        
        if (scrolled < window.innerHeight) {
            heroLogo.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Add loading state for download badges
const downloadLinks = document.querySelectorAll('.badge-link');
downloadLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Add a subtle pulse effect on click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Lazy load screenshot images with fade-in
const screenshotImages = document.querySelectorAll('.screenshot-img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // If the image has a data-src attribute, load it
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
            }
            
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

screenshotImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    imageObserver.observe(img);
});

// Add stagger effect to feature cards on scroll
const featureGrid = document.querySelector('.feature-grid');
if (featureGrid) {
    const gridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.feature-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    gridObserver.observe(featureGrid);
}

// Handle external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    // Only add target="_blank" if not already set
    if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Console easter egg
console.log('%c👋 Welcome to realxreal', 'font-size: 20px; font-weight: bold; color: #4370FF;');
console.log('%cInterested in how we built this? Check out our GitHub:', 'font-size: 14px; color: #B0C3FF;');
console.log('%chttps://github.com/realxreal-ai', 'font-size: 14px; color: #94eFFF; text-decoration: underline;');

// Screenshot Rotation System
class ScreenshotRotator {
    constructor(imageElement, indicators) {
        this.image = imageElement;
        this.indicators = Array.from(indicators);
        this.currentIndex = 0;
        this.isPaused = false;
        
        // Determine screenshot set
        this.screenshotSet = this.image.dataset.screenshotSet;
        
        // Define screenshot paths based on set
        if (this.screenshotSet === 'memory') {
            this.screenshots = [
                'images/memory-challenges/memory-1.png',
                'images/memory-challenges/memory-2.png',
                'images/memory-challenges/memory-3.png',
                'images/memory-challenges/memory-4.png',
                'images/memory-challenges/memory-5.png'
            ];
        } else if (this.screenshotSet === 'verify-send') {
            this.screenshots = [
                'images/verification-scenarios/verify-zoom.png',
                'images/verification-scenarios/verify-zelle.png',
                'images/verification-scenarios/verify-emergency.png',
                'images/verification-scenarios/verify-wire.png',
                'images/verification-scenarios/verify-executive.png'
            ];
        } else if (this.screenshotSet === 'verify-receive') {
            this.screenshots = [
                'images/verification-receiving/receive-ceo.png',
                'images/verification-receiving/receive-parent.png',
                'images/verification-receiving/receive-zelle.png',
                'images/verification-receiving/receive-wire.png',
                'images/verification-receiving/receive-zoom.png'
            ];
        } else if (this.screenshotSet === 'verify-receive') {
            this.screenshots = [
                'images/verification-receiving/receive-ceo.png',
                'images/verification-receiving/receive-parent.png',
                'images/verification-receiving/receive-zelle.png',
                'images/verification-receiving/receive-wire.png',
                'images/verification-receiving/receive-zoom.png'
            ];
        }
        
        this.init();
    }
    
    init() {
        // Start rotation
        this.startRotation();
        
        // Add click handlers to indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Pause on hover
        this.image.addEventListener('mouseenter', () => this.pause());
        this.image.addEventListener('mouseleave', () => this.resume());
    }
    
    startRotation() {
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, 3000); // Rotate every 3 seconds
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.screenshots.length;
        this.updateImage();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateImage();
        
        // Reset rotation timer
        clearInterval(this.interval);
        this.startRotation();
    }
    
    updateImage() {
        // Fade out
        this.image.style.opacity = '0';
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
        
        // Change image after fade
        setTimeout(() => {
            this.image.src = this.screenshots[this.currentIndex];
            
            // Fade in
            this.image.style.opacity = '1';
        }, 300);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    destroy() {
        clearInterval(this.interval);
    }
}

// Initialize screenshot rotators
document.addEventListener('DOMContentLoaded', () => {
    const rotatingScreenshots = document.querySelectorAll('.rotating-screenshot');
    
    rotatingScreenshots.forEach(screenshot => {
        const container = screenshot.closest('.screenshot-item');
        const indicators = container.querySelectorAll('.indicator');
        
        if (indicators.length > 0) {
            new ScreenshotRotator(screenshot, indicators);
        }
    });
});