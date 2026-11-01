/**
 * Regenerates new-trip-step-8/10-frontend-linux.png (CI Playwright snapshots).
 * Requires: npm run dev on http://localhost:8080
 *
 * Usage: node scripts/regenerate-wizard-step-linux-snapshots.js [8] [10]
 */
const path = require('path');
const { chromium } = require('@playwright/test');
const {
    freezeClock,
    setupCatchAllMock,
    setupCommonMocks,
    setupAuthState,
    waitForPageReady
} = require('../e2e-frontend/shared/mocks');

const SCREENSHOT_OPTIONS = {
    fullPage: true,
    animations: 'disabled'
};

const SNAPSHOT_DIR = path.join(
    __dirname,
    '../e2e-frontend/screenshots.spec.js-snapshots'
);

async function captureStep(page, step) {
    await page.addInitScript((stepNum) => {
        localStorage.setItem(
            'TRIP_CREATION_DRAFT',
            JSON.stringify({
                1: {
                    currentStep: stepNum,
                    maxVisitedStep: stepNum,
                    trip: { is_passenger: 0 }
                }
            })
        );
    }, step);
    await page.goto('http://localhost:8080/trips/create?resumeDraft=1');
    await waitForPageReady(page);
    await page.getByTestId(`trip-creation-wizard-step-${step}`).waitFor({
        state: 'visible',
        timeout: 60000
    });
    const out = path.join(
        SNAPSHOT_DIR,
        `new-trip-step-${step}-frontend-linux.png`
    );
    await page.screenshot({ path: out, ...SCREENSHOT_OPTIONS });
    console.log('Wrote', out);
}

async function main() {
    const steps = process.argv.slice(2).map(Number).filter(Boolean);
    const targetSteps = steps.length ? steps : [8, 10];

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        timezoneId: 'UTC'
    });
    const page = await context.newPage();

    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    for (const step of targetSteps) {
        await captureStep(page, step);
    }

    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
