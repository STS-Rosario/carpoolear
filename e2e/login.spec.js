const { test, expect } = require('@playwright/test');

test.describe('Login page', () => {
  test('shows the login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^contraseña$/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /iniciar sesión/i })
    ).toBeVisible();
  });

  test('can log in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/^email$/i).fill('user0@g.com');
    await page.getByLabel(/^contraseña$/i).fill('123456');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
  });
});
