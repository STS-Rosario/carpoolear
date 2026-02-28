const { test, expect } = require('@playwright/test');
const { dismissOverlays, uiLogin } = require('./helpers');

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
 *    "Solicitar Asiento" opens a conversation instead of making a direct seat
 *    request, which is a fundamentally different user flow than what this test covers
 */
async function setupRouteMocks(page) {
  // Mock autocomplete API (backend nodes_geo table may be empty)
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

  // Mock trip-info API (backend may not have route calculation data)
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

  // Override module_coordinate_by_message so "Solicitar Asiento" makes a direct
  // seat request instead of opening a conversation (a different user flow)
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
  test.setTimeout(300000); // 5 minutes for the full multi-user flow

  test('driver creates trip, 5 passengers request, driver accepts 4 and rejects 1', async ({ browser }) => {
    // =========================================================================
    // CLEANUP: Remove leftover trips from previous failed runs via UI
    // =========================================================================

    const cleanupCtx = await browser.newContext();
    const cleanupPage = await cleanupCtx.newPage();
    await setupRouteMocks(cleanupPage);
    await uiLogin(cleanupPage, USERS[DRIVER_IDX].email, USERS[DRIVER_IDX].password);

    await cleanupPage.goto('/my-trips');
    await cleanupPage.waitForTimeout(3000);

    cleanupPage.on('dialog', async (dialog) => { await dialog.accept(); });

    let deleteBtn = cleanupPage.locator('button[aria-label="Eliminar viaje"]').first();
    while (await deleteBtn.isVisible().catch(() => false)) {
      await deleteBtn.click();
      await cleanupPage.waitForTimeout(3000);
      deleteBtn = cleanupPage.locator('button[aria-label="Eliminar viaje"]').first();
    }

    await cleanupCtx.close();

    // =========================================================================
    // STEP 1: Driver (user9) creates a trip with 4 seats via UI
    // =========================================================================

    const driverContext = await browser.newContext();
    const driverPage = await driverContext.newPage();
    await setupRouteMocks(driverPage);
    await uiLogin(driverPage, USERS[DRIVER_IDX].email, USERS[DRIVER_IDX].password);

    // Navigate to create trip
    await driverPage.getByRole('link', { name: /crear viaje/i }).click();
    await expect(driverPage).toHaveURL(/\/trips\/create/, { timeout: 10000 });

    // Select driver type
    await driverPage.click('label[for="type-driver"]');

    // Fill origin: Rosario
    const originInput = driverPage.locator('.trip_point').first().locator('.osm-autocomplete input');
    await originInput.click();
    await originInput.pressSequentially('Rosario', { delay: 50 });
    const originResult = driverPage.locator('.trip_point').first().locator('.osm-autocomplete-results button').first();
    await originResult.waitFor({ state: 'visible', timeout: 15000 });
    await originResult.click();

    // Fill destination: Mendoza
    const destInput = driverPage.locator('.trip_point').last().locator('.osm-autocomplete input');
    await destInput.click();
    await destInput.pressSequentially('Mendoza', { delay: 50 });
    const destResult = driverPage.locator('.trip_point').last().locator('.osm-autocomplete-results button').first();
    await destResult.waitFor({ state: 'visible', timeout: 15000 });
    await destResult.click();

    // Select date - pick a future date
    await driverPage.locator('.vdp-datepicker__calendar-button').click();
    const futureDays = driverPage.locator('.vdp-datepicker__calendar .cell.day:not(.disabled):not(.selected)');
    await futureDays.first().waitFor({ state: 'visible' });
    await futureDays.last().click();

    // Fill time
    await driverPage.fill('#time', '14:00');

    // Select 4 seats (to accept exactly 4 passengers)
    await driverPage.click('label[for="seats-four"]');

    // Fill description
    await driverPage.fill('#trp_comment', 'Viaje de prueba e2e - 4 asientos disponibles');

    // Check non-profit commitment
    await driverPage.click('label[for="no-lucrar"]');

    // Submit
    await driverPage.click('button.trip-create');

    // Wait for redirect to trip detail
    await expect(driverPage).toHaveURL(/\/trips\/\d+/, { timeout: 15000 });
    const tripUrl = driverPage.url();
    const tripId = tripUrl.match(/\/trips\/(\d+)/)[1];
    console.log('Created trip ID:', tripId);

    // Verify trip details are shown
    await expect(driverPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });
    await expect(driverPage.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 15000 });

    // =========================================================================
    // STEP 2: Passengers 1-5 request to join via UI
    // =========================================================================

    for (const i of [1, 2, 3, 4, 5]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      // Navigate to the trip (full page reload may re-trigger onboarding)
      await page.goto(`/trips/${tripId}`);
      await dismissOverlays(page);
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

      // Click "Solicitar Asiento" button
      const requestBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      await requestBtn.waitFor({ state: 'visible', timeout: 5000 });
      await requestBtn.click();

      // Wait for the request to be processed
      await page.waitForTimeout(2000);

      // If a hint modal appeared, confirm the request through it
      const modalRequestBtn = page.locator('.modal-content button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      if (await modalRequestBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await modalRequestBtn.click();
        await page.waitForTimeout(2000);
      }

      console.log(`Passenger user${i} requested via UI`);
      await ctx.close();
    }

    // =========================================================================
    // STEP 3: Driver views pending requests on my-trips page via UI
    // =========================================================================

    await driverPage.goto('/my-trips');
    await expect(driverPage).toHaveURL(/\/my-trips/, { timeout: 10000 });

    // Wait for pending requests section to load
    await driverPage.waitForSelector('.pending-buttons', { timeout: 15000 });

    // Count the pending request cards
    const pendingCards = driverPage.locator('.rate-pending_component');
    const pendingCount = await pendingCards.count();
    expect(pendingCount).toBeGreaterThanOrEqual(5);
    console.log(`Driver sees ${pendingCount} pending requests on my-trips page (at least 5 from this test)`);

    // =========================================================================
    // STEP 4: Driver accepts first 4 requests and rejects the 5th via UI
    // =========================================================================

    // Accept the first 4 requests
    for (let acceptIdx = 0; acceptIdx < 4; acceptIdx++) {
      // Each time we accept, the card is removed from DOM, so always pick the first one
      const acceptBtn = driverPage.locator('.pending-buttons .btn-accept-request').first();
      await acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
      await acceptBtn.click();

      // Handle the hint modal if it appears (carpoodatos hint for accepting)
      const modalAcceptBtn = driverPage.locator('.modal-content .btn-accept-request');
      if (await modalAcceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await modalAcceptBtn.click();
      }

      // Wait for the request to be processed and card removed
      await driverPage.waitForTimeout(2000);
      console.log(`Driver accepted request #${acceptIdx + 1}`);
    }

    // Now reject the last remaining request
    const rejectBtn = driverPage.locator('.pending-buttons .btn-primary').filter({ hasText: /Rechazar/i }).first();
    await rejectBtn.waitFor({ state: 'visible', timeout: 10000 });
    await rejectBtn.click();
    await driverPage.waitForTimeout(2000);
    console.log('Driver rejected the 5th request');

    // =========================================================================
    // STEP 5: Verify no more pending requests
    // =========================================================================

    await driverPage.waitForTimeout(2000);

    // Reload to get fresh state
    await driverPage.goto('/my-trips');
    await driverPage.waitForTimeout(3000);

    const remainingPending = driverPage.locator('.pending-buttons');
    const remainingCount = await remainingPending.count();
    expect(remainingCount).toBe(0);
    console.log('No more pending requests on my-trips page');

    // =========================================================================
    // STEP 6: Verify trip is full with 4 passengers via UI
    // =========================================================================

    await driverPage.goto(`/trips/${tripId}`);
    await driverPage.waitForTimeout(3000);

    // The trip should show "Viaje Carpooleado" (trip carpooled / full)
    const fullTripIndicator = driverPage.locator('.carpooled-trip');
    await expect(fullTripIndicator).toBeVisible({ timeout: 10000 });
    console.log('Trip shows as full (Viaje Carpooleado) on detail page');

    // Verify 4 accepted passengers are listed
    const passengerItems = driverPage.locator('.passengers .list-item');
    await expect(passengerItems).toHaveCount(4, { timeout: 10000 });
    console.log('Trip shows 4 accepted passengers');

    // Verify 0 seats available in the seats display
    const seatsText = driverPage.locator('.trip_seats-available_value');
    await expect(seatsText).toContainText('0', { timeout: 5000 });
    console.log('Trip shows 0 seats available');

    // =========================================================================
    // STEP 7: Verify rejected user cannot see themselves as a passenger
    // =========================================================================

    const rejectedCtx = await browser.newContext();
    const rejectedPage = await rejectedCtx.newPage();
    await setupRouteMocks(rejectedPage);
    await uiLogin(rejectedPage, USERS[5].email, USERS[5].password);

    // Navigate to the trip page
    await rejectedPage.goto(`/trips/${tripId}`);
    await dismissOverlays(rejectedPage);
    await expect(rejectedPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

    // Rejected user should NOT see "Cancelar" or "Bajarme" (which would indicate they're a passenger)
    const cancelBtn = rejectedPage.locator('.buttons-container button').filter({ hasText: /Cancelar|Bajarme/i });
    await expect(cancelBtn).toHaveCount(0, { timeout: 5000 });
    console.log('Rejected user does not see passenger actions on trip page');

    await rejectedCtx.close();

    // =========================================================================
    // STEP 8: Verify an accepted passenger can see the trip in their trips
    // =========================================================================

    const passengerCtx = await browser.newContext();
    const passengerPage = await passengerCtx.newPage();
    await setupRouteMocks(passengerPage);
    await uiLogin(passengerPage, USERS[1].email, USERS[1].password);

    await passengerPage.goto('/my-trips');
    await passengerPage.waitForTimeout(3000);

    // The trip should appear in passenger's trips
    await expect(passengerPage.getByText('Mendoza').first()).toBeVisible({ timeout: 10000 });
    console.log('Accepted passenger sees the trip in their my-trips');

    await passengerCtx.close();

    // =========================================================================
    // CLEANUP: Delete the trip via UI
    // =========================================================================

    await driverPage.goto(`/trips/${tripId}`);
    await driverPage.waitForTimeout(2000);

    // Handle the confirmation dialog that appears when canceling a trip
    driverPage.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Click the "Cancelar Viaje" link (rendered as an <a> tag with btn class)
    const cancelTripBtn = driverPage.locator('.buttons-container a.btn').filter({ hasText: /Cancelar Viaje/i });
    await cancelTripBtn.waitFor({ state: 'visible', timeout: 10000 });
    await cancelTripBtn.click();

    // Wait for the trip to be deleted and verify redirect
    await driverPage.waitForTimeout(3000);
    console.log('Cleanup: trip deleted via UI');

    await driverContext.close();

    console.log('=== TEST PASSED: Full trip request flow completed successfully ===');
  });
});
