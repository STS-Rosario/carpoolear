import { test, expect } from '@playwright/test';
import { login, setupAutocompleteMocks } from './helpers.js';

test.describe('Return Trip (user8)', () => {
    test('return trip checkbox visible on create form', async ({ page }) => {
        await login(page, 'user8@g.com', '123456');
        await setupAutocompleteMocks(page);
        await page.goto('/trips/create');
        await page.waitForLoadState('domcontentloaded');

        // The return trip checkbox should be visible
        const returnCheckbox = page.locator('.checkbox-trip-return, label:has-text("regreso")').first();
        await expect(returnCheckbox).toBeVisible({ timeout: 10000 });
    });

    test('checking return trip shows return trip form section', async ({ page }) => {
        await login(page, 'user8@g.com', '123456');
        await setupAutocompleteMocks(page);
        await page.goto('/trips/create');
        await page.waitForLoadState('domcontentloaded');

        // Select driver type first
        await page.click('label[for="type-driver"]');

        // Fill origin and destination so return trip can swap them
        const originInput = page.locator('.trip_point').first().locator('.osm-autocomplete input');
        await originInput.click();
        await originInput.pressSequentially('Rosario', { delay: 80 });
        const originResult = page.locator('.trip_point').first().locator('.osm-autocomplete-results button').first();
        await originResult.waitFor({ state: 'visible', timeout: 15000 });
        await originResult.click();

        const destInput = page.locator('.trip_point').last().locator('.osm-autocomplete input');
        await destInput.click();
        await destInput.pressSequentially('Mendoza', { delay: 80 });
        const destResult = page.locator('.trip_point').last().locator('.osm-autocomplete-results button').first();
        await destResult.waitFor({ state: 'visible', timeout: 15000 });
        await destResult.click();

        // Click the return trip checkbox
        const returnCheckbox = page.locator('.checkbox-trip-return input[type="checkbox"], input#return-trip');
        await returnCheckbox.check({ force: true });

        // Return trip section should appear
        const returnSection = page.locator('.show-return-trip, .row-showReturnTrip').first();
        await expect(returnSection).toBeVisible({ timeout: 5000 });
    });
});
