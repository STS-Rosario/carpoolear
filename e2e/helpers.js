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
 * Log in via API and inject the token into localStorage so the app recognises the session.
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 */
export async function loginViaAPI(page, email = 'user0@g.com', password = '123456') {
    const res = await page.request.post('http://localhost:8000/api/login', {
        data: { email, password },
    });
    const body = await res.json();
    const token = body.token;

    await page.goto('/');
    await page.evaluate((t) => {
        localStorage.setItem('TOKEN', t);
    }, token);
    return token;
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
 * Get the JWT token from the page's localStorage.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
export async function getToken(page) {
    return page.evaluate(() => localStorage.getItem('TOKEN'));
}

/**
 * Install autocomplete API mocks so trip creation works without real geo data.
 * @param {import('@playwright/test').Page} page
 */
/**
 * Create a trip via the API. Returns { tripId, token }.
 * @param {import('@playwright/test').Page} page
 * @param {string} token - JWT token
 * @param {object} [overrides] - Override default trip data
 */
export async function createTripViaAPI(page, token, overrides = {}) {
    const futureDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const defaultData = {
        is_passenger: 0,
        from_town: 'Rosario, Santa Fe',
        to_town: 'Córdoba, Córdoba',
        trip_date: futureDate,
        trip_time: '14:00',
        total_seats: 3,
        friendship_type_id: 2,
        estimated_time: '05:00',
        distance: 400,
        co2: 50,
        description: 'E2E test trip',
        return_trip: 0,
        points: [
            {
                address: 'Rosario, Santa Fe',
                json_address: { name: 'Rosario', ciudad: 'Rosario', provincia: 'Santa Fe', lat: -32.9468, lng: -60.6393 },
                lat: -32.9468,
                lng: -60.6393,
            },
            {
                address: 'Córdoba, Córdoba',
                json_address: { name: 'Córdoba', ciudad: 'Córdoba', provincia: 'Córdoba', lat: -31.4201, lng: -64.1888 },
                lat: -31.4201,
                lng: -64.1888,
            },
        ],
        ...overrides,
    };

    const tripRes = await page.request.post('http://localhost:8000/api/trips', {
        headers: { Authorization: `Bearer ${token}` },
        data: defaultData,
    });
    const tripBody = await tripRes.json();
    const tripId = tripBody.data?.id || tripBody.id;
    return { tripId, tripBody };
}

/**
 * Install autocomplete API mocks so trip creation works without real geo data.
 * @param {import('@playwright/test').Page} page
 */
export async function mockAutocomplete(page) {
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
}
