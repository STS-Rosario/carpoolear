const { test, expect } = require('@playwright/test');

test.describe('Trips page', () => {
  test('loads and shows trip search', async ({ page }) => {
    await page.goto('/trips');
    await expect(
      page.getByRole('heading', {
        name: /encontrá tu próximo viaje|encuentra tu próximo viaje|find your next trip/i,
      })
    ).toBeVisible({ timeout: 15000 });
  });

  test('shows origin and destination search fields', async ({ page }) => {
    await page.goto('/trips');
    await expect(page.getByPlaceholder(/^origen$/i).first()).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByPlaceholder(/^destino$/i).first()).toBeVisible();
  });
});
