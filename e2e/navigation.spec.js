import { test, expect } from '@playwright/test';
import { login, dismissOnboarding } from './helpers.js';

test.describe('Authenticated navigation', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);
    });

    test('redirects to trips after login', async ({ page }) => {
        await expect(page).toHaveURL(/\/trips/);
    });

    test('header shows authenticated links', async ({ page }) => {
        await expect(page.getByRole('link', { name: /crear viaje/i })).toBeVisible();
    });

    test('can navigate to my-trips', async ({ page }) => {
        await page.goto('/my-trips');
        await expect(page).toHaveURL(/\/my-trips/);
    });

    test('can navigate to conversations', async ({ page }) => {
        await page.goto('/conversations');
        await expect(page).toHaveURL(/\/conversations/);
    });

    test('can navigate to notifications', async ({ page }) => {
        await page.goto('/notifications');
        await expect(page).toHaveURL(/\/notifications/);
    });

    test('can navigate to profile settings', async ({ page }) => {
        await page.goto('/setting/profile');
        await expect(page).toHaveURL(/\/setting\/profile/);
    });

    test('can navigate to about page', async ({ page }) => {
        await page.goto('/about');
        await expect(page).toHaveURL(/\/about/);
    });

    test('can navigate to terms page', async ({ page }) => {
        await page.goto('/terminos');
        await expect(page).toHaveURL(/\/terminos/);
    });
});

test.describe('Unauthenticated navigation', () => {
    test('trips page is accessible without login', async ({ page }) => {
        await page.goto('/trips');
        await expect(page).toHaveURL(/\/trips/);
        await expect(page.locator('.trips.container')).toBeVisible();
    });

    test('protected routes redirect to login', async ({ page }) => {
        await page.goto('/my-trips');
        await expect(page).toHaveURL(/\/login/);
    });

    test('about page is accessible without login', async ({ page }) => {
        await page.goto('/about');
        await expect(page).toHaveURL(/\/about/);
    });

    test('terms page is accessible without login', async ({ page }) => {
        await page.goto('/terminos');
        await expect(page).toHaveURL(/\/terminos/);
    });
});
