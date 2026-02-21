import { test, expect } from '@playwright/test';

test.describe('App startup', () => {
    test('dev server responds with 200', async ({ page }) => {
        const response = await page.goto('/');
        expect(response.status()).toBe(200);
    });

    test('loads without critical console errors', async ({ page }) => {
        const errors = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/trips');
        await page.waitForTimeout(3000);

        // Filter out known non-critical errors (network requests to missing resources, etc.)
        const criticalErrors = errors.filter(
            (e) =>
                !e.includes('favicon.ico') &&
                !e.includes('net::ERR_') &&
                !e.includes('Failed to load resource')
        );
        expect(criticalErrors).toEqual([]);
    });

    test('renders the app root element', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#app')).toBeVisible();
    });

    test('trips page loads as default route', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/trips/);
        await expect(page.locator('.trips.container')).toBeVisible();
    });
});
