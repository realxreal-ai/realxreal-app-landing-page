// ==========================================================================
// Interactions: card hover lift, hero logo parallax, download badge pulse
// ==========================================================================

export function initCardHoverEffects() {
    const featureCards = document.querySelectorAll('.feature-card, .step-card, .use-case-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

export function initHeroParallax() {
    const heroLogo = document.querySelector('.hero-logo');
    if (!heroLogo) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;

        if (scrolled < window.innerHeight) {
            heroLogo.style.transform = `translateY(${rate}px)`;
        }
    });
}

export function initDownloadBadgePulse() {
    const downloadLinks = document.querySelectorAll('.badge-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}