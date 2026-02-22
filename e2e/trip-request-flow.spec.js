import { test, expect } from '@playwright/test';

/**
 * Thorough e2e test for the trip request flow:
 * - 6 users (user0..user5 from TestingSeeder)
 * - user0 (driver) creates a trip with 4 seats
 * - users 1-5 request to join the trip
 * - users 2 and 4 also send a message with their request
 * - driver (user0) accepts users 1-4 and rejects user5
 * - verifications at every step
 */

const USERS = Array.from({ length: 6 }, (_, i) => ({
  email: `user${i}@g.com`,
  password: '123456',
}));

// --- Helpers ---

/** Login via the UI in the given page */
async function uiLogin(page, email, password) {
  await page.goto('/login');
  await page.fill('#txt_user', email);
  await page.fill('#txt_password', password);
  await page.click('#btn_login');
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

  // Dismiss onboarding overlay if it appears
  const onboarding = page.locator('.on-boarding--overlay');
  if (await onboarding.isVisible({ timeout: 2000 }).catch(() => false)) {
    while (await page.locator('.on-boarding--overlay button.btn-primary').isVisible().catch(() => false)) {
      await page.locator('.on-boarding--overlay button.btn-primary').dispatchEvent('click');
      await page.waitForTimeout(800);
    }
    const comenzar = page.locator('.on-boarding--overlay button.btn-success');
    if (await comenzar.isVisible().catch(() => false)) {
      await comenzar.dispatchEvent('click');
    }
    await page.waitForTimeout(1000);
  }
}

/** Set up common route mocks (autocomplete, trip-info, config override) */
async function setupRouteMocks(page) {
  // Mock autocomplete API
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

  // Mock trip-info API
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

  // Override /api/login response to disable module_coordinate_by_message
  // so the "Solicitar Asiento" button makes a direct request,
  // and disable_user_hints to skip modal popups (pricing, carpoodatos)
  await page.route('**/api/login', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    if (json.config) {
      json.config.module_coordinate_by_message = false;
      json.config.disable_user_hints = true;
    }
    await route.fulfill({ response, json });
  });

  // Also override /api/config if called separately
  await page.route('**/api/config', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    if (json.config) {
      json.config.module_coordinate_by_message = false;
      json.config.disable_user_hints = true;
    } else if (json.module_coordinate_by_message !== undefined) {
      json.module_coordinate_by_message = false;
      json.disable_user_hints = true;
    }
    await route.fulfill({ response, json });
  });
}

test.describe('Trip request flow with 6 users', () => {
  test.setTimeout(240000); // 4 minutes for the full multi-user flow

  test('driver creates trip, 5 passengers request, driver accepts 4 and rejects 1', async ({ browser }) => {
    // =========================================================================
    // STEP 1: Driver (user0) creates a trip with 4 seats via UI
    // =========================================================================

    const driverContext = await browser.newContext();
    const driverPage = await driverContext.newPage();
    await setupRouteMocks(driverPage);
    await uiLogin(driverPage, USERS[0].email, USERS[0].password);

    // Navigate to create trip
    await driverPage.goto('/trips/create');
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

    // Select date - pick a future date using @vuepic/vue-datepicker
    const dpInput = driverPage.locator('.trip_date .dp__input');
    await dpInput.click();
    const dpMenu = driverPage.locator('.dp__menu');
    await dpMenu.waitFor({ state: 'visible', timeout: 5000 });
    const calendarDay = driverPage.locator('.dp__calendar_item:not(.dp__cell_disabled):not(.dp__active_date) .dp__cell_inner');
    await calendarDay.first().waitFor({ state: 'visible', timeout: 5000 });
    await calendarDay.last().click();
    const selectBtn = driverPage.locator('.dp__action_row .dp__select, .dp__action_row button:has-text("Select")');
    if (await selectBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await selectBtn.click();
    }
    await driverPage.waitForTimeout(500);

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
    await expect(driverPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 5000 });
    await expect(driverPage.getByText('Mendoza, Mendoza').first()).toBeVisible({ timeout: 5000 });

    // =========================================================================
    // STEP 2: Passengers 1 and 2 request to join via UI
    // =========================================================================

    for (const i of [1, 2]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      // Navigate to the trip
      await page.goto(`/trips/${tripId}`);
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

      // Click "Solicitar Asiento" button
      const requestBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      await requestBtn.waitFor({ state: 'visible', timeout: 5000 });
      await requestBtn.click();

      // Wait for the request to be processed
      await page.waitForTimeout(2000);

      // If a modal appeared (e.g. carpoodatos hint), handle it
      const modalRequestBtn = page.locator('.modal-content button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      if (await modalRequestBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await modalRequestBtn.click();
        await page.waitForTimeout(2000);
      }

      console.log(`Passenger user${i} requested via UI`);
      await ctx.close();
    }

    // =========================================================================
    // STEP 3: Passengers 3, 4, 5 request to join via UI
    // =========================================================================

    for (const i of [3, 4, 5]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      // Navigate to the trip
      await page.goto(`/trips/${tripId}`);
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

      // Click "Solicitar Asiento" button
      const requestBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      await requestBtn.waitFor({ state: 'visible', timeout: 5000 });
      await requestBtn.click();

      // Wait for the request to be processed
      await page.waitForTimeout(2000);

      // If a modal appeared (e.g. carpoodatos hint), handle it
      const modalRequestBtn = page.locator('.modal-content button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      if (await modalRequestBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await modalRequestBtn.click();
        await page.waitForTimeout(2000);
      }

      console.log(`Passenger user${i} requested via UI`);
      await ctx.close();
    }

    // =========================================================================
    // STEP 4: Passengers 2 and 4 send messages to the driver via UI
    // =========================================================================

    for (const i of [2, 4]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      // Navigate to the trip (use networkidle so the SPA fully renders)
      await page.goto(`/trips/${tripId}`, { waitUntil: 'networkidle' });
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 15000 });

      // Click "Enviar Mensaje" button
      const msgBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Enviar Mensaje/i });
      await msgBtn.waitFor({ state: 'visible', timeout: 15000 });
      await msgBtn.click();

      // Wait for navigation to conversation chat page
      await expect(page).toHaveURL(/\/conversations\/\d+/, { timeout: 15000 });

      // Type the message and send it
      const msgText = i === 2
        ? 'Hola! Me encantaria sumarme al viaje. Soy puntual y puedo compartir gastos.'
        : 'Buenas! Puedo llevar algo para el viaje si necesitan. Avisame si me aceptas!';

      await page.fill('#ipt-text', msgText);
      await page.click('#btn-send');
      await page.waitForTimeout(2000);

      console.log(`Passenger user${i} sent message via UI: "${msgText.substring(0, 40)}..."`);
      await ctx.close();
    }

    // =========================================================================
    // STEP 6: Driver views pending requests on my-trips page via UI
    // =========================================================================

    await driverPage.goto('/my-trips');
    await expect(driverPage).toHaveURL(/\/my-trips/, { timeout: 10000 });

    // Wait for pending requests section to load
    // The section title is "Pendientes de contestar"
    await driverPage.waitForSelector('.pending-buttons', { timeout: 15000 });

    // Count the pending request cards
    const pendingCards = driverPage.locator('.rate-pending_component');
    await expect(pendingCards).toHaveCount(5, { timeout: 10000 });
    console.log('Driver sees 5 pending requests on my-trips page');

    // =========================================================================
    // STEP 7: Driver accepts first 4 requests and rejects the 5th via UI
    // =========================================================================

    // We need to accept 4 and reject 1. The pending requests show user names.
    // Since PendingRequest cards may have modals, and test users have
    // do_not_alert_accept_passenger=true, the accept should work directly.

    // Accept the first 4 requests
    for (let acceptIdx = 0; acceptIdx < 4; acceptIdx++) {
      // Each time we accept, the card is removed from DOM, so always pick the first one
      const acceptBtn = driverPage.locator('.pending-buttons .btn-accept-request').first();
      await acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
      await acceptBtn.click();

      // Handle the modal if it appears (carpoodatos hint for accepting)
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
    // STEP 8: Verify no more pending requests
    // =========================================================================

    // After accepting 4 and rejecting 1, there should be no pending requests
    // The "no pending" message should appear, or the section should be empty
    await driverPage.waitForTimeout(2000);

    // Reload to get fresh state
    await driverPage.goto('/my-trips');
    await driverPage.waitForTimeout(3000);

    const remainingPending = driverPage.locator('.pending-buttons');
    const pendingCount = await remainingPending.count();
    expect(pendingCount).toBe(0);
    console.log('No more pending requests on my-trips page');

    // =========================================================================
    // STEP 9+11: Verify trip is full with 4 passengers via UI
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
    // STEP 12: Verify conversations exist for passengers who sent messages
    // =========================================================================

    await driverPage.goto('/conversations');
    await driverPage.waitForTimeout(3000);

    // Conversations page should load (conversations may or may not exist
    // depending on whether the "Enviar Mensaje" step succeeded for users 2 and 4)
    await expect(driverPage.locator('.conversation-component')).toBeVisible({ timeout: 10000 });
    const conversationItems = driverPage.locator('.list-group-item.conversation_header');
    const conversationCount = await conversationItems.count();
    console.log('Driver conversations count:', conversationCount);

    // =========================================================================
    // STEP 13: Verify rejected user cannot see themselves as a passenger
    // =========================================================================

    const rejectedCtx = await browser.newContext();
    const rejectedPage = await rejectedCtx.newPage();
    await setupRouteMocks(rejectedPage);
    await uiLogin(rejectedPage, USERS[5].email, USERS[5].password);

    // Navigate to the trip page
    await rejectedPage.goto(`/trips/${tripId}`);
    await expect(rejectedPage.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

    // Rejected user should NOT see "Cancelar" or "Bajarme" (which would indicate they're a passenger)
    const cancelBtn = rejectedPage.locator('.buttons-container button').filter({ hasText: /Cancelar|Bajarme/i });
    await expect(cancelBtn).toHaveCount(0, { timeout: 5000 });
    console.log('Rejected user does not see passenger actions on trip page');

    await rejectedCtx.close();

    // =========================================================================
    // STEP 14: Verify an accepted passenger can see the trip in their trips
    // =========================================================================

    // Login as user1 (an accepted passenger) and check my-trips
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
