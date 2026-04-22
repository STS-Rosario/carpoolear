const { test, expect } = require('@playwright/test');
const {
  setupCatchAllMock,
  setupCommonMocks,
  waitForPageReady,
} = require('./shared/mocks');

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    // Keep init-script mock: Register.vue injects Google's script which would replace it.
    await page.route('https://www.google.com/recaptcha/**', route => route.abort());
    await page.route('https://www.gstatic.com/recaptcha/**', route => route.abort());

    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    // Mock reCAPTCHA so it doesn't block form submission
    await page.addInitScript(() => {
      window.grecaptcha = {
        ready(cb) { cb(); },
        execute() { return Promise.resolve('mock-recaptcha-token'); },
      };
    });
  });

  test('renders registration form with all required fields', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);

    // If Facebook is enabled, click the email button first
    const emailBtn = page.locator('#btn_show_register');
    if (await emailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailBtn.click();
    }

    await expect(page.locator('#txt_name')).toBeVisible();
    await expect(page.locator('#txt_surename')).toBeVisible();
    await expect(page.locator('#txt_email')).toBeVisible();
    await expect(page.locator('#txt_email_verification')).toBeVisible();
    await expect(page.locator('#txt_password')).toBeVisible();
    await expect(page.locator('#txt_password_confirmation')).toBeVisible();
    await expect(page.locator('#cbx_terms')).toBeVisible();
  });

  test('shows validation errors on empty required fields', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);

    const emailBtn = page.locator('#btn_show_register');
    if (await emailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailBtn.click();
    }

    // Accept terms so the submit button is enabled
    await page.locator('#cbx_terms').check();

    // Click submit with all empty fields
    await page.locator('button[name="ipt_submit"]').click();

    // Should show .has-error class on required fields
    const errors = page.locator('.has-error');
    await expect(errors.first()).toBeVisible({ timeout: 5000 });

    // At least name, surname, email, password should have errors
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThanOrEqual(4);
  });

  test('shows email mismatch error when emails do not match', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);

    const emailBtn = page.locator('#btn_show_register');
    if (await emailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailBtn.click();
    }

    await page.locator('#txt_name').fill('Test');
    await page.locator('#txt_surename').fill('User');
    await page.locator('#txt_email').fill('test@example.com');
    await page.locator('#txt_email_verification').fill('different@example.com');
    await page.locator('#txt_password').fill('12345678');
    await page.locator('#txt_password_confirmation').fill('12345678');
    await page.locator('#cbx_terms').check();

    await page.locator('button[name="ipt_submit"]').click();

    // Should show error indicator — either has-error class or error span
    await page.waitForTimeout(500);
    const hasErrors = page.locator('.has-error');
    await expect(hasErrors.first()).toBeVisible({ timeout: 5000 });
  });

  test('shows success state after successful registration', async ({ page }) => {
    // Register user creation mock AFTER setup
    await page.route('**/api/users', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { id: 100, name: 'Test User', active: false } }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/register');
    await waitForPageReady(page);

    const emailBtn = page.locator('#btn_show_register');
    if (await emailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailBtn.click();
    }

    await page.locator('#txt_name').fill('Test');
    await page.locator('#txt_surename').fill('User');
    await page.locator('#txt_email').fill('test@example.com');
    await page.locator('#txt_email_verification').fill('test@example.com');
    await page.locator('#txt_password').fill('12345678');
    await page.locator('#txt_password_confirmation').fill('12345678');
    await page.locator('#cbx_terms').check();

    await page.locator('button[name="ipt_submit"]').click();

    // Success state should appear
    const success = page.locator('.register-success');
    await expect(success).toBeVisible({ timeout: 10000 });
    await expect(success.locator('h2')).toContainText('Exitoso');
  });
});
