const { test, expect } = require('@playwright/test');
const {
    MOCK_TRIP_DETAIL,
    setupCommonMocks,
    setupAuthState,
    waitForPageReady
} = require('./shared/mocks');

test.describe('trip creation wizard', () => {
    test.beforeEach(async ({ page }) => {
        await setupCommonMocks(page);
        await setupAuthState(page);
    });

    test('driver create shows wizard stepper and next control', async ({ page }) => {
        await page.goto('/trips/create');
        await waitForPageReady(page);
        await expect(page.getByTestId('trip-creation-step-1')).toBeVisible();
        await expect(page.getByTestId('trip-creation-next')).toBeVisible();
        await expect(page.getByText('Crear viaje como conductor')).toBeVisible();
    });

    test('update trip route shows wizard', async ({ page }) => {
        await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: MOCK_TRIP_DETAIL })
            });
        });
        await page.goto('/trips/update/1');
        await waitForPageReady(page);
        await expect(page.getByTestId('trip-creation-step-1')).toBeVisible();
        await expect(page.getByText('Editar viaje')).toBeVisible();
    });
});
