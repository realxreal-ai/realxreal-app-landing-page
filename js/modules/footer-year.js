/**
 * Copyright year.
 *
 * Keeps the footer from going stale on a site that may sit undeployed for
 * months at a time.
 */

export function initFooterYear() {
    const slots = document.querySelectorAll('[data-role="year"]');
    if (slots.length === 0) return;

    const year = String(new Date().getFullYear());
    slots.forEach((el) => { el.textContent = year; });
}
