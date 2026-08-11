// ==========================================================================
// Misc site-wide utilities: external link target/rel, copyright year
// ==========================================================================

export function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        // Only add target="_blank" if not already set
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

export function initCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}