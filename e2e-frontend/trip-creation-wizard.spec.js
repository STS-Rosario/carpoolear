const { test, expect } = require('@playwright/test');
const {
    MOCK_CONFIG,
    MOCK_TRIP_DETAIL,
    MOCK_USER,
    setupCatchAllMock,
    setupCommonMocks,
    setupAuthState,
    waitForPageReady
} = require('./shared/mocks');

test.describe('trip creation wizard', () => {
    test.beforeEach(async ({ page }) => {
        await setupCatchAllMock(page);
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

    test('fresh create ignores step query and starts at role step', async ({
        page
    }) => {
        await page.addInitScript(() => {
            localStorage.removeItem('TRIP_CREATION_DRAFT');
        });
        await page.goto('/trips/create?step=5');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/step=1/);
        await expect(page.getByTestId('trip-creation-wizard-step-1')).toBeVisible();
    });

    test('resumeDraft opens wizard at the saved draft step', async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem(
                'TRIP_CREATION_DRAFT',
                JSON.stringify({
                    1: {
                        currentStep: 5,
                        maxVisitedStep: 5,
                        trip: { is_passenger: 0 }
                    }
                })
            );
        });
        await page.goto('/trips/create?resumeDraft=1');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/step=5/);
        await expect(page.getByTestId('trip-creation-wizard-step-5')).toBeVisible();
    });

    /**
     * Resumes a draft at the description step with a chosen contribution of
     * $15000 while trip-info caps it at $20000 per seat ($100000 per trip / 5).
     */
    async function resumeDescriptionDraftWithMaximum(page, description) {
        await page.route('**/api/config', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ...MOCK_CONFIG, module_max_price_enabled: true })
            });
        });
        await page.route('**/api/trips/trip-info', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: true,
                    data: {
                        distance: 300000,
                        duration: 12000,
                        co2: 45000,
                        route_needs_payment: false,
                        recommended_trip_price_cents: 8000000,
                        maximum_trip_price_cents: 10000000,
                        pricing_breakdown: null
                    }
                })
            });
        });
        await page.addInitScript((draftDescription) => {
            localStorage.setItem(
                'TRIP_CREATION_DRAFT',
                JSON.stringify({
                    1: {
                        currentStep: 9,
                        maxVisitedStep: 9,
                        price: '15000',
                        points: [
                            {
                                name: 'Rosario, Santa Fe',
                                place: 'Rosario, Santa Fe',
                                json: { id: 1, name: 'Rosario, Santa Fe' },
                                location: { lat: -32.9468, lng: -60.6393 }
                            },
                            {
                                name: 'Córdoba, Córdoba',
                                place: 'Córdoba, Córdoba',
                                json: { id: 2, name: 'Córdoba, Córdoba' },
                                location: { lat: -31.4201, lng: -64.1888 }
                            }
                        ],
                        trip: {
                            is_passenger: 0,
                            description: draftDescription
                        }
                    }
                })
            );
        }, description);
        const tripInfo = page.waitForResponse('**/api/trips/trip-info');
        await page.goto('/trips/create?resumeDraft=1');
        await tripInfo;
    }

    test('warns once about a possible contribution excess when leaving the description step', async ({
        page
    }) => {
        await resumeDescriptionDraftWithMaximum(
            page,
            'La contribución es de $24000 por persona'
        );
        await waitForPageReady(page);
        await expect(page.getByTestId('trip-creation-wizard-step-9')).toBeVisible();

        await page.getByTestId('trip-creation-next').click();

        const modal = page.getByTestId('trip-contribution-excess-modal');
        await expect(modal).toBeVisible();
        await expect(
            page.getByRole('heading', { name: 'Posible exceso de contribución' })
        ).toBeVisible();
        await expect(modal).toContainText('Detectamos un posible exceso de contribución.');
        await expect(page.locator('.modal-footer')).toHaveCount(0);
        await expect(page.getByTestId('trip-creation-wizard-step-9')).toBeVisible();

        await page.getByTestId('trip-contribution-excess-confirm').click();
        await expect(modal).toHaveCount(0);

        await page.getByTestId('trip-creation-next').click();
        await expect(page.getByTestId('trip-creation-wizard-step-10')).toBeVisible();
        await expect(modal).toHaveCount(0);

        await page.getByTestId('trip-creation-back').click();
        await expect(page.getByTestId('trip-creation-wizard-step-9')).toBeVisible();
        await page.getByTestId('trip-creation-next').click();
        await expect(page.getByTestId('trip-creation-wizard-step-10')).toBeVisible();
        await expect(modal).toHaveCount(0);
    });

    test('does not warn when the description asks more than the chosen contribution but within the maximum', async ({
        page
    }) => {
        await resumeDescriptionDraftWithMaximum(page, 'Contribución $18000 por persona');
        await waitForPageReady(page);
        await expect(page.getByTestId('trip-creation-wizard-step-9')).toBeVisible();

        await page.getByTestId('trip-creation-next').click();

        await expect(page.getByTestId('trip-creation-wizard-step-10')).toBeVisible();
        await expect(page.getByTestId('trip-contribution-excess-modal')).toHaveCount(0);
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
