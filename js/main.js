/**
 * Entry point — the only script either page loads.
 *
 * Every module below is a no-op when the elements it drives are absent, so
 * one entry serves both the landing page and the legal pages without either
 * needing to know what the other contains. Adding a page means adding
 * markup, not another script tag.
 *
 * Loaded as a module, so execution is deferred until the document has
 * parsed — no DOMContentLoaded wrapper is needed.
 */

import { initNav } from './modules/nav.js';
import { initCodewordRotation } from './modules/codeword-rotation.js';
import { initDeviceClock } from './modules/device-clock.js';
import { initTableOfContents } from './modules/toc.js';
import { initFooterYear } from './modules/footer-year.js';

initNav();
initCodewordRotation();
initDeviceClock();
initTableOfContents();
initFooterYear();
