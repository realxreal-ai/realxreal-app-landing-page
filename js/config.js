/**
 * Shared configuration.
 *
 * Content and tuning values that a non-developer might reasonably want to
 * change, kept out of the behavioral modules so those stay pure logic.
 */

/**
 * Rotation period in seconds.
 *
 * The demo runs fast so a visitor sees a full rotation without waiting.
 * Set to 60 to match the real app's rotation cadence.
 */
export const ROTATION_PERIOD_SECONDS = 10;

/**
 * Seconds remaining at which the countdown ring switches to its urgent color.
 */
export const URGENT_THRESHOLD_SECONDS = 3;

/**
 * Crossfade duration for a codeword swap, in milliseconds.
 *
 * Must stay in step with the `.word-value` transition in
 * css/components/phone.css — the text is replaced at the midpoint, while
 * the element is fully transparent.
 */
export const WORD_FADE_MS = 280;

/**
 * Demo codeword pairs, cycled in order.
 *
 * In production these come from the TOTP-derived word list; here they are
 * static so the full animation loop is visible without wiring up crypto.
 * Each entry is [wordForPersonA, wordForPersonB].
 */
export const WORD_PAIRS = [
    ['easing',  'work'],
    ['cactus',  'house'],
    ['harvest', 'compass'],
    ['ember',   'granite'],
    ['orbit',   'thistle'],
    ['velvet',  'anchor'],
];

/**
 * Radius of the countdown ring's <circle>, matching the r attribute in the
 * markup. Used to compute the stroke-dasharray.
 */
export const TIMER_RING_RADIUS = 44;
