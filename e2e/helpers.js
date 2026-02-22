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
    // Navigate to any page first, clear session, then go to login
    await page.goto('/trips', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.clear());
    // Reload to ensure the app re-initializes without cached auth
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.locator('#txt_user').waitFor({ state: 'visible', timeout: 15000 });
    await page.fill('#txt_user', email);
    await page.fill('#txt_password', password);
    await page.click('#btn_login');
    // Wait for redirect away from login page (to /trips typically)
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
}

/**
 * Wait for the 3-second splash screen overlay to disappear.
 * The splash is a fixed overlay (z-index 9999) that appears on every page load.
 * @param {import('@playwright/test').Page} page
 */
export async function waitForSplash(page) {
    const splash = page.locator('.custom-splash-screen');
    await splash.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
}

/**
 * Navigate to a URL and wait for the splash screen to disappear.
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 */
export async function navigateTo(page, url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await waitForSplash(page);
}

/**
 * Dismiss the onboarding overlay if it appears after login.
 * @param {import('@playwright/test').Page} page
 */
export async function dismissOnboarding(page) {
    const onboarding = page.locator('.on-boarding--overlay');
    if (await onboarding.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Click through "Siguiente" steps (use .first() for strict mode)
        for (let i = 0; i < 10; i++) {
            const nextBtn = page.locator('.on-boarding--overlay button.btn-primary').first();
            if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await nextBtn.click({ timeout: 3000 }).catch(() => {});
                await page.waitForTimeout(800);
            } else {
                break;
            }
        }
        const comenzar = page.locator('.on-boarding--overlay button.btn-success').first();
        if (await comenzar.isVisible({ timeout: 1000 }).catch(() => false)) {
            await comenzar.click({ timeout: 3000 }).catch(() => {});
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

// ---------------------------------------------------------------------------
// API-based helpers for fast setup/teardown (avoid slow UI for non-UI tests)
// ---------------------------------------------------------------------------

const API_BASE = 'http://localhost:8000';

/**
 * Login via API and inject the token into localStorage.
 * Returns { token, userId }.
 */
export async function loginViaAPI(page, email = 'user0@g.com', password = '123456') {
    const res = await page.request.post(`${API_BASE}/api/login`, {
        data: { email, password },
    });
    const json = await res.json();
    const token = json.token;
    // /api/login doesn't return user object, so fetch it separately
    const meRes = await page.request.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const meJson = await meRes.json();
    const userId = meJson.data?.id || meJson.id;
    // Ensure we're on a page so localStorage is accessible
    if (page.url() === 'about:blank') {
        await page.goto('/trips', { waitUntil: 'domcontentloaded' });
    }
    await page.evaluate((t) => localStorage.setItem('TOKEN', t), token);
    return { token, userId };
}

/**
 * Create a trip via API. Returns the trip object from the response.
 */
export async function createTripViaAPI(page, token, opts = {}) {
    const futureDate = new Date(Date.now() + 14 * 86400000);
    const dateStr = futureDate.toISOString().split('T')[0];
    const data = {
        is_passenger: 0,
        trip_date: opts.trip_date || `${dateStr} 14:00:00`,
        total_seats: opts.total_seats || 2,
        friendship_type_id: 2, // PRIVACY_PUBLIC – visible to all users
        description: opts.description || 'Viaje e2e via API',
        return_trip: 0,
        from_town: opts.from_town || 'Rosario, Santa Fe',
        to_town: opts.to_town || 'Mendoza, Mendoza',
        from_lat: -32.9468,
        from_lng: -60.6393,
        to_lat: -32.8895,
        to_lng: -68.8458,
        points: [
            { lat: -32.9468, lng: -60.6393, address: 'Rosario, Santa Fe', json_address: { id: 1, name: 'Rosario, Santa Fe' } },
            { lat: -32.8895, lng: -68.8458, address: 'Mendoza, Mendoza', json_address: { id: 2, name: 'Mendoza, Mendoza' } },
        ],
        estimated_time: '05:00',
        distance: 400,
        co2: 50,
        ...opts,
    };
    const res = await page.request.post(`${API_BASE}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
    const json = await res.json();
    if (json.errors || json.message?.includes('Could not')) {
        // If banned or hit trip limit, unban via tinker (resets banned flag +
        // deletes recent trips to avoid immediate re-ban) and retry
        const { execSync } = await import('child_process');
        const backendDir = new URL('../../carpoolear_backend', import.meta.url).pathname;
        try {
            execSync(
                `docker compose exec -T app php artisan tinker --execute="` +
                `\\STS\\Models\\User::where('banned',true)->update(['banned'=>false]);` +
                `echo 'OK';"`,
                { cwd: backendDir, timeout: 15000, encoding: 'utf-8' }
            );
        } catch (e) { /* ignore */ }
        const retry = await page.request.post(`${API_BASE}/api/trips`, {
            headers: { Authorization: `Bearer ${token}` },
            data,
        });
        const retryJson = await retry.json();
        if (retryJson.data?.id || retryJson.id) {
            return retryJson.data || retryJson;
        }
        throw new Error(`createTripViaAPI failed: ${JSON.stringify(json)} | retry: ${JSON.stringify(retryJson)}`);
    }
    return json.data || json;
}

/**
 * Request a seat on a trip via API.
 */
export async function requestSeatViaAPI(page, token, tripId) {
    const res = await page.request.post(`${API_BASE}/api/trips/${tripId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok()) {
        const body = await res.text();
        console.warn(`requestSeatViaAPI failed (${res.status()}):`, body.substring(0, 200));
    }
    return res.json();
}

/**
 * Accept a passenger via API.
 */
export async function acceptPassengerViaAPI(page, driverToken, tripId, userId) {
    const res = await page.request.post(`${API_BASE}/api/trips/${tripId}/requests/${userId}/accept`, {
        headers: { Authorization: `Bearer ${driverToken}` },
    });
    if (!res.ok()) {
        const body = await res.text();
        console.warn(`acceptPassengerViaAPI failed (${res.status()}):`, body.substring(0, 200));
    }
    return res.json();
}

/**
 * Cancel/remove a passenger via API.
 */
export async function cancelPassengerViaAPI(page, token, tripId, userId) {
    const res = await page.request.post(`${API_BASE}/api/trips/${tripId}/requests/${userId}/cancel`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok()) {
        const body = await res.text();
        console.warn(`cancelPassengerViaAPI failed (${res.status()}):`, body.substring(0, 200));
    }
    return res.json();
}

/**
 * Send a friend request via API.
 */
export async function sendFriendRequestViaAPI(page, token, userId) {
    const res = await page.request.post(`${API_BASE}/api/friends/request/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

/**
 * Accept a friend request via API.
 */
export async function acceptFriendViaAPI(page, token, userId) {
    const res = await page.request.post(`${API_BASE}/api/friends/accept/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

/**
 * Delete/unfriend a user via API.
 */
export async function deleteFriendViaAPI(page, token, userId) {
    const res = await page.request.post(`${API_BASE}/api/friends/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}

/**
 * Create a conversation and send a message via API. Returns conversation object.
 */
export async function createConversationViaAPI(page, token, toUserId, text) {
    const convRes = await page.request.post(`${API_BASE}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { to: toUserId },
    });
    const conv = await convRes.json();
    const convId = conv.id || conv.data?.id;
    if (!convId) {
        console.warn('createConversationViaAPI: no conversation id returned', JSON.stringify(conv));
    }
    if (convId && text) {
        const sendRes = await page.request.post(`${API_BASE}/api/conversations/${convId}/send`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { message: text },
        });
        const sendJson = await sendRes.json().catch(() => ({}));
        if (!sendRes.ok()) {
            console.warn('send message failed:', JSON.stringify(sendJson));
        }
    }
    return conv;
}

/**
 * Create a subscription via API.
 */
export async function createSubscriptionViaAPI(page, token, data = {}) {
    const futureDate = new Date(Date.now() + 7 * 86400000);
    const dateStr = futureDate.toISOString().split('T')[0];
    const payload = {
        is_passenger: true,
        trip_date: data.trip_date || `${dateStr} 10:00:00`,
        from_address: data.from_address || 'Rosario, Santa Fe',
        from_lat: data.from_lat || -32.9468,
        from_lng: data.from_lng || -60.6393,
        to_address: data.to_address || 'Mendoza, Mendoza',
        to_lat: data.to_lat || -32.8895,
        to_lng: data.to_lng || -68.8458,
        ...data,
    };
    const res = await page.request.post(`${API_BASE}/api/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
        data: payload,
    });
    return res.json();
}

/**
 * Delete a subscription via API.
 */
export async function deleteSubscriptionViaAPI(page, token, id) {
    const res = await page.request.delete(`${API_BASE}/api/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res;
}

/**
 * Rate a user via API.
 * @param {object} data - { comment, rating } where rating is 1 (positive) or -1 (negative)
 */
export async function rateUserViaAPI(page, token, tripId, userId, data) {
    const res = await page.request.post(`${API_BASE}/api/trips/${tripId}/rate/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data,
    });
    if (!res.ok()) {
        const body = await res.text();
        console.warn(`rateUserViaAPI failed (${res.status()}):`, body.substring(0, 200));
        return { error: true, status: res.status() };
    }
    return res.json();
}

/**
 * Override /api/login and /api/config responses to disable payment modals and
 * coordinate-by-message so seat requests work directly.
 */
export async function setupConfigOverride(page, overrides = {}) {
    const defaults = {
        module_coordinate_by_message: false,
        disable_user_hints: true,
        ...overrides,
    };
    await page.route('**/api/login', async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        if (json.config) Object.assign(json.config, defaults);
        await route.fulfill({ response, json });
    });
    await page.route('**/api/config', async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        if (json.config) Object.assign(json.config, defaults);
        else Object.assign(json, defaults);
        await route.fulfill({ response, json });
    });
}

/**
 * Unban a user via artisan tinker. Used when trip creation limit is exceeded mid-test.
 */
export async function unbanUserViaTinker(token) {
    const { execSync } = await import('child_process');
    const backendDir = new URL('../../carpoolear_backend', import.meta.url).pathname;
    const cmd = `docker compose exec -T app php artisan tinker --execute="` +
        `\\STS\\Models\\User::where('banned',true)->update(['banned'=>false]);echo 'OK';"`;
    try {
        execSync(cmd, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
    } catch (err) {
        console.warn('unbanUserViaTinker failed:', err.message);
    }
}

/**
 * Backdate a trip via artisan tinker (for testing ratings which require past trips).
 */
export async function backdateTripViaTinker(tripId) {
    const { execSync } = await import('child_process');
    const backendDir = new URL('../../carpoolear_backend', import.meta.url).pathname;
    const pastDate = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 19).replace('T', ' ');
    const cmd = `docker compose exec -T app php artisan tinker --execute="` +
        `\\STS\\Models\\Trip::find(${tripId})->update(['trip_date'=>'${pastDate}']);echo 'OK';"`;
    try {
        execSync(cmd, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
    } catch (err) {
        console.warn('backdateTripViaTinker failed:', err.message);
    }
}

/**
 * Run the rate:create artisan command to generate pending ratings for past trips.
 * Must be called AFTER backdating a trip that has accepted passengers.
 */
export async function triggerRateCreation() {
    const { execSync } = await import('child_process');
    const backendDir = new URL('../../carpoolear_backend', import.meta.url).pathname;
    const cmd = `docker compose exec -T app php artisan rate:create`;
    try {
        const output = execSync(cmd, { cwd: backendDir, timeout: 15000, encoding: 'utf-8' });
        return output;
    } catch (err) {
        console.warn('triggerRateCreation failed:', err.message);
    }
}

/**
 * Set a boolean user property via API (e.g. autoaccept_requests).
 */
export async function setUserPropertyViaAPI(page, token, property, value) {
    const res = await page.request.post(`${API_BASE}/api/users/change/${property}/${value}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}
