// ==========================================================================
// Theme: switches body[data-section-theme] as the user scrolls between
// sections tagged with data-theme="light|dark|accent"
// ==========================================================================

export function initSectionTheme() {
    const sections = document.querySelectorAll('.section[data-theme]');
    const body = document.body;

    if (!sections.length) return;

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

    sections.forEach(section => sectionObserver.observe(section));
}