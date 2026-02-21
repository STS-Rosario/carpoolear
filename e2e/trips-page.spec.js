import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, setupAutocompleteMocks, createTripViaUI, deleteTripViaAPI } from './helpers.js';

test.describe('Trips page', () => {
    test('loads and shows the trips container', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.locator('.trips.container')).toBeVisible();
    });

    test('shows the search section', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.locator('.search-section')).toBeVisible();
    });

    test.describe('with a created trip', () => {
        test.setTimeout(90000);

        test('trip card appears in the trips listing', async ({ page }) => {
            // Create a trip via UI
            await setupAutocompleteMocks(page);
            await login(page);
            await dismissOnboarding(page);
            const tripId = await createTripViaUI(page, {
                description: 'Trip for listing test',
            });

            // Navigate to trips listing
            await page.goto('/trips');
            await page.waitForLoadState('networkidle');

            // Verify trip card appears
            await expect(page.locator('.card-trip, .panel-card').first()).toBeVisible({ timeout: 15000 });
            await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 10000 });

            // Cleanup
            const token = await getToken(page);
            await deleteTripViaAPI(page, tripId, token);
        });
    });

    test('page loads without JavaScript errors', async ({ page }) => {
        const jsErrors = [];
        page.on('pageerror', (err) => {
            // Ignore Network Errors from unauthenticated API calls (expected on public page)
            if (err.message === 'Network Error') return;
            jsErrors.push(err.message);
        });

        await page.goto('/trips');
        await page.waitForTimeout(3000);

        expect(jsErrors).toEqual([]);
    });
});
