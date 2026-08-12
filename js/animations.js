// ==========================================================================
// Animations: fade-in-on-scroll, hero load animation, feature card stagger
// ==========================================================================

export function initFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
}

export function initLoadAnimations() {
    window.addEventListener('load', () => {
        const animateElements = document.querySelectorAll('.animate-on-load');
        animateElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
}

export function initFeatureCardStagger() {
    const featureGrid = document.querySelector('.feature-grid');
    if (!featureGrid) return;

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