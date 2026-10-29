/**
 * Real Playwright screenshot: trip detail with Malvinas on the map.
 * Requires: npm run dev on http://localhost:8080
 *
 * Usage: node scripts/capture-malvinas-trip-detail.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');
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

const MOCK_CONFIG_MALVINAS = {
  ...MOCK_CONFIG,
  map_coordinates: [-51.72, -58.85],
  map_zoom: 7
};

const TRIP_ID = 741;
const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');
const OUT_FULL = path.join(OUT_DIR, 'malvinas_trip_detail_2026.png');
const OUT_MAP = path.join(OUT_DIR, 'malvinas_trip_detail_mapa_2026.png');

const MOCK_TRIP_MALVINAS = makeMockTrip(TRIP_ID, {
  user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
  from_town: 'Puerto Argentino',
  to_town: 'Islas Malvinas (campo)',
  description: 'Viaje de prueba — captura documentación mapa',
  points: [
    {
      lat: -51.6928,
      lng: -57.8519,
      address: 'Puerto Argentino',
      json_address: { name: 'Puerto Argentino' }
    },
    {
      lat: -51.75,
      lng: -59.05,
      address: 'Islas Malvinas',
      json_address: { name: 'Islas Malvinas' }
    }
  ]
});

async function waitForMapTiles(page, timeoutMs = 90000) {
  await page
    .locator('.trip-route-map .maplibregl-map, .trip-route-map .leaflet-container')
    .first()
    .waitFor({ state: 'visible', timeout: 60000 });

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ready = await page.evaluate(() => {
      const root = document.querySelector('.trip-route-map');
      if (!root) return false;
      const canvas = root.querySelector('canvas.maplibregl-canvas, canvas');
      return Boolean(canvas && canvas.width >= 100 && canvas.height >= 100);
    });
    if (ready) {
      await page.waitForTimeout(4000);
      return;
    }
    await page.waitForTimeout(500);
  }
  throw new Error('Map canvas did not become ready in time');
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-AR'
  });
  const page = await context.newPage();

  await freezeClock(page);
  await setupApiOnlyCatchAll(page);
  await setupCommonMocks(page);
  await setupAuthState(page);

  await page.route('**/api/config', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_CONFIG_MALVINAS)
    });
  });
  await page.route('**/api/retoken', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-jwt-token-for-testing', config: MOCK_CONFIG_MALVINAS })
    });
  });

  await page.route(`**/api/trips/${TRIP_ID}`, (route) => {
    const url = route.request().url();
    if (url.endsWith(`/api/trips/${TRIP_ID}`)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_TRIP_MALVINAS })
      });
    } else {
      route.continue();
    }
  });

  await page.goto(`http://localhost:8080/trips/${TRIP_ID}`);
  await waitForPageReady(page);

  try {
    await page.getByText('Puerto Argentino').first().waitFor({
      state: 'visible',
      timeout: 20000
    });
  } catch (err) {
    const debugPath = path.join(OUT_DIR, 'malvinas_trip_detail_debug.png');
    await page.screenshot({ path: debugPath, fullPage: true });
    throw new Error(`Trip detail did not render (debug: ${debugPath}): ${err.message}`);
  }

  await waitForMapTiles(page);

  const mapEl = page.locator('.trip-route-map').first();
  await mapEl.screenshot({ path: OUT_MAP });
  await page.screenshot({ path: OUT_FULL, fullPage: true });

  await browser.close();

  console.log('Saved:', OUT_FULL);
  console.log('Saved:', OUT_MAP);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
