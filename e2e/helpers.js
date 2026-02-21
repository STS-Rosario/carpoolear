/**
 * Shared helpers for Playwright e2e tests.
 */

/**
 * Log in as a test user via the UI.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 */
export async function login(page, email = 'user0@g.com', password = '123456') {
    // Navigate to app first, then clear any existing session so we can re-login
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('#txt_user').waitFor({ state: 'visible', timeout: 15000 });
    await page.fill('#txt_user', email);
    await page.fill('#txt_password', password);
    await page.click('#btn_login');
    // Wait for redirect away from login page (to /trips typically)
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
}

/**
 * Dismiss the onboarding overlay if it appears after login.
 * @param {import('@playwright/test').Page} page
 */
export async function dismissOnboarding(page) {
    const onboarding = page.locator('.on-boarding--overlay');
    if (await onboarding.isVisible({ timeout: 2000 }).catch(() => false)) {
        while (await page.locator('.on-boarding--overlay button.btn-primary').isVisible().catch(() => false)) {
            await page.locator('.on-boarding--overlay button.btn-primary').click();
            await page.waitForTimeout(800);
        }
        const comenzar = page.locator('.on-boarding--overlay button.btn-success');
        if (await comenzar.isVisible().catch(() => false)) {
            await comenzar.click();
        }
        await page.waitForTimeout(500);
    }
}

/**
 * Get the JWT token from the page's localStorage (for cleanup API calls only).
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
export async function getToken(page) {
    return page.evaluate(() => localStorage.getItem('TOKEN'));
}

/**
 * Install autocomplete and trip-info API mocks so trip creation works without real geo data.
 * The nodes_geo table may be empty in test environments, so we mock the autocomplete endpoint.
 * @param {import('@playwright/test').Page} page
 */
export async function setupAutocompleteMocks(page) {
    await page.route('**/api/trips/autocomplete**', (route) => {
        const url = new URL(route.request().url());
        const name = (url.searchParams.get('name') || '').toLowerCase();
        const results = {
            rosario: [{ id: 1, name: 'Rosario, Santa Fe', lat: -32.9468, lng: -60.6393, type: 'city', state: 'Santa Fe', country: 'ARG' }],
            mendoza: [{ id: 2, name: 'Mendoza, Mendoza', lat: -32.8895, lng: -68.8458, type: 'city', state: 'Mendoza', country: 'ARG' }],
            cordoba: [{ id: 3, name: 'Córdoba, Córdoba', lat: -31.4201, lng: -64.1888, type: 'city', state: 'Córdoba', country: 'ARG' }],
            buenos: [{ id: 4, name: 'Buenos Aires, Buenos Aires', lat: -34.6037, lng: -58.3816, type: 'city', state: 'Buenos Aires', country: 'ARG' }],
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
                    distance: 400,
                    duration: 18000,
                    co2: 50,
                    route_needs_payment: false,
                    maximum_trip_price_cents: 0,
                    recommended_trip_price_cents: 0,
                },
            }),
        });
    });
}

/**
 * Create a trip through the UI form. Returns the trip ID from the redirected URL.
 * Requires autocomplete mocks to be set up first (setupAutocompleteMocks).
 * @param {import('@playwright/test').Page} page
 * @param {object} [options]
 * @param {string} [options.origin='Rosario'] - Origin city to type
 * @param {string} [options.destination='Mendoza'] - Destination city to type
 * @param {string} [options.description='Viaje de prueba e2e'] - Trip description
 * @returns {Promise<string>} tripId
 */
export async function createTripViaUI(page, options = {}) {
    const { origin = 'Rosario', destination = 'Mendoza', description = 'Viaje de prueba e2e' } = options;

    // Navigate to create trip
    await page.goto('/trips/create');
    await page.waitForLoadState('networkidle');

    // Select driver type
    await page.click('label[for="type-driver"]');

    // Fill origin: type city name, wait for autocomplete results, click first result
    const originInput = page.locator('.trip_point').first().locator('.osm-autocomplete input');
    await originInput.click();
    await originInput.pressSequentially(origin, { delay: 80 });
    const originResult = page.locator('.trip_point').first().locator('.osm-autocomplete-results button').first();
    await originResult.waitFor({ state: 'visible', timeout: 15000 });
    await originResult.click();

    // Fill destination
    const destInput = page.locator('.trip_point').last().locator('.osm-autocomplete input');
    await destInput.click();
    await destInput.pressSequentially(destination, { delay: 80 });
    const destResult = page.locator('.trip_point').last().locator('.osm-autocomplete-results button').first();
    await destResult.waitFor({ state: 'visible', timeout: 15000 });
    await destResult.click();

    // Select date - try @vuepic/vue-datepicker first, fall back to native input
    const dpInput = page.locator('.trip_date .dp__input');
    const nativeDate = page.locator('#datepicker-mobile');
    if (await dpInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await dpInput.click();
        // Wait for calendar popup to open
        const dpMenu = page.locator('.dp__menu');
        await dpMenu.waitFor({ state: 'visible', timeout: 5000 });
        // Click a future day (not disabled, not already active/selected)
        const calendarDay = page.locator('.dp__calendar_item:not(.dp__cell_disabled):not(.dp__active_date) .dp__cell_inner');
        await calendarDay.first().waitFor({ state: 'visible', timeout: 5000 });
        await calendarDay.last().click();
        // If there's a select/apply button, click it
        const selectBtn = page.locator('.dp__action_row .dp__select, .dp__action_row button:has-text("Select")');
        if (await selectBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await selectBtn.click();
        }
        // Wait for calendar to close
        await page.waitForTimeout(500);
    } else if (await nativeDate.isVisible({ timeout: 2000 }).catch(() => false)) {
        const futureDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
        await nativeDate.fill(futureDate);
    }

    // Fill time
    await page.fill('#time', '14:00');

    // Select 2 seats
    await page.click('label[for="seats-two"]');

    // Fill description
    await page.fill('#trp_comment', description);

    // Check non-profit commitment (required for driver trips)
    const noLucrar = page.locator('#no-lucrar');
    if (!(await noLucrar.isChecked())) {
        await page.click('label[for="no-lucrar"]');
    }

    // Submit
    await page.click('button.trip-create');

    // Wait for redirect to trip detail page
    await page.waitForURL(/\/trips\/\d+/, { timeout: 20000 });
    const tripId = page.url().match(/\/trips\/(\d+)/)?.[1];
    return tripId;
}

/**
 * Delete a trip via API (for test cleanup only).
 * @param {import('@playwright/test').Page} page
 * @param {string} tripId
 * @param {string} token
 */
export async function deleteTripViaAPI(page, tripId, token) {
    if (tripId && token) {
        await page.request.delete(`http://localhost:8000/api/trips/${tripId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
