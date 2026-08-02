const { test, expect } = require('@playwright/test');
const {
  dismissOverlays,
  uiLogin,
  fillDriverTripWizard,
  deleteOwnedTripsFromMyTrips,
} = require('./helpers');

/**
 * Thorough e2e test for the trip request flow:
 * - Uses user9 as driver (isolated from other tests that use user0)
 * - users 1-5 request to join the trip
 * - driver accepts users 1-4 and rejects user5
 * - verifies trip is full, rejected user can't see passenger actions,
 *   accepted passenger sees trip in their trips
 */

const USERS = Array.from({ length: 10 }, (_, i) => ({
  email: `user${i}@g.com`,
  password: '123456',
}));

const DRIVER_IDX = 9;

/**
 * Set up route mocks for APIs that depend on backend data availability.
 *
 * Only two categories of mocks are used:
 * 1. Geographic data (autocomplete, trip-info) — the nodes_geo table may be empty
 * 2. module_coordinate_by_message=false — with the real value (true), clicking
 *    "Solicitar asiento" opens a conversation instead of making a direct seat
 *    request, which is a fundamentally different user flow than what this test covers
 */
async function setupRouteMocks(page) {
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

  await page.route('**/api/login', async (route) => {
    try {
      const response = await route.fetch();
      const json = await response.json();
      if (json.config) {
        json.config.module_coordinate_by_message = false;
      }
      await route.fulfill({ response, json });
    } catch { /* context disposed */ }
  });
  await page.route('**/api/config', async (route) => {
    try {
      const response = await route.fetch();
      const json = await response.json();
      if (json.config) {
        json.config.module_coordinate_by_message = false;
      } else if (json.module_coordinate_by_message !== undefined) {
        json.module_coordinate_by_message = false;
      }
      await route.fulfill({ response, json });
    } catch { /* context disposed */ }
  });
}

test.describe('Trip request flow with 6 users', () => {
  test.setTimeout(300000);

  test('driver creates trip, 5 passengers request, driver accepts 4 and rejects 1', async ({ browser }) => {
    const cleanupCtx = await browser.newContext();
    const cleanupPage = await cleanupCtx.newPage();
    await setupRouteMocks(cleanupPage);
    await uiLogin(cleanupPage, USERS[DRIVER_IDX].email, USERS[DRIVER_IDX].password);
    await deleteOwnedTripsFromMyTrips(cleanupPage);
    await cleanupCtx.close();

    const driverContext = await browser.newContext();
    const driverPage = await driverContext.newPage();
    await setupRouteMocks(driverPage);
    await uiLogin(driverPage, USERS[DRIVER_IDX].email, USERS[DRIVER_IDX].password);

    await driverPage.getByRole('link', { name: /crear viaje/i }).click();
    await expect(driverPage).toHaveURL(/\/trips\/create/, { timeout: 10000 });

    await fillDriverTripWizard(driverPage, {
      description: 'Viaje de prueba e2e - 4 asientos disponibles',
      availableSeats: 4,
    });

    await expect(driverPage).toHaveURL(/\/trips\/\d+/, { timeout: 15000 });
    const tripUrl = driverPage.url();
    const tripId = tripUrl.match(/\/trips\/(\d+)/)[1];

    await expect(driverPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(driverPage.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 15000 });

    for (const i of [1, 2, 3, 4, 5]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      await page.goto(`/trips/${tripId}`);
      await dismissOverlays(page);
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

      const requestBtn = page.getByRole('button', { name: /solicitar asiento/i });
      await requestBtn.waitFor({ state: 'visible', timeout: 5000 });
      await requestBtn.click();
      await page.waitForTimeout(2000);

      const modalRequestBtn = page.getByRole('button', { name: /solicitar asiento/i }).nth(1);
      if (await modalRequestBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await modalRequestBtn.click();
        await page.waitForTimeout(2000);
      }

      await ctx.close();
    }

    await driverPage.goto('/my-trips');
    await expect(driverPage).toHaveURL(/\/my-trips/, { timeout: 10000 });

    await expect(
      driverPage.getByText(/quiere subirse|wants to join/i).first()
    ).toBeVisible({ timeout: 15000 });

    const acceptButtons = driverPage.getByRole('button', { name: /^aceptar$/i });
    await expect(acceptButtons.first()).toBeVisible({ timeout: 10000 });
    expect(await acceptButtons.count()).toBeGreaterThanOrEqual(5);

    for (let acceptIdx = 0; acceptIdx < 4; acceptIdx++) {
      const acceptBtn = driverPage.getByRole('button', { name: /^aceptar$/i }).first();
      await acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
      await acceptBtn.click();

      const modalAcceptBtn = driverPage
        .getByRole('dialog')
        .getByRole('button', { name: /^aceptar$/i });
      if (await modalAcceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await modalAcceptBtn.click();
      }

      await driverPage.waitForTimeout(2000);
    }

    const rejectBtn = driverPage.getByRole('button', { name: /^rechazar$/i }).first();
    await rejectBtn.waitFor({ state: 'visible', timeout: 10000 });
    await rejectBtn.click();
    await driverPage.waitForTimeout(2000);

    await driverPage.goto('/my-trips');
    await driverPage.waitForTimeout(3000);
    await expect(driverPage.getByText(/quiere subirse|wants to join/i)).toHaveCount(0);

    await driverPage.goto(`/trips/${tripId}`);
    await driverPage.waitForTimeout(3000);

    await expect(driverPage.getByText(/carpooleado/i).first()).toBeVisible({
      timeout: 10000,
    });
    await expect(
      driverPage.getByText(/ya se sumaron|already joined/i)
    ).toBeVisible();
    // Passenger rows still use list markup without accessible names per person.
    await expect(driverPage.locator('.passengers .list-item')).toHaveCount(4, {
      timeout: 10000,
    });

    const rejectedCtx = await browser.newContext();
    const rejectedPage = await rejectedCtx.newPage();
    await setupRouteMocks(rejectedPage);
    await uiLogin(rejectedPage, USERS[5].email, USERS[5].password);

    await rejectedPage.goto(`/trips/${tripId}`);
    await dismissOverlays(rejectedPage);
    await expect(rejectedPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

    await expect(
      rejectedPage.getByRole('button', { name: /cancelar|bajarme/i })
    ).toHaveCount(0);

    await rejectedCtx.close();

    const passengerCtx = await browser.newContext();
    const passengerPage = await passengerCtx.newPage();
    await setupRouteMocks(passengerPage);
    await uiLogin(passengerPage, USERS[1].email, USERS[1].password);

    await passengerPage.goto('/my-trips');
    await passengerPage.waitForTimeout(3000);
    await expect(passengerPage.getByText('Mendoza').first()).toBeVisible({ timeout: 10000 });
    await passengerCtx.close();

    await driverPage.goto(`/trips/${tripId}`);
    await driverPage.waitForTimeout(2000);

    driverPage.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    await driverPage.getByRole('button', { name: /cancelar viaje/i }).click();
    await driverPage.waitForTimeout(3000);

    await driverContext.close();
  });
});
