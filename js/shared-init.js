// ==========================================================================
// Shared Init: the set of behaviors every page uses (nav, theme, animations,
// interactions, utils, screenshots). Page-specific entry points (main.js,
// privacy.js) call this first, then layer on anything page-only.
// ==========================================================================

import { initMobileMenu, initSmoothScroll, initNavScrollShadow } from './navigation.js';
import { initSectionTheme } from './theme.js';
import { initFadeInObserver, initLoadAnimations, initFeatureCardStagger } from './animations.js';
import { initCardHoverEffects, initHeroParallax, initDownloadBadgePulse } from './interactions.js';
import { initExternalLinks, initCopyrightYear } from './utils.js';
import { initLazyScreenshots } from './lazy-load.js';
import { initScreenshotRotators } from './screenshot-rotator.js';

export function initShared() {
    // Navigation
    initMobileMenu();
    initSmoothScroll();
    initNavScrollShadow();

    // Theming
    initSectionTheme();

    // Animations
    initFadeInObserver();
    initLoadAnimations();
    initFeatureCardStagger();

    // Interactions
    initCardHoverEffects();
    initHeroParallax();
    initDownloadBadgePulse();

    // Utilities
    initExternalLinks();
    initCopyrightYear();

    // Screenshots
    initLazyScreenshots();
    initScreenshotRotators();
}