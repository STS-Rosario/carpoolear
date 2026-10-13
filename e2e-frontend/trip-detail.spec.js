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

  test('shows withdraw seat request action for passenger who already requested', async ({ page }) => {
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

    await expect(
      page.getByRole('button', { name: /retirar solicitud de asiento/i }).first()
    ).toBeVisible({ timeout: 15000 });
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

  test('shows seat requests warning link for driver with pending requests', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const ownTripWithRequests = makeMockTrip(TRIP_ID, {
      user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
      passengerPending_count: 2,
      seats_available: 3,
    });
    await setupTripRoute(page, ownTripWithRequests);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    const warningLink = page.getByRole('link', {
      name: 'Tenés pedidos de asiento de pasajeros para este viaje, revisalos en Tus Viajes',
    });
    await expect(warningLink).toBeVisible({ timeout: 15000 });
    await expect(warningLink).toHaveAttribute('href', '/my-trips');
  });

  test('does not show seat requests warning when driver has no pending requests', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const ownTripWithoutRequests = makeMockTrip(TRIP_ID, {
      user: { ...MOCK_USER, positive_ratings: 5, negative_ratings: 0 },
      passengerPending_count: 0,
      seats_available: 3,
    });
    await setupTripRoute(page, ownTripWithoutRequests);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await expect(
      page.getByRole('link', {
        name: 'Tenés pedidos de asiento de pasajeros para este viaje, revisalos en Tus Viajes',
      })
    ).toHaveCount(0);
  });

  test('renders passenger list with multiple passengers', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const passengers = [
      { id: 201, name: 'Pasajero Uno', first_name: 'Pasajero Uno', image: null, request_state: 1 },
      { id: 202, name: 'Pasajero Dos', first_name: 'Pasajero Dos', image: null, request_state: 1 },
      { id: 203, name: 'Pasajero Tres', first_name: 'Pasajero Tres', image: null, request_state: 1 },
      { id: 204, name: 'Pasajero Cuatro', first_name: 'Pasajero Cuatro', image: null, request_state: 1 },
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

  test('on mobile, car details sit below the driver instead of squishing the name', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const otherTrip = makeMockTrip(TRIP_ID, {
      user: {
        id: 999,
        name: 'Ayelen Seifo',
        image: null,
        positive_ratings: 11,
        negative_ratings: 0,
      },
      from_town: 'Mar del Plata',
      to_town: 'Rosario',
      car: {
        patente: 'AE322FE',
        brand_name: 'FERRARI',
        model_name: 'F 612',
        year: 2011,
      },
    });
    await setupTripRoute(page, otherTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    const name = page.locator('.trip-driver__mobile-name');
    const car = page.locator('.trip-driver__car');
    await expect(name).toBeVisible({ timeout: 15000 });
    await expect(car).toBeVisible();
    await expect(page.getByText('F 612 2011')).toBeVisible();

    const nameBox = await name.boundingBox();
    const carBox = await car.boundingBox();
    expect(nameBox).toBeTruthy();
    expect(carBox).toBeTruthy();
    expect(carBox.y).toBeGreaterThan(nameBox.y + nameBox.height - 2);
    expect(nameBox.height).toBeLessThan(40);

    const lines = page.locator('.trip-driver__car .trip-car-details__line');
    await expect(lines).toHaveCount(3);
    const firstLine = await lines.nth(0).boundingBox();
    const lastLine = await lines.nth(2).boundingBox();
    expect(firstLine).toBeTruthy();
    expect(lastLine).toBeTruthy();
    expect(Math.abs(firstLine.y - lastLine.y)).toBeLessThan(8);
    expect(lastLine.x).toBeGreaterThan(firstLine.x);
  });

  test('on desktop, car details stay beside the driver', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const otherTrip = makeMockTrip(TRIP_ID, {
      user: {
        id: 999,
        name: 'Ayelen Seifo',
        image: null,
        positive_ratings: 11,
        negative_ratings: 0,
      },
      car: {
        patente: 'AC700UH',
        brand_name: 'VOLKSWAGEN',
        model_name: 'SAVEIRO PICK - UP CROSS',
        year: 2018,
      },
    });
    await setupTripRoute(page, otherTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    const name = page.locator('.trip-driver__mobile-name');
    const car = page.locator('.trip-driver__car');
    await expect(name).toBeVisible({ timeout: 15000 });
    await expect(car).toBeVisible();

    const nameBox = await name.boundingBox();
    const carBox = await car.boundingBox();
    expect(nameBox).toBeTruthy();
    expect(carBox).toBeTruthy();
    expect(carBox.x).toBeGreaterThan(nameBox.x + nameBox.width);
    expect(Math.abs(carBox.y - nameBox.y)).toBeLessThan(24);
  });

  test('share message includes origin and destination', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);
    await page.addInitScript(() => {
      window.__sharedPayloads = [];
      navigator.share = async (payload) => {
        window.__sharedPayloads.push(payload);
      };
    });

    const otherTrip = makeMockTrip(TRIP_ID, {
      user: { id: 999, name: 'Other Driver', image: null, positive_ratings: 5, negative_ratings: 0 },
      from_town: 'Mar del Plata',
      to_town: 'Rosario',
    });
    await setupTripRoute(page, otherTrip);

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await page.getByTestId('trip-detail-share').click();
    const payloads = await page.evaluate(() => window.__sharedPayloads);
    expect(payloads[0].text).toMatch(/de Mar del Plata a Rosario/);
  });
});
