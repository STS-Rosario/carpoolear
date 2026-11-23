/**
 * Capturas para informe #38: pegar teléfono en admin edit user.
 *
 * Usage (dev server on http://localhost:8080):
 *   node scripts/capture-admin-phone-paste-informe.js
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');
const {
    freezeClock,
    setupCatchAllMock,
    setupCommonMocks,
    setupAuthState,
    MOCK_ADMIN_USER,
    MOCK_USER,
    waitForPageReady
} = require('../e2e-frontend/shared/mocks');

const OUT_DIR = path.resolve(__dirname, '../../interno/Imaganes');
const BASE_URL = process.env.CAPTURE_BASE_URL || 'http://localhost:8080';
const PASTE_SAMPLE = '+5493415551234';

const EDIT_USER = {
    ...MOCK_USER,
    id: 80,
    name: 'Usuario Admin Edit',
    email: 'edit-target@g.com',
    mobile_phone: '',
    nro_doc: '32123456'
};

async function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        locale: 'es-AR',
        timezoneId: 'America/Argentina/Buenos_Aires',
        permissions: ['clipboard-read', 'clipboard-write']
    });
    const page = await context.newPage();

    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page, {
        ...MOCK_ADMIN_USER,
        admin_permissions: ['admin.users.search', 'admin.users.edit']
    });

    await page.route(`**/api/users/${EDIT_USER.id}`, (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: EDIT_USER })
        });
    });

    await page.goto(`${BASE_URL}/admin/users/${EDIT_USER.id}/edit`);
    await waitForPageReady(page);

    const phone = page.locator('#input-phone');
    await phone.waitFor({ state: 'visible', timeout: 30000 });
    await phone.click();

    const antesPath = path.join(OUT_DIR, 'admin_telefono_pegar_antes.png');
    await phone.screenshot({ path: antesPath });

    await phone.fill('');
    await page.evaluate(async (text) => {
        await navigator.clipboard.writeText(text);
    }, PASTE_SAMPLE);
    await phone.focus();
    await page.keyboard.press('Control+V');

    await page.waitForFunction(
        (expected) => {
            const el = document.getElementById('input-phone');
            return el && el.value === expected;
        },
        '5493415551234',
        { timeout: 10000 }
    );

    const despuesPath = path.join(OUT_DIR, 'admin_telefono_pegar_despues.png');
    await phone.screenshot({ path: despuesPath });

    console.log(`Saved ${antesPath}`);
    console.log(`Saved ${despuesPath} (pasted ${PASTE_SAMPLE})`);

    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});