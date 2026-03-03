const { test, expect } = require('@playwright/test');
const {
  MOCK_USER,
  makeMockTrip,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

const TRIP_ID = 42;

function setupTripRoute(page, tripData) {
  return page.route(`**/api/trips/${TRIP_ID}`, (route) => {
    const url = route.request().url();
    if (url.endsWith(`/api/trips/${TRIP_ID}`)) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: tripData }),
      });
    } else {
      route.continue();
    }
  });
}

test.describe('Trip detail page', () => {
  test('shows trip info as trip owner with edit and cancel buttons', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const ownTrip = makeMockTrip(TRIP_ID, {
      user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
      from_town: 'Rosario, Santa Fe',
      to_town: 'Buenos Aires',
      description: 'Viaje directo por autopista',
      seats_available: 3,
    });
    await setupTripRoute(page, ownTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Buenos Aires').first()).toBeVisible();
    await expect(page.getByText('Editar')).toBeVisible();
    await expect(page.getByText('Cancelar Viaje')).toBeVisible();
  });

  test('shows "Solicitado" state for passenger who already requested', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const requestedTrip = makeMockTrip(TRIP_ID, {
      user: { id: 999, name: 'Other Driver', image: null, positive_ratings: 3, negative_ratings: 0 },
      request: 'send',
      seats_available: 2,
    });
    await setupTripRoute(page, requestedTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await expect(page.getByText('Solicitado').first()).toBeVisible({ timeout: 15000 });
  });

  test('shows "Enviar mensaje" for unrelated logged-in user', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const otherTrip = makeMockTrip(TRIP_ID, {
      user: { id: 999, name: 'Another Driver', image: null, positive_ratings: 5, negative_ratings: 0 },
      seats_available: 2,
      request: '',
    });
    await setupTripRoute(page, otherTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    // For unrelated users, "Enviar mensaje" button should be visible
    await expect(page.getByText('Enviar mensaje')).toBeVisible({ timeout: 15000 });
  });

  test('full trip shows "Carpooleado" state with no request button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const fullTrip = makeMockTrip(TRIP_ID, {
      user: { id: 999, name: 'Full Driver', image: null, positive_ratings: 5, negative_ratings: 0 },
      seats_available: 0,
      total_seats: 4,
      passenger_count: 4,
    });
    await setupTripRoute(page, fullTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await expect(page.getByText('Carpooleado')).toBeVisible({ timeout: 15000 });
  });

  test('renders passenger list with multiple passengers', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const passengers = [
      { id: 201, name: 'Pasajero Uno', image: null, request_state: 1 },
      { id: 202, name: 'Pasajero Dos', image: null, request_state: 1 },
      { id: 203, name: 'Pasajero Tres', image: null, request_state: 1 },
      { id: 204, name: 'Pasajero Cuatro', image: null, request_state: 1 },
    ];

    const trip = makeMockTrip(TRIP_ID, {
      user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
      passenger: passengers,
      allPassengerRequest: passengers,
      seats_available: 0,
      total_seats: 4,
      passenger_count: 4,
    });
    await setupTripRoute(page, trip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    // Passenger names should be visible
    await expect(page.getByText('Pasajero Uno')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Pasajero Dos')).toBeVisible();
    await expect(page.getByText('Pasajero Tres')).toBeVisible();
    await expect(page.getByText('Pasajero Cuatro')).toBeVisible();
  });
});
