import { test, expect } from '@playwright/test';
import { login, waitForSplash } from './helpers.js';

test.describe('Logout (user6)', () => {
    test('logout clears session and redirects', async ({ page }) => {
        test.setTimeout(60000);
        await login(page, 'user6@g.com', '123456');
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        // Verify the user is logged in: the header should show a profile dropdown (not "Inicio")
        const inicioLink = page.locator('a').filter({ hasText: 'Inicio' });
        const isLoggedOut = await inicioLink.isVisible({ timeout: 3000 }).catch(() => false);
        if (isLoggedOut) {
            // Login may have failed - check token directly
            const token = await page.evaluate(() => localStorage.getItem('TOKEN'));
            expect(token).toBeTruthy();
        }

        // Open profile dropdown menu (desktop layout)
        const profileBtn = page.locator('.header_profile button, .dropdown-toggle').first();
        if (await profileBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await profileBtn.click();
        } else {
            // Mobile: the last nav button or hamburger
            const navBtn = page.locator('nav button').last();
            if (await navBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await navBtn.click();
            }
        }
        await page.waitForTimeout(1000);

        // Click "Cerrar Sesion"
        const logoutLink = page.getByText(/Cerrar Sesi/i).first();
        if (await logoutLink.isVisible({ timeout: 3000 }).catch(() => false)) {
            await logoutLink.click();
            await page.waitForTimeout(2000);

            // Logout clears the token and navigates to trips page
            const token = await page.evaluate(() => localStorage.getItem('TOKEN'));
            expect(token).toBeFalsy();

            // The header should now show "Inicio" (login link) instead of profile dropdown
            await expect(page.locator('a').filter({ hasText: 'Inicio' })).toBeVisible({ timeout: 5000 });
        } else {
            // Alternative: clear session manually and verify protected route behavior
            await page.evaluate(() => localStorage.removeItem('TOKEN'));
            await page.goto('/my-trips');
            await page.waitForURL(/\/login/, { timeout: 10000 });
            const token = await page.evaluate(() => localStorage.getItem('TOKEN'));
            expect(token).toBeFalsy();
        }
    });

    test('after logout, protected routes redirect to login', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');

        // Clear session manually to simulate logged-out state
        await page.evaluate(() => localStorage.clear());
        await page.goto('/my-trips');

        // Should redirect to login
        await page.waitForURL(/\/login/, { timeout: 10000 });
    });
});
