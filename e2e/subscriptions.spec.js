import { test, expect } from '@playwright/test';
import {
    login, loginViaAPI, setupConfigOverride,
    createSubscriptionViaAPI, deleteSubscriptionViaAPI,
} from './helpers.js';

test.describe('Subscriptions (user8)', () => {
    let token;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const result = await loginViaAPI(page, 'user8@g.com', '123456');
        token = result.token;
        await ctx.close();
    });

    test('subscription visible on my-trips page', async ({ page }) => {
        test.setTimeout(90000);
        await setupConfigOverride(page);
        const sub = await createSubscriptionViaAPI(page, token);
        const subId = sub.id || sub.data?.id;

        try {
            await login(page, 'user8@g.com', '123456');
            await page.goto('/my-trips');
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);

            const subsSection = page.locator('#suscriptions');
            await expect(subsSection).toBeVisible({ timeout: 10000 });
        } finally {
            if (subId) await deleteSubscriptionViaAPI(page, token, subId);
        }
    });

    test('subscription shows origin and destination', async ({ page }) => {
        test.setTimeout(90000);
        await setupConfigOverride(page);
        const sub = await createSubscriptionViaAPI(page, token, {
            from_address: 'Rosario, Santa Fe',
            to_address: 'Mendoza, Mendoza',
        });
        const subId = sub.id || sub.data?.id;

        try {
            await login(page, 'user8@g.com', '123456');
            await page.goto('/my-trips');
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);

            // Verify Rosario and Mendoza appear in the subscription item
            const subItem = page.locator('.suscription-item_component, #suscriptions').first();
            await expect(subItem).toBeVisible({ timeout: 10000 });
            await expect(page.getByText(/Rosario/i).first()).toBeVisible({ timeout: 5000 });
            await expect(page.getByText(/Mendoza/i).first()).toBeVisible({ timeout: 5000 });
        } finally {
            if (subId) await deleteSubscriptionViaAPI(page, token, subId);
        }
    });

    test('can delete subscription via UI', async ({ page }) => {
        test.setTimeout(90000);
        await setupConfigOverride(page);
        const sub = await createSubscriptionViaAPI(page, token);
        const subId = sub.id || sub.data?.id;

        await login(page, 'user8@g.com', '123456');
        await page.goto('/my-trips');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);

        // Click delete button on subscription item
        const deleteBtn = page.locator('#suscriptions .btn, #suscriptions .fa-trash-o, #suscriptions .fa-trash').first();
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });

        // Handle potential confirmation dialog
        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await deleteBtn.click();
        await page.waitForTimeout(3000);

        // Subscription section should disappear or be empty
        const subsSection = page.locator('#suscriptions');
        const stillVisible = await subsSection.isVisible({ timeout: 3000 }).catch(() => false);
        if (stillVisible) {
            // Section might still exist but item should be gone
            const items = page.locator('#suscriptions .suscription-item_component');
            await expect(items).toHaveCount(0, { timeout: 5000 });
        }
    });
});
