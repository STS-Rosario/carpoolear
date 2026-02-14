const { test, expect } = require('@playwright/test');

test.describe('Trips page', () => {
  test('loads and shows the trips container', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('.trips.container')).toBeVisible();
  });

  test('shows the search section', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.locator('.search-section')).toBeVisible();
  });
});
