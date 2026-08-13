// ==========================================================================
// TelemetryDeck custom signals.
//
// The SDK <script> in each page's <head> already sends a pageView per load,
// so this file covers what a page view can't tell us: what people click,
// how far down they get, and how long they stay.
//
// Almost everything here is automatic — links are classified by their href,
// so the press marquee's 28 cards and both copies of the nav report without
// a single attribute in the markup. Hand-tagging is reserved for the CTAs,
// where the signal name matters more than the destination:
//
//     <a href="..." data-td-signal="download.appStoreTapped">
//
// which reports as "ai.realxreal.download.appStoreTapped".
// ==========================================================================

const NAMESPACE = 'ai.realxreal';

/**
 * Section views are ~7 signals per page load, which dwarfs everything else
 * here. Flip this off if the signal quota gets tight — the click signals
 * are the ones worth paying for.
 */
const TRACK_SECTION_VIEWS = true;

/** Sections must be half on screen to count as seen, not merely scrolled past. */
const SECTION_VIEW_THRESHOLD = 0.5;

/**
 * Send a namespaced signal. A no-op if the SDK failed to load or is blocked
 * by a content blocker, which is the common case and not worth surfacing.
 */
export function signal(name, payload = {}) {
    window.td?.signal?.(`${NAMESPACE}.${name}`, { page: pageName(), ...payload });
}

/**
 * Which page a signal came from. The SDK's own pageView carries the URL, but
 * custom signals shouldn't depend on that to be broken down by page, so it
 * rides in every payload.
 */
function pageName() {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    return file.replace(/\.html$/, '') || 'index';
}

/**
 * The nearest named region of the page, so a click can be attributed to the
 * section that produced it. Sections without an id fall back to their first
 * class, which is how this codebase names them anyway (.press-section).
 */
function sectionOf(el) {
    const region = el.closest('section, footer, nav');
    if (!region) return 'unknown';
    if (region.id) return region.id;
    if (region.tagName !== 'SECTION') return region.tagName.toLowerCase();
    return region.className.split(/\s+/)[0] || 'section';
}

/**
 * Where a link goes, which decides what's worth recording about it. Bare "#"
 * hrefs are placeholders (the unreleased Play Store button), not navigation.
 */
function classifyLink(anchor) {
    const href = anchor.getAttribute('href') ?? '';

    if (href === '' || href === '#') return null;
    if (href.startsWith('#')) return 'anchor';
    if (href.startsWith('mailto:')) return 'email';

    return anchor.host === window.location.host ? 'internal' : 'outbound';
}

function trackLinkClicks() {
    document.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) return;

        // An explicit tag wins outright: the App Store link is also an
        // outbound link, and it should report once, under the name we chose.
        const tagged = event.target.closest('[data-td-signal]');
        if (tagged) {
            signal(tagged.dataset.tdSignal, {
                label: tagged.dataset.tdLabel ?? tagged.textContent.trim().slice(0, 64),
                section: sectionOf(tagged),
            });
            return;
        }

        const anchor = event.target.closest('a[href]');
        if (!anchor) return;

        const section = sectionOf(anchor);

        switch (classifyLink(anchor)) {
            case 'outbound':
                signal('link.outbound', {
                    // Host and path only. Query strings can carry anything,
                    // and none of it belongs in analytics for a privacy app.
                    host: anchor.host,
                    path: anchor.pathname,
                    // Press cards already name their publication in markup.
                    outlet: anchor.dataset.outlet ?? 'none',
                    section,
                });
                break;

            case 'internal':
                // These navigate the tab away, so the request races the
                // unload and may be dropped. The destination's own pageView
                // is the reliable record; this only adds which link drove it.
                signal('link.internal', {
                    to: anchor.pathname + anchor.hash,
                    section,
                });
                break;

            case 'anchor':
                signal('link.anchor', {
                    to: anchor.getAttribute('href'),
                    section,
                });
                break;

            case 'email':
                signal('link.email', { section });
                break;
        }
    });
}

/**
 * Mobile menu opens, as a proxy for how much of the traffic is phone-shaped
 * and actually navigating rather than bouncing off the hero.
 */
function trackMobileMenu() {
    const toggle = document.querySelector('[data-nav-toggle]');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        // nav.js updates aria-expanded in its own listener on this element,
        // which runs before this one, so the attribute is already current.
        if (toggle.getAttribute('aria-expanded') === 'true') {
            signal('nav.mobileMenuOpened');
        }
    });
}

/**
 * Which sections people actually reach. Fires at most once per section per
 * page load — a signal per scroll-past would be noise and quota both.
 */
function trackSectionViews() {
    const sections = document.querySelectorAll('section');
    if (!TRACK_SECTION_VIEWS || sections.length === 0) return;
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);
            signal('section.viewed', { section: sectionOf(entry.target) });
        });
    }, { threshold: SECTION_VIEW_THRESHOLD });

    sections.forEach((section) => observer.observe(section));
}

/**
 * A single end-of-visit summary: how long they stayed and how far they got.
 *
 * Sent on the first hide rather than on unload, because mobile browsers
 * routinely kill a backgrounded tab without ever firing unload.
 */
function trackEngagement() {
    const startedAt = performance.now();
    let deepestScroll = 0;
    let reported = false;

    const updateDepth = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;

        const percent = Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100);
        deepestScroll = Math.max(deepestScroll, Math.min(percent, 100));
    };

    updateDepth();
    window.addEventListener('scroll', updateDepth, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'hidden' || reported) return;

        reported = true;
        signal('page.engaged', {
            seconds: Math.round((performance.now() - startedAt) / 1000),
            scrollDepth: deepestScroll,
        });
    });
}

export function initTelemetry() {
    trackLinkClicks();
    trackMobileMenu();
    trackSectionViews();
    trackEngagement();
}
