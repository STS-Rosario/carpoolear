import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, createTripViaAPI } from './helpers.js';

test.describe('Trip creation flow', () => {
    test.setTimeout(90000);

    test('create trip form renders all required fields', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        // Navigate to create trip
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
        const submitBtn = page.locator('button.trip-create');
        await expect(submitBtn).toBeVisible({ timeout: 10000 });
    });

    test('create trip via API and verify in my-trips', async ({ page }) => {
        // Login and get token
        await login(page);
        await dismissOnboarding(page);
        const token = await getToken(page);

        // Create trip via API
        const { tripId, tripBody } = await createTripViaAPI(page, token);
        expect(tripId).toBeTruthy();

        // Navigate to my-trips and verify the trip appears
        await page.goto('/my-trips');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/my-trips/, { timeout: 15000 });

        // Verify a trip card appears
        await expect(page.getByText('Rosario').first()).toBeVisible({ timeout: 15000 });

        // Cleanup
        await page.request.delete(`http://localhost:8000/api/trips/${tripId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
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

        // Should show validation errors (red borders, error messages, etc.)
        const errors = page.locator('.error, .has-error, .trip-error, .ajs-message.ajs-error');
        await expect(errors.first()).toBeVisible({ timeout: 5000 });
    });
});
