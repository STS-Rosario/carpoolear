const { test, expect } = require('@playwright/test');
const {
  makeMockNotification,
  generateItems,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

/**
 * Override notifications endpoint. Must be called AFTER setupCommonMocks/setupAuthState.
 */
function overrideNotifications(page, notifications) {
  return page.route(/\/api\/notifications(\?.*)?$/, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: notifications }),
    });
  });
}

test.describe('Notifications page', () => {
  test('shows empty state when there are 0 notifications', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);
    await overrideNotifications(page, []);

    await page.goto('/notifications');
    await waitForPageReady(page);

    await expect(page.getByText('No hay notificaciones')).toBeVisible({ timeout: 10000 });
  });

  test('renders single notification item', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const notification = makeMockNotification(1, {
      text: 'María solicitó un asiento',
      readed: false,
    });
    await overrideNotifications(page, [notification]);

    await page.goto('/notifications');
    await waitForPageReady(page);

    await expect(page.getByText('María solicitó un asiento')).toBeVisible({ timeout: 10000 });
  });

  test('renders 25 notifications and shows "Siguiente" pagination button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const notifications = generateItems(
      (id) => makeMockNotification(id, { text: `Notification item ${id}` }),
      25
    );
    await overrideNotifications(page, notifications);

    await page.goto('/notifications');
    await waitForPageReady(page);

    // First and last notifications should be visible (exact match to avoid substring collisions)
    await expect(page.getByText('Notification item 1', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Notification item 25', { exact: true })).toBeVisible();

    // "Siguiente" button is always rendered when there is data
    await expect(page.getByText('Siguiente')).toBeVisible();
  });

  test('unread notifications have .unread class and bell icon', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    const notifications = [
      makeMockNotification(1, { text: 'Unread notification', readed: false }),
      makeMockNotification(2, { text: 'Read notification', readed: true }),
    ];
    await overrideNotifications(page, notifications);

    await page.goto('/notifications');
    await waitForPageReady(page);

    await expect(page.getByText('Unread notification')).toBeVisible({ timeout: 10000 });

    // Unread notification should have .unread class
    const unreadItem = page.locator('.unread');
    await expect(unreadItem).toHaveCount(1);

    // Unread notification should have bell icon
    const bellIcon = unreadItem.locator('.fa-bell-o');
    await expect(bellIcon).toBeAttached();
  });
});
