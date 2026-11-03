/**
 * PR #752 evidence: trip share fallback (Firefox) and share button (Chromium).
 * Requires: npm run dev on http://localhost:8080
 *
 * Usage: node scripts/capture-trip-share-pr752.js
 */
const path = require('path');
const fs = require('fs');
const { chromium, firefox } = require('@playwright/test');
const {
  freezeClock,
  setupApiOnlyCatchAll,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
  makeMockTrip,
  MOCK_USER,
  MOCK_CONFIG
} = require('../e2e-frontend/shared/mocks');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const TRIP_ID = Number(process.env.TRIP_ID || 752);
const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');

const MOCK_TRIP = makeMockTrip(TRIP_ID, {
  user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
  from_town: 'Rosario',
  to_town: 'Buenos Aires',
  description: 'Viaje de prueba — captura compartir PR 752',
  points: [
    {
      lat: -32.9442,
      lng: -60.6505,
      address: 'Rosario',
      json_address: { name: 'Rosario' }
    },
    {
      lat: -34.6037,
      lng: -58.3816,
      address: 'Buenos Aires',
      json_address: { name: 'Buenos Aires' }
    }
  ]
});

async function setupTripMocks(page) {
  await freezeClock(page);
  await setupApiOnlyCatchAll(page);
  await setupCommonMocks(page);
  await setupAuthState(page);

  await page.route('**/api/config', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_CONFIG)
    });
  });
  await page.route('**/api/retoken', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-jwt-token-for-testing', config: MOCK_CONFIG })
    });
  });
  await page.route(`**/api/trips/${TRIP_ID}`, (route) => {
    const url = route.request().url();
    if (url.endsWith(`/api/trips/${TRIP_ID}`)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_TRIP })
      });
    } else {
      route.continue();
    }
  });
}

async function openTripDetail(page) {
  await page.goto(`${BASE_URL}/trips/${TRIP_ID}`, { waitUntil: 'domcontentloaded' });
  await waitForPageReady(page);
  await page.getByTestId('trip-detail-share').waitFor({ state: 'visible', timeout: 30000 });
}

async function launchFirefox() {
  try {
    return await firefox.launch({ headless: true });
  } catch (err) {
    console.warn('[capture] Firefox unavailable, using Chromium without Web Share API:', err.message);
    const browser = await chromium.launch({ headless: true });
    return { browser, stripShareApi: true };
  }
}

async function captureFirefoxFallback() {
  const outPath = path.join(OUT_DIR, 'share_pr752_firefox_clipboard_toast.png');
  const launched = await launchFirefox();
  const browser = launched.browser || launched;
  const stripShareApi = launched.stripShareApi === true;
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-AR'
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() },
        configurable: true
      });
    }
  });
  if (stripShareApi) {
    await page.addInitScript(() => {
      try {
        delete Navigator.prototype.share;
        delete Navigator.prototype.canShare;
      } catch {
        // ignore
      }
    });
  }
  await setupTripMocks(page);
  await openTripDetail(page);
  await page.getByTestId('trip-detail-share').click();
  await page
    .locator('.alertify-notifier .ajs-message', { hasText: 'Enlace copiado' })
    .first()
    .waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();
  return outPath;
}

async function captureChromiumShareButton() {
  const outDetail = path.join(OUT_DIR, 'share_pr752_chrome_trip_detail.png');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: 'es-AR',
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();
  await setupTripMocks(page);
  await openTripDetail(page);
  await page.screenshot({ path: outDetail, fullPage: false });

  const hasShareApi = await page.evaluate(() => typeof navigator.share === 'function');
  let outAfterClick = null;
  if (hasShareApi) {
    outAfterClick = path.join(OUT_DIR, 'share_pr752_chrome_after_share_click.png');
    await page.getByTestId('trip-detail-share').click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: outAfterClick, fullPage: false });
  }

  await browser.close();
  return { outDetail, outAfterClick, hasShareApi };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const health = await fetch(BASE_URL).catch(() => null);
  if (!health || !health.ok) {
    throw new Error(`Dev server not reachable at ${BASE_URL}. Run: npm run dev`);
  }

  const firefoxPath = await captureFirefoxFallback();
  const chrome = await captureChromiumShareButton();
  console.log(
    JSON.stringify(
      {
        firefox: firefoxPath,
        chrome: chrome
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
