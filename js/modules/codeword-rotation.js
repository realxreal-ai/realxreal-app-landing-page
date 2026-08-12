/**
 * Codeword rotation engine.
 *
 * Mirrors the shape of the app's RXRTOTPEngine / RXRCircularTimer: a fixed
 * rotation period, a countdown ring redrawn every animation frame, and a
 * word swap that fires exactly when the ring completes.
 *
 * The period is anchored to wall-clock time (`Date.now() % PERIOD`) rather
 * than to an interval counter. That is what keeps the two phones in lockstep
 * — the same property the real TOTP scheme relies on — and it means the ring
 * stays correct after the tab is backgrounded and rAF stops firing.
 *
 * In production the pairs come from the TOTP-derived word list; here they
 * cycle a static array from config.js.
 */

import {
    ROTATION_PERIOD_SECONDS,
    URGENT_THRESHOLD_SECONDS,
    WORD_FADE_MS,
    WORD_PAIRS,
    TIMER_RING_RADIUS,
} from '../config.js';

const CIRCUMFERENCE = 2 * Math.PI * TIMER_RING_RADIUS;

/**
 * Collects the elements the engine writes to for a single device.
 *
 * `index` is the phone's position in the pair. It is what mirrors the view:
 * phone 0 shows pair[0] as "your word", phone 1 shows pair[1], and each
 * shows the other as the contact's word.
 *
 * @param {Element} phone
 * @returns {{index: number, mine: Element, theirs: Element, countdown: Element, caption: Element, ring: Element}|null}
 */
function readPhone(phone) {
    const view = {
        index: Number(phone.dataset.phoneIndex),
        mine: phone.querySelector('[data-role="mine"]'),
        theirs: phone.querySelector('[data-role="theirs"]'),
        countdown: phone.querySelector('[data-role="countdown"]'),
        caption: phone.querySelector('[data-role="caption"]'),
        ring: phone.querySelector('[data-role="ring"]'),
    };

    const complete = Object.values(view).every((v) => v !== null && v !== undefined)
        && Number.isInteger(view.index);

    return complete ? view : null;
}

/**
 * Writes a pair into every phone, each from its own point of view.
 *
 * @param {Array} views
 * @param {number} pairIndex
 */
function applyPair(views, pairIndex) {
    const pair = WORD_PAIRS[pairIndex % WORD_PAIRS.length];

    views.forEach((view) => {
        view.mine.textContent = pair[view.index];
        view.theirs.textContent = pair[1 - view.index];
    });
}

/**
 * Swaps to a new pair behind a crossfade.
 *
 * @param {Array} views
 * @param {number} pairIndex
 */
function swapPair(views, pairIndex) {
    const words = views.flatMap((view) => [view.mine, view.theirs]);

    words.forEach((el) => el.classList.add('swapping'));

    // Text is replaced at the midpoint of the fade, while the elements are
    // fully transparent, so the change itself is never visible.
    window.setTimeout(() => {
        applyPair(views, pairIndex);
        words.forEach((el) => el.classList.remove('swapping'));
    }, WORD_FADE_MS);
}

/**
 * Boots the engine. No-op on pages without phone mockups.
 */
export function initCodewordRotation() {
    const views = Array.from(document.querySelectorAll('[data-phone]'))
        .map(readPhone)
        .filter(Boolean);

    if (views.length === 0) return;

    views.forEach((view) => {
        view.ring.style.strokeDasharray = String(CIRCUMFERENCE);
        view.ring.style.strokeDashoffset = '0';
        view.caption.textContent = `Rotates every ${ROTATION_PERIOD_SECONDS}s`;
    });

    let pairIndex = 0;
    let lastPeriodIndex = -1;

    applyPair(views, pairIndex);

    function tick() {
        const nowSeconds = Date.now() / 1000;
        const elapsedInPeriod = nowSeconds % ROTATION_PERIOD_SECONDS;
        const remaining = Math.ceil(ROTATION_PERIOD_SECONDS - elapsedInPeriod);
        const progress = elapsedInPeriod / ROTATION_PERIOD_SECONDS;
        const isUrgent = remaining <= URGENT_THRESHOLD_SECONDS;

        views.forEach((view) => {
            view.ring.style.strokeDashoffset = String(CIRCUMFERENCE * progress);
            view.ring.classList.toggle('urgent', isUrgent);
            view.countdown.textContent = `${remaining}s`;
        });

        // Which period we are in, counted from the epoch. When it changes,
        // a rotation boundary was crossed — including after the tab was
        // backgrounded, where many periods may have elapsed at once.
        const periodIndex = Math.floor(nowSeconds / ROTATION_PERIOD_SECONDS);
        if (periodIndex !== lastPeriodIndex) {
            // Skip the swap on the very first frame; the initial pair is
            // already on screen and should hold for a full period.
            if (lastPeriodIndex !== -1) {
                pairIndex += 1;
                swapPair(views, pairIndex);
            }
            lastPeriodIndex = periodIndex;
        }

        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
}
