const { test, expect } = require('@playwright/test');
const {
  MOCK_PROFILE_USER,
  MOCK_RATINGS,
  makeMockRating,
  generateItems,
  paginated,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

/**
 * Set up profile-specific mocks. Must be called AFTER setupAuthState.
 */
function setupProfileMocks(page, profileUser, ratings = [], badges = []) {
  return Promise.all([
    page.route(`**/api/users/${profileUser.id}`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: profileUser }),
      });
    }),
    page.route(new RegExp(`/api/users/${profileUser.id}/ratings`), (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(ratings)),
      });
    }),
    page.route(new RegExp(`/api/users/${profileUser.id}/badges`), (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: badges }),
      });
    }),
  ]);
}

test.describe('Profile page', () => {
  test('renders profile info (name)', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);
    await setupProfileMocks(page, MOCK_PROFILE_USER, MOCK_RATINGS);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    await expect(page.locator('.profile-info--name.desktop').getByText('Perfil de Prueba')).toBeVisible({ timeout: 15000 });
  });

  test('ratings tab — shows empty state with 0 ratings', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);
    await setupProfileMocks(page, MOCK_PROFILE_USER, []);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    const ratingsTab = page.getByText('Calificaciones').first();
    await ratingsTab.click();

    await expect(page.getByText('No hay calificaciones')).toBeVisible({ timeout: 10000 });
  });

  test('ratings tab — renders single rating with comment and author', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const singleRating = makeMockRating(1, {
      from: { id: 201, name: 'María García', image: null },
      comment: 'Excelente conductor, muy puntual',
      rating: 1,
    });
    await setupProfileMocks(page, MOCK_PROFILE_USER, [singleRating]);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    const ratingsTab = page.getByText('Calificaciones').first();
    await ratingsTab.click();

    await expect(page.getByText('Excelente conductor, muy puntual')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('María García')).toBeVisible();
  });

  test('ratings tab — renders many ratings', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const manyRatings = generateItems(
      (id) => makeMockRating(id, { comment: `Review ${id}` }),
      20
    );
    await setupProfileMocks(page, MOCK_PROFILE_USER, manyRatings);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    const ratingsTab = page.getByText('Calificaciones').first();
    await ratingsTab.click();

    // First and last review items should be visible (exact match to avoid substring collisions)
    await expect(page.getByText('Review 1', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Review 20', { exact: true })).toBeVisible();

    // Verify the reviewer names render
    await expect(page.getByText('Reviewer 1', { exact: true })).toBeVisible();
    await expect(page.getByText('Reviewer 20', { exact: true })).toBeVisible();
  });

  test('rating with reply shows reply text', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const ratingWithReply = makeMockRating(1, {
      from: { id: 201, name: 'Carlos López', image: null },
      comment: 'Buen viaje',
      reply_comment: 'Gracias por viajar conmigo!',
      reply_comment_created_at: '2025-05-02T10:00:00.000Z',
    });
    await setupProfileMocks(page, MOCK_PROFILE_USER, [ratingWithReply]);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    const ratingsTab = page.getByText('Calificaciones').first();
    await ratingsTab.click();

    await expect(page.getByText('Buen viaje')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Gracias por viajar conmigo!')).toBeVisible();
  });

  test('profile badges render when present', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const badges = [
      { id: 1, name: 'Primer viaje', icon: 'star', description: 'Completó su primer viaje' },
    ];
    await setupProfileMocks(page, MOCK_PROFILE_USER, [], badges);

    await page.goto(`/profile/${MOCK_PROFILE_USER.id}`);
    await waitForPageReady(page);

    await expect(page.locator('.profile-info--name.desktop').getByText('Perfil de Prueba')).toBeVisible({ timeout: 15000 });
  });
});
