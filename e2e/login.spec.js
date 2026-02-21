import { test, expect } from '@playwright/test';
import { login, dismissOnboarding } from './helpers.js';

test.describe('Login flow', () => {
    test('shows the login form', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#txt_user')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('#txt_password')).toBeVisible();
        await expect(page.locator('#btn_login')).toBeVisible();
    });

    test('shows link to register page', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        // Desktop: .login-register class; Mobile: also .login-register
        await expect(page.locator('a.login-register').first()).toBeVisible({ timeout: 15000 });
    });

    test('shows link to forgot password', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        // Desktop: .login-forget; Mobile: .password-not
        const forgetLink = page.locator('a.login-forget, a.password-not');
        await expect(forgetLink.first()).toBeVisible({ timeout: 15000 });
    });

    test('can log in with valid credentials', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);
        await expect(page).toHaveURL(/\/trips/);
    });

    test('shows error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await page.locator('#txt_user').waitFor({ state: 'visible', timeout: 15000 });
        await page.fill('#txt_user', 'user0@g.com');
        await page.fill('#txt_password', 'wrongpassword');
        await page.click('#btn_login');

        // Alertifyjs shows error notification
        await expect(page.locator('.ajs-message.ajs-error')).toBeVisible({ timeout: 10000 });
    });

    test('shows error for empty fields', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');
        await page.locator('#btn_login').waitFor({ state: 'visible', timeout: 15000 });
        await page.click('#btn_login');
        // With empty fields, alertifyjs shows an error
        await expect(page.locator('.ajs-message.ajs-error')).toBeVisible({ timeout: 10000 });
    });

    test('redirects authenticated user away from login', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);
        await page.goto('/login');
        await page.waitForTimeout(2000);
        // Guest guard should redirect back to trips
        await expect(page).toHaveURL(/\/trips/, { timeout: 10000 });
    });
});
