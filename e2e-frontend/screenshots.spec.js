const { test, expect } = require('@playwright/test');
const {
    MOCK_CONFIG,
    MOCK_USER,
    MOCK_ADMIN_USER,
    MOCK_TRIPS,
    MOCK_TRIP_DETAIL,
    MOCK_DRIVER_TRIPS,
    MOCK_PASSENGER_TRIPS,
    MOCK_CONVERSATIONS,
    MOCK_MESSAGES,
    MOCK_NOTIFICATIONS,
    MOCK_PENDING_REQUESTS,
    MOCK_DELETE_REQUESTS,
    MOCK_BANNED_USERS,
    MOCK_MANUAL_VALIDATIONS,
    MOCK_MANUAL_VALIDATION_DETAIL,
    MOCK_MP_REJECTED,
    MOCK_MP_REJECTED_DETAIL,
    MOCK_TRANSACTIONS,
    MOCK_CHART_TRIPS,
    MOCK_CHART_SEATS,
    MOCK_CHART_USERS,
    MOCK_PROFILE_USER,
    paginated,
    freezeClock,
    setupCatchAllMock,
    setupCommonMocks,
    setupAuthState,
    waitForPageReady
} = require('./shared/mocks');

const SCREENSHOT_OPTIONS = {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.02
};

// ============================================================
// Tests
// ============================================================

test.describe('Screenshot tests', () => {
    test.setTimeout(30000);

    // ----------------------------------------------------------
    // Guest views (no auth, guest middleware)
    // ----------------------------------------------------------
    test.describe('Guest views', () => {
        test.beforeEach(async ({ page }) => {
            await freezeClock(page);
            await setupCatchAllMock(page);
            await setupCommonMocks(page);
        });

        test('login page', async ({ page }) => {
            await page.goto('/login');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'login.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('register page', async ({ page }) => {
            await page.goto('/register');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'register.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('reset password page', async ({ page }) => {
            await page.goto('/reset-password');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'reset-password.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('reset password confirm page', async ({ page }) => {
            await page.goto('/reset-password/test-token');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'reset-password-confirm.png',
                SCREENSHOT_OPTIONS
            );
        });
    });

    // ----------------------------------------------------------
    // Public views (no auth required)
    // ----------------------------------------------------------
    test.describe('Public views', () => {
        test.beforeEach(async ({ page }) => {
            await freezeClock(page);
            await setupCatchAllMock(page);
            await setupCommonMocks(page);
        });

        test('trips listing page', async ({ page }) => {
            await page.goto('/trips');
            await waitForPageReady(page);
            await page
                .locator('.trips-list')
                .waitFor({ state: 'visible', timeout: 10000 })
                .catch(() => {});
            await expect(page).toHaveScreenshot(
                'trips.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('about page', async ({ page }) => {
            await page.goto('/about');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'about.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('terms and conditions page', async ({ page }) => {
            await page.route('**/api/users/terms**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        content:
                            '<h1>Términos y Condiciones</h1><p>Estos son los términos y condiciones de uso de Carpoolear.</p><p>Al utilizar esta plataforma, usted acepta los siguientes términos de servicio.</p><h2>1. Uso de la plataforma</h2><p>Carpoolear es una plataforma de viajes compartidos. Los usuarios se comprometen a utilizar el servicio de manera responsable.</p><h2>2. Responsabilidad</h2><p>Cada usuario es responsable de la información que publica en la plataforma.</p>'
                    })
                });
            });
            await page.goto('/terminos');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'terms.png',
                SCREENSHOT_OPTIONS
            );
        });
    });

    // ----------------------------------------------------------
    // Authenticated views
    // ----------------------------------------------------------
    test.describe('Authenticated views', () => {
        test.beforeEach(async ({ page }) => {
            await freezeClock(page);
            await setupCatchAllMock(page);
            await setupCommonMocks(page);
            await setupAuthState(page);
        });

        test('trip detail page', async ({ page }) => {
            await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_TRIP_DETAIL })
                });
            });
            await page.goto('/trips/1');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'trip-detail.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('new trip page', async ({ page }) => {
            await page.goto('/trips/create');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'new-trip.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('update trip page', async ({ page }) => {
            await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_TRIP_DETAIL })
                });
            });
            await page.goto('/trips/update/1');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'update-trip.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('my trips page', async ({ page }) => {
            // Override user trips with data for this view
            await page.route('**/api/users/get-trips**', (route) => {
                const url = new URL(route.request().url());
                const asDriver = url.searchParams.get('as_driver');
                const data =
                    asDriver === 'true'
                        ? MOCK_DRIVER_TRIPS
                        : MOCK_PASSENGER_TRIPS;
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data })
                });
            });
            await page.route('**/api/users/requests', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_PENDING_REQUESTS })
                });
            });
            await page.goto('/my-trips');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'my-trips.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('profile page', async ({ page }) => {
            await page.route(/\/api\/users\/5(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_PROFILE_USER })
                });
            });
            await page.route(/\/api\/users\/5\/badges/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: [] })
                });
            });
            await page.route(/\/api\/users\/5\/ratings/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(paginated([]))
                });
            });
            await page.goto('/profile/5');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'profile.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('notifications page', async ({ page }) => {
            await page.route(/\/api\/notifications(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_NOTIFICATIONS })
                });
            });
            await page.goto('/notifications');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'notifications.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('conversations list page', async ({ page }) => {
            await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(paginated(MOCK_CONVERSATIONS))
                });
            });
            await page.goto('/conversations');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'conversations-list.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('conversation chat page', async ({ page }) => {
            await page.route(/\/api\/conversations\/show\/1/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_CONVERSATIONS[0] })
                });
            });
            await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_MESSAGES })
                });
            });
            await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(paginated(MOCK_CONVERSATIONS))
                });
            });
            await page.goto('/conversations/1');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'conversation-chat.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('settings - edit profile page', async ({ page }) => {
            await page.goto('/setting/profile');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'settings-profile.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('settings - friends page', async ({ page }) => {
            await page.route(/\/api\/friends(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(
                        paginated([
                            {
                                id: 10,
                                name: 'María García',
                                image: null,
                                email: 'maria@test.com'
                            },
                            {
                                id: 11,
                                name: 'Carlos López',
                                image: null,
                                email: 'carlos@test.com'
                            }
                        ])
                    )
                });
            });
            await page.goto('/setting/friends');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'settings-friends.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('settings - friends search page', async ({ page }) => {
            await page.route(/\/api\/friends\/search(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(paginated([]))
                });
            });
            await page.route(/\/api\/friends(\?.*)?$/, (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(paginated([]))
                });
            });
            await page.goto('/setting/friends/search');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'settings-friends-search.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('settings - identity validation page', async ({ page }) => {
            await page.route(
                '**/api/users/manual-identity-validation**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({})
                    });
                }
            );
            await page.route(
                '**/api/users/mercadopago-oauth-url**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ url: '' })
                    });
                }
            );
            await page.goto('/setting/identity-validation');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'settings-identity-validation.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('settings - manual identity validation page', async ({ page }) => {
            await page.route(
                '**/api/users/manual-identity-validation**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({})
                    });
                }
            );
            await page.goto('/setting/identity-validation/manual');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'settings-identity-validation-manual.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('transactions page', async ({ page }) => {
            await page.route('**/api/trips/transactions**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(MOCK_TRANSACTIONS)
                });
            });
            await page.goto('/transactions');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'transactions.png',
                SCREENSHOT_OPTIONS
            );
        });
    });

    // ----------------------------------------------------------
    // Admin views (authAdmin middleware — requires is_admin: true)
    // ----------------------------------------------------------
    test.describe('Admin views', () => {
        test.beforeEach(async ({ page }) => {
            await freezeClock(page);
            await setupCatchAllMock(page);
            await setupCommonMocks(page);
            await setupAuthState(page, MOCK_ADMIN_USER);
        });

        test('admin dashboard page', async ({ page }) => {
            await page.route('**/api/data/trips**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ trips: MOCK_CHART_TRIPS })
                });
            });
            await page.route('**/api/data/seats**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ seats: MOCK_CHART_SEATS })
                });
            });
            await page.route('**/api/data/users**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ users: MOCK_CHART_USERS })
                });
            });
            await page.goto('/admin');
            await waitForPageReady(page);
            await page.waitForTimeout(2000); // extra time for charts to render
            await expect(page).toHaveScreenshot(
                'admin-dashboard.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin users page', async ({ page }) => {
            await page.route('**/api/users/search**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: [] })
                });
            });
            await page.goto('/admin/users');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-users.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin trips page', async ({ page }) => {
            await page.goto('/admin/trips');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-trips.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin users delete list page', async ({ page }) => {
            await page.route(
                '**/api/admin/users/account-delete-list**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ data: MOCK_DELETE_REQUESTS })
                    });
                }
            );
            await page.goto('/admin/users-delete-list');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-users-delete-list.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin banned users page', async ({ page }) => {
            await page.route('**/api/admin/banned-users**', (route) => {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ data: MOCK_BANNED_USERS })
                });
            });
            await page.goto('/admin/banned-users');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-banned-users.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin manual identity validations page', async ({ page }) => {
            await page.route(
                '**/api/admin/manual-identity-validations**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ data: MOCK_MANUAL_VALIDATIONS })
                    });
                }
            );
            await page.goto('/admin/manual-identity-validations');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-manual-identity-validations.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin manual identity validation review page', async ({
            page
        }) => {
            await page.route(
                /\/api\/admin\/manual-identity-validations\/1/,
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            data: MOCK_MANUAL_VALIDATION_DETAIL
                        })
                    });
                }
            );
            await page.goto('/admin/manual-identity-validations/1');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-manual-identity-validation-review.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin mercado pago rejected validations page', async ({
            page
        }) => {
            await page.route(
                '**/api/admin/mercado-pago-rejected-validations**',
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ data: MOCK_MP_REJECTED })
                    });
                }
            );
            await page.goto('/admin/mercado-pago-rejected-validations');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-mp-rejected-validations.png',
                SCREENSHOT_OPTIONS
            );
        });

        test('admin mercado pago rejected validation detail page', async ({
            page
        }) => {
            await page.route(
                /\/api\/admin\/mercado-pago-rejected-validations\/1/,
                (route) => {
                    route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({ data: MOCK_MP_REJECTED_DETAIL })
                    });
                }
            );
            await page.goto('/admin/mercado-pago-rejected-validations/1');
            await waitForPageReady(page);
            await expect(page).toHaveScreenshot(
                'admin-mp-rejected-validation-detail.png',
                SCREENSHOT_OPTIONS
            );
        });
    });
});
