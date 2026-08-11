// ==========================================================================
// Lazy Loading: fades screenshot images in once they enter the viewport
// (also supports data-src for true lazy loading if you add it later)
// ==========================================================================

export function initLazyScreenshots() {
    const screenshotImages = document.querySelectorAll('.screenshot-img');
    if (!screenshotImages.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                } else {
                    // Standard image with a src already set — just reveal it
                    img.style.opacity = '1';
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
}