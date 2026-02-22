import { test, expect } from '@playwright/test';
import { login, loginViaAPI } from './helpers.js';

test.describe('View Profile (user6 + user7)', () => {
    let user7Id;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const result = await loginViaAPI(page, 'user7@g.com', '123456');
        user7Id = result.userId;
        await ctx.close();
    });

    test('can view another user\'s profile', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await page.goto(`/profile/${user7Id}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Profile should show tabs (tabset component)
        const tabs = page.locator('.nav-tabs');
        await expect(tabs).toBeVisible({ timeout: 10000 });
    });

    test('profile shows calificaciones tab', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await page.goto(`/profile/${user7Id}`);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        // Click the calificaciones (ratings) tab - use getByRole for precision
        const ratingsTab = page.getByRole('tab', { name: /calificacion/i });
        await expect(ratingsTab).toBeVisible({ timeout: 10000 });
        await ratingsTab.click();
        await page.waitForTimeout(1000);

        // Ratings section should render (may show "no ratings" or column-rating)
        const ratingsContent = page.locator('.column-rating, .alert-warning, .alert').first();
        await expect(ratingsContent).toBeVisible({ timeout: 5000 });
    });

    test('own profile shows trips tab', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await page.goto('/profile/me');
        await page.waitForLoadState('domcontentloaded');

        // First tab should be visible
        const firstTab = page.locator('.nav-tabs li').first();
        await expect(firstTab).toBeVisible({ timeout: 10000 });
    });
});
