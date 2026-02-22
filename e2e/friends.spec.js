import { test, expect } from '@playwright/test';
import {
    login, loginViaAPI, waitForSplash,
    sendFriendRequestViaAPI, acceptFriendViaAPI, deleteFriendViaAPI,
} from './helpers.js';

test.describe('Friends (user6 + user7)', () => {
    let user6Token, user7Token, user6Id, user7Id;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const r6 = await loginViaAPI(page, 'user6@g.com', '123456');
        user6Token = r6.token;
        user6Id = r6.userId;
        const r7 = await loginViaAPI(page, 'user7@g.com', '123456');
        user7Token = r7.token;
        user7Id = r7.userId;
        // Clean up any pre-existing friendships
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
        await deleteFriendViaAPI(page, user7Token, user6Id).catch(() => {});
        await ctx.close();
    });

    test('friends page loads with sections', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await page.goto('/setting/friends');
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        const content = page.locator('#friends-list, .friends-setting, h2, .alert').first();
        await expect(content).toBeVisible({ timeout: 10000 });
    });

    test('can search for users', async ({ page }) => {
        await login(page, 'user6@g.com', '123456');
        await page.goto('/setting/friends/search');
        await waitForSplash(page);
        await page.waitForTimeout(2000);

        const searchInput = page.locator('#input-name, input[type="text"]').first();
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.fill('user');
        await page.waitForTimeout(3000);

        const results = page.locator('.friend-card, .list-group-item, .friends-request, .panel').first();
        await expect(results).toBeVisible({ timeout: 10000 });
    });

    test('can send friend request via API and see pending state', async ({ page }) => {
        test.setTimeout(90000);
        // Clean up first
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
        await deleteFriendViaAPI(page, user7Token, user6Id).catch(() => {});
        await page.waitForTimeout(1000);

        // Send friend request from user6 to user7
        const reqResult = await sendFriendRequestViaAPI(page, user6Token, user7Id);
        console.log('Friend request result:', JSON.stringify(reqResult));

        // Login as user7 and check pending requests
        await login(page, 'user7@g.com', '123456');
        await page.goto('/setting/friends');
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Reload to ensure fresh data from API
        await page.reload();
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Check for pending request indicators
        const acceptBtn = page.locator('.btn-accept-request').first();
        const pendingSection = page.locator('.pending-buttons, .friends-request').first();
        const pendingHeader = page.getByText(/solicitudes pendientes|solicitudes de amistad/i).first();

        const hasAccept = await acceptBtn.isVisible({ timeout: 5000 }).catch(() => false);
        const hasPending = await pendingSection.isVisible({ timeout: 2000 }).catch(() => false);
        const hasHeader = await pendingHeader.isVisible({ timeout: 2000 }).catch(() => false);

        expect(hasAccept || hasPending || hasHeader).toBeTruthy();

        // Clean up
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
    });

    test('can accept a friend request', async ({ page }) => {
        test.setTimeout(90000);
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
        await deleteFriendViaAPI(page, user7Token, user6Id).catch(() => {});
        await page.waitForTimeout(1000);
        const reqResult = await sendFriendRequestViaAPI(page, user7Token, user6Id);
        console.log('Friend request (u7→u6):', JSON.stringify(reqResult));

        await login(page, 'user6@g.com', '123456');
        await page.goto('/setting/friends');
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Reload to ensure fresh data
        await page.reload();
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        const acceptBtn = page.locator('.btn-accept-request').first();
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });
        await acceptBtn.click();
        // Button should disappear reactively after API accept
        await expect(acceptBtn).not.toBeVisible({ timeout: 15000 });

        // Clean up
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
    });

    test('can reject a friend request', async ({ page }) => {
        test.setTimeout(90000);
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
        await deleteFriendViaAPI(page, user7Token, user6Id).catch(() => {});
        await page.waitForTimeout(1000);
        await sendFriendRequestViaAPI(page, user7Token, user6Id);

        await login(page, 'user6@g.com', '123456');
        await page.goto('/setting/friends');
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Reload to ensure fresh data
        await page.reload();
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // The reject button is the non-accept button in pending-buttons
        const rejectBtn = page.locator('.pending-buttons button:not(.btn-accept-request)').first();
        await expect(rejectBtn).toBeVisible({ timeout: 10000 });
        await rejectBtn.click();

        // Accept button should disappear reactively after reject
        const acceptBtn = page.locator('.btn-accept-request');
        await expect(acceptBtn).toHaveCount(0, { timeout: 15000 });
    });

    test('can delete an existing friend', async ({ page }) => {
        test.setTimeout(90000);
        await deleteFriendViaAPI(page, user6Token, user7Id).catch(() => {});
        await deleteFriendViaAPI(page, user7Token, user6Id).catch(() => {});
        await page.waitForTimeout(1000);
        const reqResult = await sendFriendRequestViaAPI(page, user6Token, user7Id);
        console.log('Friend request (u6→u7):', JSON.stringify(reqResult));
        await page.waitForTimeout(500);
        const accResult = await acceptFriendViaAPI(page, user7Token, user6Id);
        console.log('Friend accept (u7):', JSON.stringify(accResult));

        await login(page, 'user6@g.com', '123456');
        await page.goto('/setting/friends');
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Reload for fresh data
        await page.reload();
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        const deleteBtn = page.locator('.delete-friend').first();
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });
        // Use dispatchEvent because the name text overflows and intercepts pointer events
        await deleteBtn.dispatchEvent('click');

        // Delete button should disappear reactively
        await expect(deleteBtn).not.toBeVisible({ timeout: 15000 });
    });
});
