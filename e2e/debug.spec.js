const { test, expect } = require('@playwright/test');

test.describe('Debug page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#txt_user', 'user0@g.com');
    await page.fill('#txt_password', '123456');
    await page.click('#btn_login');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('navigates to Debug page from Settings', async ({ page }) => {
    await page.goto('/setting');
    await page.getByRole('link', { name: /debug/i }).click();
    await expect(page).toHaveURL(/\/setting\/debug/);
  });

  test('shows debug mode state and toggle', async ({ page }) => {
    await page.goto('/setting/debug');
    await expect(page.getByText(/modo debug|debug mode/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /activar|enable|desactivar|disable/i })).toBeVisible();
  });

  test('shows debug info when available', async ({ page }) => {
    await page.goto('/setting/debug');
    const debugInfo = page.locator('#debug-info-pre, .debug-info-content');
    const unavailable = page.getByText(/no hay información|no debug information/i);
    const hasInfo = await debugInfo.count() > 0 && await debugInfo.first().isVisible();
    const hasUnavailable = await unavailable.isVisible();
    expect(hasInfo || hasUnavailable).toBeTruthy();
  });

  test('has copy button', async ({ page }) => {
    await page.goto('/setting/debug');
    await expect(page.getByRole('button', { name: /copiar|copy/i })).toBeVisible();
  });

  test('toggles debug mode', async ({ page }) => {
    await page.goto('/setting/debug');
    const toggleBtn = page.getByRole('button', { name: /activar|enable|desactivar|disable/i });
    await toggleBtn.click();
    await page.waitForTimeout(300);
    await toggleBtn.click();
    await page.waitForTimeout(300);
    await expect(page).toHaveURL(/\/setting\/debug/);
  });
});
