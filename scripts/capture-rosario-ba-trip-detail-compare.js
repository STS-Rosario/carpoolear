/**
 * Real full-page screenshot: trip detail Rosario → Buenos Aires.
 * Does NOT block map tiles (compare visual antes/después).
 *
 * Usage (dev server on http://localhost:8080):
 *   node scripts/capture-rosario-ba-trip-detail-compare.js antes
 *   node scripts/capture-rosario-ba-trip-detail-compare.js despues
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
  MOCK_TRIP_DETAIL,
  MOCK_USER
} = require('../e2e-frontend/shared/mocks');

const TRIP_ID = 1;
const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');

async function waitForMapReady(page, timeoutMs = 120000) {
  await page.locator('.trip-route-map').waitFor({ state: 'visible', timeout: 30000 });

  const tilePromise = page
    .waitForResponse(
      (res) => {
        const u = res.url();
        return (
          res.ok() &&
          (u.includes('tile.osm.org') ||
            u.includes('openstreetmap.org') ||
            u.includes('openfreemap.org'))
        );
      },
      { timeout: timeoutMs }
    )
    .catch(() => null);

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const stats = await page.evaluate(() => {
      const root = document.querySelector('.trip-route-map');
      if (!root) return { ok: false };
      const canvas = root.querySelector('canvas');
      const tiles = root.querySelectorAll('img.leaflet-tile');
      let loadedRaster = 0;
      tiles.forEach((img) => {
        if (img.naturalWidth > 0) loadedRaster += 1;
      });
      const vectorOk =
        canvas && canvas.width >= 100 && canvas.height >= 100;
      return {
        ok: vectorOk || loadedRaster >= 3,
        loadedRaster,
        vectorOk: Boolean(vectorOk)
      };
    });
    if (stats.ok) {
      await tilePromise;
      await page.waitForTimeout(4000);
      return;
    }
    await page.waitForTimeout(500);
  }
  throw new Error('Map did not finish loading in time');
}

async function main() {
  const label = (process.argv[2] || '').toLowerCase();
  if (label !== 'antes' && label !== 'despues') {
    console.error('Usage: node scripts/capture-rosario-ba-trip-detail-compare.js antes|despues');
    process.exit(1);
  }

  const outPath = path.join(OUT_DIR, `rosario_ba_trip_detail_${label}_2026.png`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const trip = {
    ...MOCK_TRIP_DETAIL,
    user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
    from_town: 'Rosario, Santa Fe',
    to_town: 'Buenos Aires',
    description: 'Viaje directo por autopista — captura comparativa mapa'
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'es-AR',
    timezoneId: 'UTC'
  });
  const page = await context.newPage();

  await freezeClock(page);
  await setupApiOnlyCatchAll(page);
  await setupCommonMocks(page);
  await setupAuthState(page);

  await page.route(`**/api/trips/${TRIP_ID}`, (route) => {
    const url = route.request().url();
    if (url.endsWith(`/api/trips/${TRIP_ID}`)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: trip })
      });
    } else {
      route.continue();
    }
  });

  await page.goto(`http://localhost:8080/trips/${TRIP_ID}`);
  await waitForPageReady(page);

  await page.getByText(/Rosario/i).first().waitFor({ state: 'visible', timeout: 20000 });
  await page.getByText(/Buenos Aires/i).first().waitFor({ state: 'visible', timeout: 20000 });

  await waitForMapReady(page);
  await page.locator('.trip-route-map').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  await waitForMapReady(page);
  await page.screenshot({ path: outPath, fullPage: true, animations: 'disabled' });

  await browser.close();
  console.log('Saved:', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
