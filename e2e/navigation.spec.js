const { test, expect } = require('@playwright/test');

test.describe('Authenticated navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('#txt_user', 'user0@g.com');
    await page.fill('#txt_password', '123456');
    await page.click('#btn_login');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  });

  test('redirects to trips after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/trips/);
  });

  test('header shows authenticated links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /crear viaje/i })).toBeVisible();
  });
});
