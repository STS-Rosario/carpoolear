import { test, expect } from '@playwright/test';

test.describe('Register flow', () => {
    test('shows the registration form', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#txt_name')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#txt_surename')).toBeVisible();
        await expect(page.locator('#txt_email')).toBeVisible();
        await expect(page.locator('#txt_password')).toBeVisible();
    });

    test('shows terms checkbox and submit button', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_name').waitFor({ state: 'visible', timeout: 15000 });
        await expect(page.locator('#cbx_terms')).toBeAttached();
        const submitBtn = page.locator('button.btn-primary.btn-outline, button.g-recaptcha').first();
        await expect(submitBtn).toBeVisible();
    });

    test('shows validation error for invalid email', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_name').waitFor({ state: 'visible', timeout: 15000 });
        await page.fill('#txt_name', 'Test');
        await page.fill('#txt_surename', 'User');
        await page.fill('#txt_email', 'not-an-email');
        await page.fill('#txt_email_verification', 'not-an-email');
        await page.fill('#txt_password', 'password123');
        await page.fill('#txt_password_confirmation', 'password123');
        // Click checkbox directly (label contains a router-link that navigates away)
        await page.locator('#cbx_terms').click({ force: true });

        const submitBtn = page.locator('button.g-recaptcha').first();
        await submitBtn.click();

        // Should show alertify error or inline .error span
        const errorIndicator = page.locator('.error, .ajs-message.ajs-error');
        await expect(errorIndicator.first()).toBeVisible({ timeout: 10000 });
    });

    test('shows validation error for short password', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_name').waitFor({ state: 'visible', timeout: 15000 });
        await page.fill('#txt_name', 'Test');
        await page.fill('#txt_surename', 'User');
        await page.fill('#txt_email', 'newuser@test.com');
        await page.fill('#txt_email_verification', 'newuser@test.com');
        await page.fill('#txt_password', 'short');
        await page.fill('#txt_password_confirmation', 'short');
        // Click checkbox directly (label contains a router-link that navigates away)
        await page.locator('#cbx_terms').click({ force: true });

        const submitBtn = page.locator('button.g-recaptcha').first();
        await submitBtn.click();

        const errorIndicator = page.locator('.error, .ajs-message.ajs-error');
        await expect(errorIndicator.first()).toBeVisible({ timeout: 10000 });
    });

    test('shows error when passwords do not match', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_name').waitFor({ state: 'visible', timeout: 15000 });
        await page.fill('#txt_name', 'Test');
        await page.fill('#txt_surename', 'User');
        await page.fill('#txt_email', 'newuser@test.com');
        await page.fill('#txt_email_verification', 'newuser@test.com');
        await page.fill('#txt_password', 'password123');
        await page.fill('#txt_password_confirmation', 'different123');
        // Click checkbox directly (label contains a router-link that navigates away)
        await page.locator('#cbx_terms').click({ force: true });

        const submitBtn = page.locator('button.g-recaptcha').first();
        await submitBtn.click();

        const errorIndicator = page.locator('.error, .ajs-message.ajs-error');
        await expect(errorIndicator.first()).toBeVisible({ timeout: 10000 });
    });

    test('shows error when emails do not match', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_name').waitFor({ state: 'visible', timeout: 15000 });
        await page.fill('#txt_name', 'Test');
        await page.fill('#txt_surename', 'User');
        await page.fill('#txt_email', 'newuser@test.com');
        await page.fill('#txt_email_verification', 'different@test.com');
        await page.fill('#txt_password', 'password123');
        await page.fill('#txt_password_confirmation', 'password123');
        // Click checkbox directly (label contains a router-link that navigates away)
        await page.locator('#cbx_terms').click({ force: true });

        const submitBtn = page.locator('button.g-recaptcha').first();
        await submitBtn.click();

        const errorIndicator = page.locator('.error, .ajs-message.ajs-error');
        await expect(errorIndicator.first()).toBeVisible({ timeout: 10000 });
    });
});
