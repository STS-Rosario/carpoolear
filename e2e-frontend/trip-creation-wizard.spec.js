import { test, expect } from '@playwright/test';
import { setupAuthenticatedMocks } from './shared/mocks.js';

test.describe('trip creation wizard', () => {
    test.beforeEach(async ({ page }) => {
        await setupAuthenticatedMocks(page);
    });

    test('driver create shows wizard stepper and next control', async ({ page }) => {
        await page.goto('/trips/create');
        await expect(page.getByTestId('trip-creation-step-1')).toBeVisible();
        await expect(page.getByTestId('trip-creation-next')).toBeVisible();
        await expect(page.getByText('Crear viaje como conductor')).toBeVisible();
    });

    test('update trip route shows wizard', async ({ page }) => {
        await page.goto('/trips/update/1');
        await expect(page.getByTestId('trip-creation-step-1')).toBeVisible();
        await expect(page.getByText('Editar viaje')).toBeVisible();
    });
});
