const { test, expect } = require('@playwright/test');
const {
    MOCK_USER,
    makeMockTrip,
    freezeClock,
    setupCatchAllMock,
    setupCommonMocks,
    setupAuthState,
    waitForPageReady
} = require('./shared/mocks');

const OTHER_USER_ID = 55;

test.describe('Friends overhaul', () => {
    test('home shows pending friend invitations card linking to friends settings', async ({
        page
    }) => {
        await freezeClock(page);
        await setupCatchAllMock(page);
        await setupCommonMocks(page);
        await setupAuthState(page);

        await page.route('**/api/friends/pedings**', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: [
                        {
                            id: 99,
                            name: 'Invitador Test',
                            image: null
                        }
                    ]
                })
            });
        });

        await page.goto('/trips');
        await waitForPageReady(page);

        const card = page.getByText(/invitaciones a amigos/i);
        await expect(card).toBeVisible({ timeout: 15000 });
        await card.click();
        await expect(page).toHaveURL(/\/setting\/friends/);
    });

    test('other user profile shows invite friends button', async ({ page }) => {
        await freezeClock(page);
        await setupCatchAllMock(page);
        await setupCommonMocks(page);
        await setupAuthState(page);

        await page.route(`**/api/users/${OTHER_USER_ID}`, (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        id: OTHER_USER_ID,
                        name: 'Usuario Amigo',
                        image: null,
                        positive_ratings: 1,
                        negative_ratings: 0,
                        friendship_state: 'none',
                        data_visibility: '1',
                        accounts: [],
                        cars: []
                    }
                })
            });
        });

        await page.route(`**/api/users/${OTHER_USER_ID}/badges`, (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ data: [] })
            });
        });

        await page.goto(`/profile/${OTHER_USER_ID}`);
        await waitForPageReady(page);

        await expect(page.getByRole('button', { name: /invitar a amigos/i })).toBeVisible({
            timeout: 15000
        });
    });

    test('trip search shows friend trips section when logged in', async ({ page }) => {
        await freezeClock(page);
        await setupCatchAllMock(page);
        await setupCommonMocks(page);
        await setupAuthState(page);

        const friendTrip = makeMockTrip(101, {
            driver_is_friend: true,
            user: {
                id: 301,
                name: 'Amigo Conductor',
                image: null,
                positive_ratings: 4,
                negative_ratings: 0
            }
        });
        const otherTrip = makeMockTrip(102, {
            driver_is_friend: false,
            user: {
                id: 302,
                name: 'Otro Conductor',
                image: null,
                positive_ratings: 2,
                negative_ratings: 0
            }
        });

        await page.route('**/api/trips**', (route) => {
            if (route.request().method() !== 'GET') {
                return route.continue();
            }
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: [friendTrip, otherTrip]
                })
            });
        });

        await page.goto('/trips');
        await waitForPageReady(page);

        await expect(page.getByText('Viajes de mis amigos')).toBeVisible({
            timeout: 15000
        });
        await expect(page.getByText('Otros viajes')).toBeVisible();
    });
});
