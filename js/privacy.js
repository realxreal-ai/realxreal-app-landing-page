// ==========================================================================
// privacy.html — JS Entry Point
//
// Shared site behavior plus the legal-page-only TOC scroll-spy.
// Loaded as <script type="module" src="js/privacy.js"></script>
// ==========================================================================

import { initShared } from './shared-init.js';
import { initLegalToc } from './legal-toc.js';

function init() {
    initShared();
    initLegalToc();
}

document.addEventListener('DOMContentLoaded', init);