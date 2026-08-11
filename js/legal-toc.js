// ==========================================================================
// Legal TOC Scroll-Spy: highlights the active .toc-sidebar link as the
// user scrolls past each .legal-block section. Page-specific to
// privacy.html (and any future legal pages using the same TOC layout) —
// not imported by main.js since other pages have no .toc-sidebar to spy on.
// ==========================================================================

export function initLegalToc() {
    const sections = document.querySelectorAll('.legal-block');
    const navLinks = document.querySelectorAll('.toc-sidebar a');

    if (!sections.length || !navLinks.length) return;

    function onScroll() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Trigger when ~150px above the section's top has scrolled past
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);
}