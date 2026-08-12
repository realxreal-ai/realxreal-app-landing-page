/**
 * Status-bar clock for the phone mockups.
 *
 * Shows the visitor's own local time rather than the canonical 9:41, which
 * is a small touch that makes the mockups read as live screens.
 */

const REFRESH_MS = 15000;

function currentLabel() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12; // 0 → 12 on a 12-hour dial
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Boots the clock. No-op on pages without phone mockups.
 */
export function initDeviceClock() {
    const clocks = document.querySelectorAll('[data-role="clock"]');
    if (clocks.length === 0) return;

    const update = () => {
        const label = currentLabel();
        clocks.forEach((el) => { el.textContent = label; });
    };

    update();

    // Polled rather than scheduled to the minute boundary: the display has
    // minute resolution, so being up to 15s stale is invisible.
    window.setInterval(update, REFRESH_MS);
}
