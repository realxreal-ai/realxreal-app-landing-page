// ==========================================================================
// TelemetryDeck custom signals.
//
// The SDK <script> in each page's <head> already sends a pageView per load,
// so this file only covers the things a page view can't tell us: which
// elements people actually act on.
//
// Tagging is done in markup, not here — put data-td-signal="name" on any
// element and its clicks are reported as "ai.realxreal.<name>". That keeps
// this module from growing a selector per button.
// ==========================================================================

const NAMESPACE = 'ai.realxreal';

/**
 * Send a namespaced signal. A no-op if the SDK failed to load or is blocked
 * by a content blocker, which is the common case and not worth surfacing.
 */
export function signal(name, payload = {}) {
    window.td?.signal?.(`${NAMESPACE}.${name}`, payload);
}

export function initTelemetry() {
    // Delegated, so elements added after load (rotators, lazy content) are
    // covered without re-binding.
    document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-td-signal]');
        if (!target) return;

        signal(target.dataset.tdSignal, {
            // Signal names stay coarse; the detail rides in the payload so
            // one signal type can be broken down in the dashboard.
            label: target.dataset.tdLabel ?? target.textContent.trim().slice(0, 64),
        });
    });
}
