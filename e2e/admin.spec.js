import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, waitForSplash } from './helpers.js';

test.describe('Admin pages', () => {
    test.setTimeout(60000);

    // user0 is set as admin by global-setup.js

    test('non-admin user is redirected from admin page', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin');
        // authAdmin guard should redirect to login
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('non-admin user is redirected from admin users page', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin/users');
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('non-admin user is redirected from admin trips page', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin/trips');
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('admin page loads for admin user', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);
        await waitForSplash(page);

        // Wait for user data (including is_admin) to load from fetchUser()
        await page.waitForTimeout(3000);

        await page.goto('/admin');
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        // Should stay on admin page (not redirected)
        await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    });
});
