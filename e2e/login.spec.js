const { test, expect } = require('@playwright/test');

test.describe('Login page', () => {
  test('shows the login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#txt_user')).toBeVisible();
    await expect(page.locator('#txt_password')).toBeVisible();
    await expect(page.locator('#btn_login')).toBeVisible();
  });

  test('can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#txt_user', 'user0@g.com');
    await page.fill('#txt_password', '123456');
    await page.click('#btn_login');

    // After login, should navigate away from /login
    await expect(page).not.toHaveURL(/\/login/);
  });
});
