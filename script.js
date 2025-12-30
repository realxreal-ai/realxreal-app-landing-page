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