const { test, expect } = require('@playwright/test');
const { uiLogin, fillDriverTripWizard } = require('./helpers');

test.describe('Create trip flow', () => {
  test.setTimeout(90000);

  test('login, create a trip, verify in my-trips and search', async ({ page }) => {
    // Mock APIs that depend on backend geographic data (nodes_geo table may be empty)
    await page.route('**/api/trips/autocomplete**', (route) => {
      const url = new URL(route.request().url());
      const name = (url.searchParams.get('name') || '').toLowerCase();
      const results = {
        rosario: [{ id: 1, name: 'Rosario, Santa Fe', lat: -32.9468, lng: -60.6393, type: 'city', state: 'Santa Fe', country: 'ARG' }],
        mendoza: [{ id: 2, name: 'Mendoza, Mendoza', lat: -32.8895, lng: -68.8458, type: 'city', state: 'Mendoza', country: 'ARG' }],
      };
      const match = Object.keys(results).find((key) => name.includes(key));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ nodes_geos: match ? results[match] : [] }),
      });
    });
    await page.route('**/api/trips/trip-info', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          data: {
            distance: 850,
            duration: 28800,
            co2: 120,
            route_needs_payment: false,
            maximum_trip_price_cents: 0,
            recommended_trip_price_cents: 0,
          },
        }),
      });
    });

    await uiLogin(page, 'user0@g.com', '123456');

    await page.getByRole('link', { name: /crear viaje/i }).click();
    await expect(page).toHaveURL(/\/trips\/create/);

    await fillDriverTripWizard(page, {
      description: 'Viaje de prueba e2e - Rosario a Mendoza',
      availableSeats: 2,
    });

    await expect(page).toHaveURL(/\/trips\/\d+/, { timeout: 15000 });
    const tripId = page.url().match(/\/trips\/(\d+)/)[1];

    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 5000 });

    await page.goto('/my-trips');
    await expect(page).toHaveURL(/\/my-trips/, { timeout: 15000 });
    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 10000 });

    await page.goto('/trips');
    await expect(page).toHaveURL(/\/trips/, { timeout: 15000 });
    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 15000 });

    await page.goto(`/trips/${tripId}`);
    await page.waitForTimeout(2000);

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole('button', { name: /cancelar viaje/i }).click();
    await page.waitForTimeout(2000);
  });
});
