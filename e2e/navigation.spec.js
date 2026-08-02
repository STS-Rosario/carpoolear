const { test, expect } = require('@playwright/test');
const { uiLogin } = require('./helpers');

test.describe('Authenticated navigation', () => {
  test.beforeEach(async ({ page }) => {
    await uiLogin(page, 'user0@g.com', '123456');
  });

  test('redirects to trips after login', async ({ page }) => {
    await expect(page).toHaveURL(/\/trips/);
  });

  test('header shows authenticated links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /crear viaje/i })).toBeVisible();
  });
});
