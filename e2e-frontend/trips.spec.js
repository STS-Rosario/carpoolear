const { test, expect } = require('@playwright/test');
const {
  makeMockTrip,
  paginated,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
  generateItems,
} = require('./shared/mocks');

/**
 * Override the trips search endpoint. Must be called AFTER setupCommonMocks
 * so this route takes priority (Playwright: last registered route wins).
 */
function overrideTrips(page, trips, totalPages = 1) {
  return page.route(/\/api\/trips(\?.*)?$/, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(trips, 1, totalPages)),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });
}

test.describe('Trips search page', () => {
  test('shows empty state when there are 0 trips', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);
    // Override AFTER setup so it takes priority
    await overrideTrips(page, []);

    await page.goto('/trips');
    await waitForPageReady(page);

    const alert = page.locator('.alert.alert-warning');
    await expect(alert.first()).toBeVisible({ timeout: 10000 });
  });

  test('renders a single trip card when there is 1 trip', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const singleTrip = makeMockTrip(1, {
      from_town: 'Rosario, Santa Fe',
      to_town: 'Buenos Aires',
      user: { id: 101, name: 'Test Driver', image: null, positive_ratings: 5, negative_ratings: 0 },
      seats_available: 3,
    });
    await overrideTrips(page, [singleTrip]);

    await page.goto('/trips');
    await waitForPageReady(page);

    await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Buenos Aires').first()).toBeVisible();

    // No "loading more" indicator (single page)
    await expect(page.locator('.more-trips-loading')).not.toBeVisible();
  });

  test('renders many trips when paginated (total_pages > 1)', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const trips = generateItems((id) => makeMockTrip(id), 20);
    await overrideTrips(page, trips, 5);

    await page.goto('/trips');
    await waitForPageReady(page);

    await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 10000 });
  });

  test('trip cards display correct from/to towns and driver name', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const trip = makeMockTrip(1, {
      user: { id: 101, name: 'Ana Fernández', image: null, positive_ratings: 8, negative_ratings: 1 },
      seats_available: 2,
    });
    await overrideTrips(page, [trip]);

    await page.goto('/trips');
    await waitForPageReady(page);

    // Trip card displays addresses from points[], not from_town/to_town
    await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Buenos Aires').first()).toBeVisible();
    await expect(page.getByText('Ana Fernández')).toBeVisible();
  });

  test('full trip shows .trip-fill class when seats_available is 0', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const fullTrip = makeMockTrip(1, {
      seats_available: 0,
      passenger_count: 4,
      total_seats: 4,
    });
    await overrideTrips(page, [fullTrip]);

    await page.goto('/trips');
    await waitForPageReady(page);

    const tripFill = page.locator('.trip-fill');
    await expect(tripFill).toBeVisible({ timeout: 10000 });
  });
});
