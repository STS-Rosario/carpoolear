import { test, expect } from '@playwright/test';
import {
    login, setupAutocompleteMocks, setupConfigOverride, waitForSplash,
    loginViaAPI, createTripViaAPI, deleteTripViaAPI, API_BASE,
} from './helpers.js';

test.describe('Trip Edit (user8)', () => {
    let token;
    let tripId;

    test.beforeEach(async ({ page }) => {
        await setupAutocompleteMocks(page);
        await setupConfigOverride(page);
        const result = await loginViaAPI(page, 'user8@g.com', '123456');
        token = result.token;
        const trip = await createTripViaAPI(page, token, { description: 'Descripcion original e2e' });
        tripId = trip.id;
    });

    test.afterEach(async ({ page }) => {
        await deleteTripViaAPI(page, tripId, token);
    });

    test('edit link visible on own trip detail', async ({ page }) => {
        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        const editLink = page.locator('a, button').filter({ hasText: /Editar/i });
        await expect(editLink.first()).toBeVisible({ timeout: 15000 });
    });

    test('edit page loads with existing data', async ({ page }) => {
        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/update/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        const descField = page.locator('#trp_comment');
        await expect(descField).toBeVisible({ timeout: 15000 });
        await expect(descField).toHaveValue(/Descripcion original e2e/);
    });

    test('can update trip description via API and see it on detail page', async ({ page }) => {
        test.setTimeout(90000);

        // Update the trip description directly via API (PUT /api/trips/{id})
        const res = await page.request.put(`${API_BASE}/api/trips/${tripId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { description: 'Descripcion actualizada e2e' },
        });
        const json = await res.json();
        console.log('Trip update result:', JSON.stringify(json).substring(0, 200));

        // Navigate to the trip detail page to verify the update
        await login(page, 'user8@g.com', '123456');
        await page.goto(`/trips/${tripId}`);
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        await expect(page.getByText('Descripcion actualizada e2e')).toBeVisible({ timeout: 10000 });
    });
});
