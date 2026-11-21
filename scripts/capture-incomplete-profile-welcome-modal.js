/**
 * Captura modal de bienvenida (perfil incompleto) en Editar perfil.
 *
 * Usage (dev server on http://localhost:8080):
 *   node scripts/capture-incomplete-profile-welcome-modal.js
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
  MOCK_USER
} = require('../e2e-frontend/shared/mocks');

const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');
const BASE_URL = process.env.CAPTURE_BASE_URL || 'http://localhost:8080';

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const incompleteUser = {
    ...MOCK_USER,
    name: 'juan malfo',
    image: '',
    description: ''
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
  await setupAuthState(page, incompleteUser);

  await page.goto(`${BASE_URL}/setting/profile?incompleteProfile=true`);
  await waitForPageReady(page);

  const modal = page.locator('#incompleteProfileWelcomeModal');
  await modal.waitFor({ state: 'visible', timeout: 30000 });
  await page.getByText(/foto real de perfil/i).waitFor({ state: 'visible' });

  const outPath = path.join(OUT_DIR, 'perfil_bienvenida_modal_despues.png');
  await modal.screenshot({ path: outPath });

  const viewportPath = path.join(OUT_DIR, 'perfil_bienvenida_modal_viewport_1280.png');
  await page.screenshot({ path: viewportPath });

  console.log(`Saved ${outPath}`);
  console.log(`Saved ${viewportPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});