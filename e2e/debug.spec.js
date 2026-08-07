const { test, expect } = require('@playwright/test');
const { uiLogin } = require('./helpers');

test.describe('Debug page', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page, 'user0@g.com', '123456');
  });

  test('navigates to Debug page from Settings', async ({ page }) => {
    await page.goto('/setting');
    await page.getByRole('link', { name: /debug/i }).click();
    await expect(page).toHaveURL(/\/setting\/debug/);
  });

  test('shows debug mode state and toggle', async ({ page }) => {
    await page.goto('/setting/debug');
    await expect(page.getByText(/modo debug|debug mode/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /activar|enable|desactivar|disable/i })
    ).toBeVisible();
  });

  test('shows debug info when available', async ({ page }) => {
    await page.goto('/setting/debug');
    const unavailable = page.getByText(
      /no hay información|no debug information/i
    );
    const copyBtn = page.getByRole('button', { name: /copiar|copy/i });
    const hasInfo = await copyBtn.isVisible().catch(() => false);
    const hasUnavailable = await unavailable.isVisible().catch(() => false);
    expect(hasInfo || hasUnavailable).toBeTruthy();
  });

  test('has copy button', async ({ page }) => {
    await page.goto('/setting/debug');
    const unavailable = page.getByText(
      /no hay información|no debug information/i
    );
    if (await unavailable.isVisible().catch(() => false)) {
      test.skip();
      return;
    }
    await expect(
      page.getByRole('button', { name: /copiar|copy/i })
    ).toBeVisible();
  });

  test('toggles debug mode', async ({ page }) => {
    await page.goto('/setting/debug');
    const toggleBtn = page.getByRole('button', {
      name: /activar|enable|desactivar|disable/i,
    });
    await toggleBtn.click();
    await page.waitForTimeout(300);
    await toggleBtn.click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/\/setting\/debug/);
  });
});
