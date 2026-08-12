/**
 * Site navigation.
 *
 * Two responsibilities: condense the bar into its glass-blurred state once
 * the page scrolls, and drive the mobile menu.
 */

const SCROLL_THRESHOLD_PX = 30;

const ICON_OPEN = '☰';
const ICON_CLOSE = '✕';

/**
 * @param {Element} nav
 */
function bindScrollState(nav) {
    const update = () => {
        nav.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD_PX);
    };

    // Run once up front so a page restored mid-scroll paints correctly
    // rather than waiting for the first scroll event.
    update();
    window.addEventListener('scroll', update, { passive: true });
}

/**
 * @param {Element} toggle
 * @param {Element} menu
 */
function bindMobileMenu(toggle, menu) {
    const setOpen = (open) => {
        menu.classList.toggle('active', open);
        toggle.textContent = open ? ICON_CLOSE : ICON_OPEN;
        toggle.setAttribute('aria-expanded', String(open));
    };

    setOpen(false);

    toggle.addEventListener('click', () => {
        setOpen(!menu.classList.contains('active'));
    });

    // Following a link navigates or jumps to an anchor; either way the
    // overlay should get out of the way.
    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
    });
}

/**
 * Boots the navigation. No-op on pages without a `.site-nav`.
 */
export function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    bindScrollState(nav);

    const toggle = nav.querySelector('[data-nav-toggle]');
    const menu = nav.querySelector('[data-nav-menu]');
    if (toggle && menu) bindMobileMenu(toggle, menu);
}
