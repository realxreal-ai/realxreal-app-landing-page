/**
 * Table-of-contents scrollspy for the legal pages.
 *
 * Highlights the sidebar link matching the section currently under the top
 * of the viewport.
 */

/**
 * Distance below the viewport top at which a section counts as "current".
 * Roughly the height of the fixed nav, so the highlighted entry matches the
 * heading a reader can actually see.
 */
const ACTIVATION_OFFSET_PX = 150;

/**
 * Boots the scrollspy. No-op on pages without a TOC sidebar.
 */
export function initTableOfContents() {
    const sidebar = document.querySelector('[data-toc]');
    if (!sidebar) return;

    const links = Array.from(sidebar.querySelectorAll('a[href^="#"]'));

    // Only spy on sections a link actually points at, so unlinked blocks
    // can't clear the highlight as they scroll past.
    const targets = links
        .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
        .filter((entry) => entry.section);

    if (targets.length === 0) return;

    function update() {
        const threshold = window.scrollY + ACTIVATION_OFFSET_PX;

        // Last section whose top has passed the threshold wins. Falls back
        // to the first entry, so at the top of the page — where no section
        // has passed yet — the rail shows the section being read rather
        // than going blank.
        let current = targets[0];
        targets.forEach((entry) => {
            if (entry.section.getBoundingClientRect().top + window.scrollY <= threshold) {
                current = entry;
            }
        });

        targets.forEach((entry) => {
            entry.link.classList.toggle('active', entry === current);
        });
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}
