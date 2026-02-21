import { test, expect } from '@playwright/test';

test.describe('Trips page', () => {
    test('loads and shows the trips container', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.locator('.trips.container')).toBeVisible();
    });

    test('shows the search section', async ({ page }) => {
        await page.goto('/trips');
        await expect(page.locator('.search-section')).toBeVisible();
    });

    test('renders trips list or empty state', async ({ page }) => {
        await page.goto('/trips');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Either trip cards, empty state alert, or the loading indicator should show
        const trips = page.locator('.card-trip, .panel-card, .trip-card');
        const emptyState = page.locator('.alert-warning, .alert-info');
        const tripsCount = await trips.count();
        const alertVisible = await emptyState.first().isVisible().catch(() => false);
        expect(tripsCount > 0 || alertVisible).toBeTruthy();
    });

    test('page loads without JavaScript errors', async ({ page }) => {
        const jsErrors = [];
        page.on('pageerror', (err) => jsErrors.push(err.message));

        await page.goto('/trips');
        await page.waitForTimeout(3000);

        expect(jsErrors).toEqual([]);
    });
});
