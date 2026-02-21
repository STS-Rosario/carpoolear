import { test, expect } from '@playwright/test';
import { login, dismissOnboarding } from './helpers.js';

test.describe('Profile editing', () => {
    test.setTimeout(60000);

    test('can navigate to profile edit page', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/setting/profile');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/setting\/profile/);
    });

    test('profile edit form shows user fields', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/setting/profile');
        await page.waitForLoadState('networkidle');

        // Name input should be visible
        const nameInput = page.locator('#input-name');
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Email input should be visible
        const emailInput = page.locator('#input-email');
        await expect(emailInput).toBeVisible();
    });

    test('profile edit shows description field', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/setting/profile');
        await page.waitForLoadState('networkidle');

        // Description is a textarea (no ID) - find by maxlength attribute
        const descInput = page.locator('textarea[maxlength="2000"]');
        await expect(descInput).toBeVisible({ timeout: 10000 });
    });

    test('profile page shows user info with tabs', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        // Navigate to own profile
        await page.goto('/profile/me');
        await page.waitForLoadState('networkidle');

        // Should see profile content
        const profileContent = page.locator('.profile-view, .profile, .user-profile');
        await expect(profileContent.first()).toBeVisible({ timeout: 10000 });
    });

    test('settings friends page loads', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/setting/friends');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/setting\/friends/);
    });
});
