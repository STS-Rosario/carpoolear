const { test, expect } = require('@playwright/test');
const { dismissOverlays } = require('./helpers');

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

    // 1. Login
    await page.goto('/login');
    await page.fill('#txt_user', 'user0@g.com');
    await page.fill('#txt_password', '123456');
    await page.click('#btn_login');
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

    // 1b. Dismiss splash screen and onboarding through UI
    await dismissOverlays(page);

    // 2. Navigate to create trip
    await page.getByRole('link', { name: /crear viaje/i }).click();
    await expect(page).toHaveURL(/\/trips\/create/);

    // 3. Select driver type
    await page.click('label[for="type-driver"]');

    // 4. Fill origin: type "Rosario", wait for autocomplete, select first result
    const originInput = page.locator('.trip_point').first().locator('.osm-autocomplete input');
    await originInput.click();
    await originInput.pressSequentially('Rosario', { delay: 50 });
    const originResult = page.locator('.trip_point').first().locator('.osm-autocomplete-results button').first();
    await originResult.waitFor({ state: 'visible', timeout: 15000 });
    await originResult.click();

    // 5. Fill destination: type "Mendoza", wait for autocomplete, select first result
    const destInput = page.locator('.trip_point').last().locator('.osm-autocomplete input');
    await destInput.click();
    await destInput.pressSequentially('Mendoza', { delay: 50 });
    const destResult = page.locator('.trip_point').last().locator('.osm-autocomplete-results button').first();
    await destResult.waitFor({ state: 'visible', timeout: 15000 });
    await destResult.click();

    // 6. Select date: open calendar, pick a future day
    await page.locator('.vdp-datepicker__calendar-button').click();
    const futureDays = page.locator('.vdp-datepicker__calendar .cell.day:not(.disabled):not(.selected)');
    await futureDays.first().waitFor({ state: 'visible' });
    await futureDays.last().click();

    // 7. Fill time
    await page.fill('#time', '14:00');

    // 8. Select 2 seats
    await page.click('label[for="seats-two"]');

    // 9. Fill description
    await page.fill('#trp_comment', 'Viaje de prueba e2e - Rosario a Mendoza');

    // 10. Check non-profit commitment (required for driver trips)
    await page.click('label[for="no-lucrar"]');

    // 11. Submit
    await page.click('button.trip-create');

    // 12. Wait for redirect to trip detail page and capture trip ID
    await expect(page).toHaveURL(/\/trips\/\d+/, { timeout: 15000 });
    const tripId = page.url().match(/\/trips\/(\d+)/)[1];
    console.log('Created trip ID:', tripId);

    // 13. Verify trip detail shows the cities
    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 5000 });

    // 14. Navigate to my-trips
    await page.goto('/my-trips');
    await expect(page).toHaveURL(/\/my-trips/, { timeout: 15000 });

    // 15. Verify trip appears in my trips list
    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 10000 });

    // 16. Navigate to trips listing
    await page.goto('/trips');
    await expect(page).toHaveURL(/\/trips/, { timeout: 15000 });

    // 17. Verify the trip appears in the listing
    await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 15000 });

    // 18. Cleanup: delete the created trip via UI
    await page.goto(`/trips/${tripId}`);
    await page.waitForTimeout(2000);

    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const cancelTripBtn = page.locator('.buttons-container a.btn').filter({ hasText: /Cancelar Viaje/i });
    await cancelTripBtn.waitFor({ state: 'visible', timeout: 10000 });
    await cancelTripBtn.click();
    await page.waitForTimeout(2000);
  });
});
