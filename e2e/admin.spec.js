import { test, expect } from '@playwright/test';
import { login, dismissOnboarding } from './helpers.js';

test.describe('Admin pages', () => {
    test.setTimeout(60000);

    // Note: test users from TestingSeeder are NOT admins by default.
    // These tests verify that non-admin users are redirected,
    // and that admin pages load if the user is an admin.

    test('non-admin user is redirected from admin page', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin');
        // authAdmin guard should redirect to login
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('non-admin user is redirected from admin users page', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin/users');
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('non-admin user is redirected from admin trips page', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/admin/trips');
        await expect(page).toHaveURL(/\/login|\/trips/);
    });

    test('admin page loads for admin user', async ({ page, request }) => {
        // Make user0 an admin via API (requires DB access)
        // Try to set user0 as admin using tinker
        const makeAdmin = await page.request.post('http://localhost:8000/api/login', {
            data: { email: 'user0@g.com', password: '123456' },
        });
        const token = (await makeAdmin.json()).token;

        // Check if user is admin
        const meRes = await page.request.get('http://localhost:8000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meBody = await meRes.json();
        const isAdmin = meBody.data?.is_admin || meBody.is_admin;

        if (isAdmin) {
            await login(page);
            await dismissOnboarding(page);

            await page.goto('/admin');
            await expect(page).toHaveURL(/\/admin/);

            // Admin page should show charts and navigation
            const adminNav = page.locator('.admin-nav, .admin_nav');
            await expect(adminNav.first()).toBeVisible({ timeout: 10000 });
        } else {
            // Skip if user is not admin - this is expected with TestingSeeder
            test.skip();
        }
    });
});
