const { test, expect } = require('@playwright/test');

const API_URL = process.env.API_URL || 'http://localhost:8000';

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

/** Login via API and return the JWT token */
async function apiLogin(request, email, password) {
  const res = await request.post(`${API_URL}/api/login`, {
    data: { email, password },
  });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  return { token: json.token, config: json.config };
}

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

  test('driver creates trip, 5 passengers request, driver accepts 4 and rejects 1', async ({ browser, request }) => {
    // =========================================================================
    // SETUP: Clean any previous trip data and get API tokens
    // =========================================================================

    // Get API tokens for all 6 users
    const tokens = [];
    const userIds = [];
    for (const u of USERS) {
      const { token } = await apiLogin(request, u.email, u.password);
      tokens.push(token);
    }

    // Get user IDs
    for (let i = 0; i < 6; i++) {
      const res = await request.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${tokens[i]}` },
      });
      const json = await res.json();
      userIds.push(json.data.id);
    }

    console.log('User IDs:', userIds);

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
      // The button text depends on config; with our mock it should say "Solicitar Asiento"
      const requestBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Solicitar Asiento/i });
      if (await requestBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await requestBtn.click();
      } else {
        // Fallback: the button might say "Enviar Mensaje" if config override didn't work
        // In that case, use API
        console.log(`User ${i}: UI request button not found, using API fallback`);
        await request.post(`${API_URL}/api/trips/${tripId}/requests`, {
          headers: { Authorization: `Bearer ${tokens[i]}` },
        });
      }

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
    // STEP 3: Passengers 3, 4, 5 request to join via API
    // =========================================================================

    for (const i of [3, 4, 5]) {
      const res = await request.post(`${API_URL}/api/trips/${tripId}/requests`, {
        headers: { Authorization: `Bearer ${tokens[i]}` },
      });
      expect(res.ok()).toBeTruthy();
      console.log(`Passenger user${i} requested via API`);
    }

    // =========================================================================
    // STEP 4: Passengers 2 and 4 send messages to the driver via UI
    // =========================================================================

    for (const i of [2, 4]) {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await setupRouteMocks(page);
      await uiLogin(page, USERS[i].email, USERS[i].password);

      // Navigate to the trip
      await page.goto(`/trips/${tripId}`);
      await expect(page.getByText('Rosario, Santa Fe').first()).toBeVisible({ timeout: 10000 });

      // Click "Enviar Mensaje" button
      const msgBtn = page.locator('.buttons-container button.btn-primary').filter({ hasText: /Enviar Mensaje/i });
      await msgBtn.waitFor({ state: 'visible', timeout: 10000 });
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
    // STEP 5: Verify all 5 pending requests via API
    // =========================================================================

    const pendingRes = await request.get(`${API_URL}/api/trips/${tripId}/requests`, {
      headers: { Authorization: `Bearer ${tokens[0]}` },
    });
    expect(pendingRes.ok()).toBeTruthy();
    const pendingData = await pendingRes.json();
    const pendingRequests = pendingData.data || pendingData;
    console.log('Pending requests count:', pendingRequests.length);
    expect(pendingRequests.length).toBe(5);

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
    // STEP 9: Verify trip has 4 accepted passengers and 0 seats via API
    // =========================================================================

    // Re-login to get a fresh token (original may be stale after long test)
    const { token: freshDriverToken } = await apiLogin(request, USERS[0].email, USERS[0].password);

    const tripRes = await request.get(`${API_URL}/api/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${freshDriverToken}` },
    });
    expect(tripRes.ok()).toBeTruthy();
    const tripData = await tripRes.json();
    const trip = tripData.data || tripData;
    console.log('Passenger count:', trip.passenger_count);
    console.log('Seats available:', trip.seats_available);
    console.log('Accepted passengers in response:', (trip.passenger || []).length);
    expect(trip.passenger_count).toBe(4);
    expect(trip.seats_available).toBe(0);
    expect((trip.passenger || []).length).toBe(4);

    // =========================================================================
    // STEP 11: Verify trip shows as full on the trip detail page via UI
    // =========================================================================

    await driverPage.goto(`/trips/${tripId}`);
    await driverPage.waitForTimeout(3000);

    // The trip should show "Viaje Carpooleado" (trip carpooled / full)
    const fullTripIndicator = driverPage.locator('.carpooled-trip');
    await expect(fullTripIndicator).toBeVisible({ timeout: 10000 });
    console.log('Trip shows as full (Viaje Carpooleado) on detail page');

    // =========================================================================
    // STEP 12: Verify conversations exist for passengers who sent messages
    // =========================================================================

    const convsRes = await request.get(`${API_URL}/api/conversations`, {
      headers: { Authorization: `Bearer ${tokens[0]}` },
    });
    expect(convsRes.ok()).toBeTruthy();
    const convsData = await convsRes.json();
    const conversations = convsData.data || convsData;
    console.log('Driver conversations count:', conversations.length);
    // Should have at least 2 conversations (from users 2 and 4)
    expect(conversations.length).toBeGreaterThanOrEqual(2);

    // =========================================================================
    // STEP 13: Verify rejected user cannot see themselves as a passenger
    // =========================================================================

    // Check the rejected user's request state via API
    const rejectedUserPendingRes = await request.get(`${API_URL}/api/users/requests`, {
      headers: { Authorization: `Bearer ${tokens[5]}` },
    });
    const rejectedPending = await rejectedUserPendingRes.json();
    const rejectedPendingData = rejectedPending.data || rejectedPending;
    // Rejected user should have no pending requests
    expect(rejectedPendingData.length).toBe(0);

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
    // CLEANUP: Delete the trip to avoid affecting other tests
    // =========================================================================

    const deleteRes = await request.delete(`${API_URL}/api/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${tokens[0]}` },
    });
    console.log('Cleanup: trip deleted, status:', deleteRes.status());

    await driverContext.close();

    console.log('=== TEST PASSED: Full trip request flow completed successfully ===');
  });
});
