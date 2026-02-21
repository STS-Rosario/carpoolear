import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, setupAutocompleteMocks, createTripViaUI, deleteTripViaAPI } from './helpers.js';

test.describe('Trip creation flow', () => {
    test.setTimeout(90000);

    test('create trip form renders all required fields', async ({ page }) => {
        await setupAutocompleteMocks(page);
        await login(page);
        await dismissOnboarding(page);

        // Navigate to create trip via header link
        await page.getByRole('link', { name: /crear viaje/i }).click();
        await expect(page).toHaveURL(/\/trips\/create/);

        // Verify driver/passenger radio buttons
        await expect(page.locator('label[for="type-driver"]')).toBeVisible();
        await expect(page.locator('label[for="type-passenger"]')).toBeVisible();

        // Verify origin and destination inputs
        await expect(page.getByPlaceholder('Origen')).toBeVisible();
        await expect(page.getByPlaceholder('Destino')).toBeVisible();

        // Verify seats section
        await expect(page.getByText('Lugares disponibles')).toBeVisible();

        // Verify submit button
        await expect(page.locator('button.trip-create')).toBeVisible({ timeout: 10000 });
    });

    test('login, create a trip via UI, verify in my-trips', async ({ page }) => {
        await setupAutocompleteMocks(page);
        await login(page);
        await dismissOnboarding(page);

        // Create trip through the full UI form
        const tripId = await createTripViaUI(page, {
            origin: 'Rosario',
            destination: 'Mendoza',
            description: 'Viaje de prueba e2e - Rosario a Mendoza',
        });
        expect(tripId).toBeTruthy();

        // Verify we're on the trip detail page
        await expect(page).toHaveURL(/\/trips\/\d+/);

        // Navigate to my-trips and verify the trip appears
        await page.goto('/my-trips');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/my-trips/);
        await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 15000 });

        // Cleanup
        const token = await getToken(page);
        await deleteTripViaAPI(page, tripId, token);
    });

    test('shows validation errors when submitting empty trip form', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/trips/create');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/trips\/create/);

        // Try to submit without filling any fields
        const submitBtn = page.locator('button.trip-create');
        await expect(submitBtn).toBeVisible({ timeout: 10000 });
        await submitBtn.click();

        // Should show validation errors
        const errors = page.locator('.error, .has-error, .trip-error, .ajs-message.ajs-error');
        await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });
});
