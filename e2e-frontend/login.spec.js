const { test, expect } = require('@playwright/test');
const {
  setupCatchAllMock,
  setupCommonMocks,
  waitForPageReady,
} = require('./shared/mocks');

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
  });

  test('renders login form with email, password fields and login button', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);

    await expect(page.locator('#txt_user')).toBeVisible();
    await expect(page.locator('#txt_password')).toBeVisible();
    await expect(page.locator('#btn_login')).toBeVisible();
    await expect(page.locator('#btn_login')).toContainText('Ingresar');
  });

  test('shows error toast on invalid credentials (401)', async ({ page }) => {
    // Register login mock AFTER setup (last route wins in Playwright)
    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'invalid_credentials' }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await page.locator('#txt_user').fill('wrong@email.com');
    await page.locator('#txt_password').fill('wrongpassword');
    await page.locator('#btn_login').click();

    // alertifyjs toast should appear
    const toast = page.locator('.ajs-message');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
  });

  test('shows "user not active" alert when user is not activated', async ({ page }) => {
    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'user_not_active' }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await page.locator('#txt_user').fill('inactive@email.com');
    await page.locator('#txt_password').fill('123456');
    await page.locator('#btn_login').click();

    // Inline alert should appear for account activation
    const alert = page.locator('.alert.alert-info');
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText('activar');
  });

  test('shows "user banned" alert when user is banned', async ({ page }) => {
    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'user_banned' }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await page.locator('#txt_user').fill('banned@email.com');
    await page.locator('#txt_password').fill('123456');
    await page.locator('#btn_login').click();

    // Inline alert for banned user
    const alert = page.locator('.alert.alert-info');
    await expect(alert).toBeVisible({ timeout: 10000 });
    await expect(alert).toContainText('desactivada');
  });
});
