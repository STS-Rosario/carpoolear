/**
 * Regenerates trip-detail-frontend-linux.png using the same flow as screenshots.spec.js.
 * Playwright names snapshots by OS; CI expects the -linux file on Ubuntu.
 * Run with dev server on :8080.
 */
const path = require('path');
const { chromium } = require('@playwright/test');
const {
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
  MOCK_TRIP_DETAIL
} = require('../e2e-frontend/shared/mocks');

const OUT = path.join(
  __dirname,
  '../e2e-frontend/screenshots.spec.js-snapshots/trip-detail-frontend-linux.png'
);

const SCREENSHOT_OPTIONS = {
  fullPage: true,
  animations: 'disabled',
  maxDiffPixelRatio: 0.02
};

async function main() {
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

  await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: MOCK_TRIP_DETAIL })
    });
  });

  await page.goto('http://localhost:8080/trips/1');
  await waitForPageReady(page);

  await page.screenshot({
    path: OUT,
    fullPage: SCREENSHOT_OPTIONS.fullPage,
    animations: SCREENSHOT_OPTIONS.animations
  });

  await browser.close();
  console.log('Wrote', OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
