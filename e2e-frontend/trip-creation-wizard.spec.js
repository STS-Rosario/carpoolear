const { test, expect } = require('@playwright/test');
const {
    MOCK_TRIP_DETAIL,
    MOCK_USER,
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
        await expect(page).toHaveURL(/step=1/);
        await expect(page.getByTestId('trip-creation-step-1')).toBeVisible();
        await expect(page.getByTestId('trip-creation-next')).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Crear viaje' })
        ).toBeVisible();
        await expect(page.getByTestId('trip-creation-role-driver')).toBeVisible();
    });

    test('deep link opens requested wizard step', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.removeItem('TRIP_CREATION_DRAFT');
        });
        await page.goto('/trips/create?step=5');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/step=5/);
        await expect(page.getByTestId('trip-creation-wizard-step-5')).toBeVisible();
    });

    test('update trip route shows wizard', async ({ page }) => {
        await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        ...MOCK_TRIP_DETAIL,
                        user: {
                            id: MOCK_USER.id,
                            name: MOCK_USER.name,
                            image: MOCK_USER.image,
                            positive_ratings: MOCK_USER.positive_ratings,
                            negative_ratings: MOCK_USER.negative_ratings
                        }
                    }
                })
            });
        });
        await page.goto('/trips/update/1');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/step=2/);
        await expect(page.getByTestId('trip-creation-wizard-step-2')).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Editar viaje' })
        ).toBeVisible();
    });
});
