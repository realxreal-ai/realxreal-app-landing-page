// ==========================================================================
// Screenshot Rotator: cycles a set of screenshots on a timer, with
// clickable indicators, pause-on-hover, and crossfade transitions.
//
// To add a new rotating set: add a case below with the data-screenshot-set
// value used in the HTML, and list its image paths. No changes needed
// elsewhere — initScreenshotRotators() below wires up any element with the
// .rotating-screenshot class automatically.
// ==========================================================================


const ROTATION_INTERVAL_MS = 5000;
const FADE_DURATION_MS = 300;

export class ScreenshotRotator {
    constructor(imageElement, indicators) {
        this.image = imageElement;
        this.indicators = Array.from(indicators);
        this.currentIndex = 0;
        this.isPaused = false;

        this.screenshotSet = this.image.dataset.screenshotSet;
        this.screenshots = SCREENSHOT_SETS[this.screenshotSet] || [];

        if (!this.screenshots.length) {
            console.warn(`ScreenshotRotator: no screenshots configured for set "${this.screenshotSet}"`);
            return;
        }

        this.init();
    }

    init() {
        this.startRotation();

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        this.image.addEventListener('mouseenter', () => this.pause());
        this.image.addEventListener('mouseleave', () => this.resume());
    }

    startRotation() {
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.next();
            }
        }, ROTATION_INTERVAL_MS);
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.screenshots.length;
        this.updateImage();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateImage();

        // Reset rotation timer so a manual click doesn't get interrupted
        clearInterval(this.interval);
        this.startRotation();
    }

    updateImage() {
        this.image.style.opacity = '0';

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        setTimeout(() => {
            this.image.src = this.screenshots[this.currentIndex];
            this.image.style.opacity = '1';
        }, FADE_DURATION_MS);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    destroy() {
        clearInterval(this.interval);
    }
}

export function initScreenshotRotators() {
    const rotatingScreenshots = document.querySelectorAll('.rotating-screenshot');

    rotatingScreenshots.forEach(screenshot => {
        const container = screenshot.closest('.screenshot-item');
        const indicators = container.querySelectorAll('.indicator');

        if (indicators.length > 0) {
            new ScreenshotRotator(screenshot, indicators);
        }
    });
}