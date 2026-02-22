import { test, expect } from '@playwright/test';

test.describe('Password Reset', () => {
    test('password reset page renders form', async ({ page }) => {
        await page.goto('/reset-password');
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('#txt_email')).toBeVisible({ timeout: 10000 });
    });

    test('shows error for non-existent email', async ({ page }) => {
        await page.goto('/reset-password');
        await page.waitForLoadState('domcontentloaded');
        await page.locator('#txt_email').waitFor({ state: 'visible', timeout: 10000 });
        await page.fill('#txt_email', 'nonexistent@example.com');
        await page.locator('button.btn-primary, input[type="submit"]').first().click();

        // Expect an error message
        const errorEl = page.locator('.error, .alert-danger, .text-danger, span.error').first();
        await expect(errorEl).toBeVisible({ timeout: 10000 });
    });

    test('shows success or error for valid email', async ({ page }) => {
        await page.goto('/reset-password');
        await page.waitForLoadState('domcontentloaded');
        await page.locator('#txt_email').waitFor({ state: 'visible', timeout: 10000 });
        await page.fill('#txt_email', 'user6@g.com');

        // Intercept the reset-password API to avoid rate limiting
        await page.route('**/api/reset-password', (route) => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: true }),
            });
        });

        await page.locator('button.btn-primary, input[type="submit"]').first().click();
        await page.waitForTimeout(2000);

        // Expect a success message (h3 or alert-success) or changed page state
        const successEl = page.locator('h3, .alert-success, .success-message').first();
        await expect(successEl).toBeVisible({ timeout: 10000 });
    });
});
