const { test, expect } = require('@playwright/test');
const {
  makeMockTrip,
  paginated,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  setupGuestState,
  waitForPageReady,
} = require('./shared/mocks');

const TRIP_ID = 42;

function overrideTrips(page, trips) {
  return page.route(/\/api\/trips(\?.*)?$/, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(trips, 1, 1)),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });
}

function makeTripWithPointDetails(overrides = {}) {
  return makeMockTrip(TRIP_ID, {
    punto_partida: 'Terminal de Ómnibus',
    punto_llegada: 'Plaza Principal',
    user: {
      id: 101,
      name: 'Test Driver',
      image: null,
      positive_ratings: 5,
      negative_ratings: 0,
    },
    ...overrides,
  });
}

test.describe('Guest trip point visibility on /trips', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupGuestState(page);
  });

  test('hides punto partida and llegada on trip cards for guests', async ({ page }) => {
    await overrideTrips(page, [makeTripWithPointDetails()]);

    await page.goto('/trips');
    await waitForPageReady(page);

    await expect(page.locator('.trips.not-logged')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Rosario').first()).toBeVisible();
    await expect(page.getByText('Buenos Aires').first()).toBeVisible();
    await expect(page.getByText('Terminal de Ómnibus')).toHaveCount(0);
    await expect(page.getByText('Plaza Principal')).toHaveCount(0);
    await expect(page.locator('.trip-card-shell__point')).toHaveCount(0);
  });

  test('shows punto partida and llegada on trip cards for logged-in users', async ({
    page,
  }) => {
    await setupAuthState(page);
    await overrideTrips(page, [makeTripWithPointDetails()]);

    await page.goto('/trips');
    await waitForPageReady(page);

    await expect(page.getByText('Terminal de Ómnibus')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('Plaza Principal')).toBeVisible();
  });
});

test.describe('Guest trip detail access', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupGuestState(page);
  });

  test('redirects guests from /trips/:id to login', async ({ page }) => {
    await page.route(`**/api/trips/${TRIP_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: makeTripWithPointDetails() }),
      });
    });

    await page.goto(`/trips/${TRIP_ID}`);
    await waitForPageReady(page);

    await expect(page).toHaveURL(/\/login(?:\/)?(?:\?.*)?$/);
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByText('Terminal de Ómnibus')).toHaveCount(0);
  });

  test('redirects guests from /trips/:id/:location to login', async ({ page }) => {
    await page.route(`**/api/trips/${TRIP_ID}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: makeTripWithPointDetails() }),
      });
    });

    await page.goto(`/trips/${TRIP_ID}/rosario`);
    await waitForPageReady(page);

    await expect(page).toHaveURL(/\/login(?:\/)?(?:\?.*)?$/);
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
  });
});
