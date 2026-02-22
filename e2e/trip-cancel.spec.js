import { test, expect } from '@playwright/test';
import {
    login, setupAutocompleteMocks, setupConfigOverride,
    loginViaAPI, createTripViaAPI, deleteTripViaAPI,
} from './helpers.js';

test.describe('Trip Cancel (user8 + user9)', () => {
    test('cancel button visible on own trip', async ({ page }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const { token } = await loginViaAPI(page, 'user8@g.com', '123456');
        const trip = await createTripViaAPI(page, token);
        const tripId = trip.id || trip.data?.id;

        try {
            await login(page, 'user8@g.com', '123456');
            await page.goto(`/trips/${tripId}`);
            await page.waitForLoadState('domcontentloaded');

            const cancelBtn = page.locator('a, button').filter({ hasText: /Cancelar Viaje/i });
            await expect(cancelBtn.first()).toBeVisible({ timeout: 10000 });
        } finally {
            await deleteTripViaAPI(page, tripId, token);
        }
    });

    test('can cancel own trip via UI', async ({ page }) => {
        test.setTimeout(90000);
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const { token } = await loginViaAPI(page, 'user8@g.com', '123456');
        const trip = await createTripViaAPI(page, token);
        const tripId = trip.id || trip.data?.id;

        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await page.waitForLoadState('domcontentloaded');

        // Handle the confirmation dialog
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        const cancelBtn = page.locator('a, button').filter({ hasText: /Cancelar Viaje/i });
        await cancelBtn.first().waitFor({ state: 'visible', timeout: 10000 });
        await cancelBtn.first().click();

        // Should redirect away from the trip page (to /trips or /my-trips)
        await page.waitForURL(url => !url.toString().includes(`/trips/${tripId}`), { timeout: 15000 });
    });

    test('cancel button NOT visible for non-owner', async ({ page, browser }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const { token } = await loginViaAPI(page, 'user8@g.com', '123456');
        const trip = await createTripViaAPI(page, token);
        const tripId = trip.id || trip.data?.id;

        try {
            // Login as user9 (not the owner)
            const ctx = await browser.newContext();
            const otherPage = await ctx.newPage();
            await setupConfigOverride(otherPage);
            await login(otherPage, 'user9@g.com', '123456');
            await otherPage.goto(`/trips/${tripId}`);
            await otherPage.waitForLoadState('domcontentloaded');

            // Wait for the page to render trip details
            await otherPage.waitForTimeout(2000);

            const cancelBtn = otherPage.locator('a, button').filter({ hasText: /Cancelar Viaje/i });
            await expect(cancelBtn).toHaveCount(0);

            await ctx.close();
        } finally {
            await deleteTripViaAPI(page, tripId, token);
        }
    });
});
