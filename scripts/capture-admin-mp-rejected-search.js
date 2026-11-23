/**
 * Captures admin MP rejections list with search (for informe / PR).
 *
 * Usage (dev server on http://localhost:8080):
 *   node scripts/capture-admin-mp-rejected-search.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');
const {
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
  MOCK_ADMIN_USER
} = require('../e2e-frontend/shared/mocks');

const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');
const BASE_URL = process.env.CAPTURE_BASE_URL || 'http://localhost:8080';

const MOCK_ROWS = [
  {
    id: 1,
    user_id: 80,
    user_name: 'María García',
    user_nro_doc: '30123456',
    reject_reason: 'dni_mismatch',
    user_identity_validated: false,
    review_status: 'pending',
    created_at: '2026-02-12T10:00:00.000Z'
  },
  {
    id: 2,
    user_id: 81,
    user_name: 'Juan Pérez',
    user_nro_doc: '28999111',
    reject_reason: 'name_mismatch',
    user_identity_validated: false,
    review_status: 'pending',
    created_at: '2026-02-11T09:00:00.000Z'
  }
];

function filterRows(q) {
  const term = String(q || '').trim().toLowerCase();
  if (!term) {
    return MOCK_ROWS;
  }
  return MOCK_ROWS.filter((row) => {
    if (String(row.id) === term || String(row.user_id) === term) {
      return true;
    }
    return (
      (row.user_name || '').toLowerCase().includes(term) ||
      (row.user_nro_doc || '').includes(term)
    );
  });
}

function listPayload(q) {
  const data = filterRows(q);
  return {
    data,
    meta: {
      pagination: {
        current_page: 1,
        total_pages: 1,
        per_page: 100,
        total: data.length
      }
    }
  };
}

async function registerMpRejectedMock(page) {
  await page.route('**/api/admin/mercado-pago-rejected-validations**', (route) => {
    if (route.request().method() !== 'GET') {
      route.fulfill({ status: 405, body: '{}' });
      return;
    }
    const url = new URL(route.request().url());
    const q = url.searchParams.get('q');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(listPayload(q))
    });
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const adminUser = {
    ...MOCK_ADMIN_USER,
    admin_permissions: ['admin.identity.mp.review', 'admin.dashboard.view']
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires'
  });
  const page = await context.newPage();

  await freezeClock(page);
  await setupCatchAllMock(page);
  await setupCommonMocks(page);
  await registerMpRejectedMock(page);
  await setupAuthState(page, adminUser);

  await page.goto(`${BASE_URL}/admin/mercado-pago-rejected-validations`);
  await waitForPageReady(page);
  await page.getByRole('heading', { name: /rechazos verificación mercado pago/i }).waitFor();

  const listaPath = path.join(OUT_DIR, 'mp_rechazos_busqueda_lista.png');
  await page.locator('.admin-mp-rejected-filters').waitFor({ state: 'visible' });
  await page.screenshot({ path: listaPath, fullPage: true });
  console.log(`Saved ${listaPath}`);

  const searchInput = page.locator('#admin-mp-rejected-search');
  await searchInput.fill('María');
  await page.getByRole('button', { name: /^buscar$/i }).click();
  await page.getByRole('cell', { name: 'María García' }).waitFor({ state: 'visible' });
  await page.getByRole('cell', { name: 'Juan Pérez' }).waitFor({ state: 'hidden' });

  const filtradoPath = path.join(OUT_DIR, 'mp_rechazos_busqueda_filtrado.png');
  await page.screenshot({ path: filtradoPath, fullPage: true });
  console.log(`Saved ${filtradoPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});