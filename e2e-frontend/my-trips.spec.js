const { test, expect } = require('@playwright/test');
const {
  MOCK_USER,
  MOCK_PENDING_RATINGS,
  makeMockTrip,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

test.describe('My Trips page', () => {
  test('pending requests section is hidden when there are 0 (hideOnEmpty)', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    await page.goto('/my-trips');
    await waitForPageReady(page);

    // With 0 pending requests, the section is entirely hidden (hideOnEmpty: true)
    await expect(page.getByText('No tenés viajes creados')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Pendientes de contestar')).not.toBeVisible();
  });

  test('shows 1 pending request with accept/reject buttons', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    // The driver trip that the pending request references
    const driverTrip = makeMockTrip(10, {
      user: MOCK_USER,
      from_town: 'Rosario, Santa Fe',
      to_town: 'Buenos Aires',
      points: [
        { lat: -32.9468, lng: -60.6393, address: 'Rosario, Santa Fe', json_address: { name: 'Rosario, Santa Fe', ciudad: 'Rosario' } },
        { lat: -34.6037, lng: -58.3816, address: 'Buenos Aires', json_address: { name: 'Buenos Aires', ciudad: 'Buenos Aires' } },
      ],
    });

    const pendingRequest = {
      id: 1,
      user: { id: 201, name: 'Laura Martínez', image: null },
      trip_id: 10,
      request_state: 0,
      created_at: '2025-06-10T10:00:00.000Z',
    };

    // Override AFTER setupAuthState so these take priority
    await page.route('**/api/users/requests', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [pendingRequest] }),
      });
    });

    // Driver trips must include the trip referenced by the pending request
    // (MyTrips uses findTrip(r.trip_id) to look up the trip in driver trips)
    await page.route('**/api/users/get-trips**', (route) => {
      const url = route.request().url();
      if (url.includes('as_driver=1') || url.includes('as_driver=true')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [driverTrip] }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
    });

    await page.goto('/my-trips');
    await waitForPageReady(page);

    // Pending request section should appear
    await expect(page.getByText('Pendientes de contestar')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Laura Martínez')).toBeVisible();

    // Accept and reject buttons should be present
    await expect(page.locator('.btn-accept-request').first()).toBeVisible();
    await expect(page.getByText('Rechazar').first()).toBeVisible();
  });

  test('shows multiple pending requests with correct user info', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const driverTrip10 = makeMockTrip(10, {
      user: MOCK_USER,
      points: [
        { lat: -32.9468, lng: -60.6393, address: 'Rosario', json_address: { name: 'Rosario', ciudad: 'Rosario' } },
        { lat: -34.6037, lng: -58.3816, address: 'Buenos Aires', json_address: { name: 'Buenos Aires', ciudad: 'Buenos Aires' } },
      ],
    });
    const driverTrip11 = makeMockTrip(11, {
      user: MOCK_USER,
      points: [
        { lat: -32.9468, lng: -60.6393, address: 'Rosario', json_address: { name: 'Rosario', ciudad: 'Rosario' } },
        { lat: -31.4201, lng: -64.1888, address: 'Córdoba', json_address: { name: 'Córdoba', ciudad: 'Córdoba' } },
      ],
    });

    const requests = [
      { id: 1, user: { id: 201, name: 'Laura Martínez', image: null }, trip_id: 10, request_state: 0, created_at: '2025-06-10T10:00:00.000Z' },
      { id: 2, user: { id: 202, name: 'Pedro García', image: null }, trip_id: 10, request_state: 0, created_at: '2025-06-09T10:00:00.000Z' },
      { id: 3, user: { id: 203, name: 'Ana López', image: null }, trip_id: 11, request_state: 0, created_at: '2025-06-08T10:00:00.000Z' },
    ];

    await page.route('**/api/users/requests', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: requests }),
      });
    });

    await page.route('**/api/users/get-trips**', (route) => {
      const url = route.request().url();
      if (url.includes('as_driver=1') || url.includes('as_driver=true')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [driverTrip10, driverTrip11] }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
    });

    await page.goto('/my-trips');
    await waitForPageReady(page);

    await expect(page.getByText('Laura Martínez')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Pedro García')).toBeVisible();
    await expect(page.getByText('Ana López')).toBeVisible();
  });

  test('shows "No tenés viajes creados" when there are 0 driver trips', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    await page.goto('/my-trips');
    await waitForPageReady(page);

    await expect(page.getByText('No tenés viajes creados')).toBeVisible({ timeout: 10000 });
  });

  test('renders driver trips when present', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const driverTrips = [
      makeMockTrip(10, {
        user: MOCK_USER,
        from_town: 'Rosario, Santa Fe',
        to_town: 'Buenos Aires',
      }),
    ];

    // Override AFTER setupAuthState
    await page.route('**/api/users/get-trips**', (route) => {
      const url = route.request().url();
      if (url.includes('as_driver=1') || url.includes('as_driver=true')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: driverTrips }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
    });

    await page.goto('/my-trips');
    await waitForPageReady(page);

    await expect(page.getByText('Buenos Aires').first()).toBeVisible({ timeout: 10000 });
  });

  test('shows pending ratings section when there is 1 pending rating', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    // Override AFTER setupAuthState
    await page.route('**/api/users/ratings/pending', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_PENDING_RATINGS }),
      });
    });

    await page.goto('/my-trips');
    await waitForPageReady(page);

    await expect(page.getByText('Calificaciones pendientes')).toBeVisible({ timeout: 10000 });
  });

  test('pending ratings section is hidden when there are 0 (hideOnEmpty)', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    await page.goto('/my-trips');
    await waitForPageReady(page);

    await expect(page.getByText('No tenés viajes creados')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Calificaciones pendientes')).not.toBeVisible();
  });
});
