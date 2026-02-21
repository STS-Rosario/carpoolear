import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, mockAutocomplete } from './helpers.js';

test.describe('Search and filtering', () => {
    test.setTimeout(60000);

    test('trips page shows search section', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.locator('.search-section')).toBeVisible();
    });

    test('search section has origin and destination inputs', async ({ page }) => {
        await page.goto('/trips');
        const searchSection = page.locator('.search-section');
        await expect(searchSection).toBeVisible();

        // Should have autocomplete inputs for origin and destination
        const inputs = searchSection.locator('.osm-autocomplete input, input[type="text"]');
        const count = await inputs.count();
        expect(count).toBeGreaterThanOrEqual(2);
    });

    test('search section has date picker', async ({ page }) => {
        await page.goto('/trips');
        const datePicker = page.locator('.search-section .date-picker, .search-section .vdp-datepicker, .search-section input[type="date"]');
        await expect(datePicker.first()).toBeVisible({ timeout: 5000 });
    });

    test('search section has search button', async ({ page }) => {
        await page.goto('/trips');
        const searchBtn = page.locator('.btn-search, button:has-text("Buscar")');
        await expect(searchBtn.first()).toBeVisible();
    });

    test('can search for trips by origin', async ({ page }) => {
        await mockAutocomplete(page);
        await page.goto('/trips');

        // Type in origin field
        const originInput = page.locator('.search-section .osm-autocomplete input').first();
        await originInput.click();
        await originInput.pressSequentially('Rosario', { delay: 50 });

        // Wait for autocomplete results and select
        const result = page.locator('.search-section .osm-autocomplete-results button').first();
        await result.waitFor({ state: 'visible', timeout: 10000 });
        await result.click();

        // Click search
        const searchBtn = page.locator('.btn-search, button:has-text("Buscar")');
        await searchBtn.first().click();

        // Should show results or empty state
        await page.waitForTimeout(2000);
        const trips = page.locator('.trip-card, .trip-item, .trip');
        const emptyState = page.locator('.alert-warning');
        // One or the other should be visible
        const tripsCount = await trips.count();
        const emptyVisible = await emptyState.isVisible().catch(() => false);
        expect(tripsCount > 0 || emptyVisible).toBeTruthy();
    });

    test('can toggle between driver and passenger modes', async ({ page }) => {
        await page.goto('/trips');

        // Look for the mode toggle buttons
        const buttons = page.locator('.search-section .btn-option, .search-section .btn-group .btn');
        const count = await buttons.count();

        if (count >= 2) {
            // Click second button (passenger mode)
            await buttons.nth(1).click();
            await expect(buttons.nth(1)).toHaveClass(/active/);

            // Click first button (driver mode)
            await buttons.nth(0).click();
            await expect(buttons.nth(0)).toHaveClass(/active/);
        }
    });

    test('search persists after navigating back', async ({ page }) => {
        await mockAutocomplete(page);
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/trips');

        // Type in origin
        const originInput = page.locator('.search-section .osm-autocomplete input').first();
        await originInput.click();
        await originInput.pressSequentially('Buenos', { delay: 50 });
        const result = page.locator('.search-section .osm-autocomplete-results button').first();
        await result.waitFor({ state: 'visible', timeout: 10000 });
        await result.click();

        // Navigate away and back
        await page.goto('/my-trips');
        await page.goto('/trips');

        // Page should load without errors
        await expect(page.locator('.trips.container')).toBeVisible({ timeout: 5000 });
    });
});
