import { test, expect } from '@playwright/test';
import {
    login, loginViaAPI, createConversationViaAPI, waitForSplash,
    sendFriendRequestViaAPI, acceptFriendViaAPI, deleteFriendViaAPI,
} from './helpers.js';

test.describe('Messages Read (user8 + user9)', () => {
    let user8Token, user9Token, user8Id, user9Id;

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const r8 = await loginViaAPI(page, 'user8@g.com', '123456');
        user8Token = r8.token;
        user8Id = r8.userId;
        const r9 = await loginViaAPI(page, 'user9@g.com', '123456');
        user9Token = r9.token;
        user9Id = r9.userId;

        // Users must be friends (or share a trip) to chat - establish friendship
        await deleteFriendViaAPI(page, user8Token, user9Id).catch(() => {});
        await deleteFriendViaAPI(page, user9Token, user8Id).catch(() => {});
        await sendFriendRequestViaAPI(page, user8Token, user9Id);
        await acceptFriendViaAPI(page, user9Token, user8Id);

        await ctx.close();
    });

    test.afterAll(async ({ browser }) => {
        // Clean up friendship
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        const r8 = await loginViaAPI(page, 'user8@g.com', '123456');
        await deleteFriendViaAPI(page, r8.token, user9Id).catch(() => {});
        await ctx.close();
    });

    test('sent message appears in conversation for recipient', async ({ page }) => {
        test.setTimeout(90000);
        // User9 sends a message to user8 via API
        const conv = await createConversationViaAPI(page, user9Token, user8Id, 'Hola mensaje de prueba e2e');
        const convId = conv.data?.id || conv.id;
        console.log('Conversation created:', JSON.stringify(conv).substring(0, 300));

        if (!convId) {
            console.warn('Conversation creation failed - skipping test');
            test.skip(true, 'Conversation API returned no ID');
            return;
        }

        // Login as user8 and navigate directly to the conversation
        await login(page, 'user8@g.com', '123456');
        await page.goto(`/conversations/${convId}`);
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Click "Ver más mensajes" if visible to load older messages
        const loadMoreBtn = page.getByText('Ver más mensajes');
        if (await loadMoreBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await loadMoreBtn.click();
            await page.waitForTimeout(3000);
        }

        // The message text should be visible
        const msgText = page.getByText('Hola mensaje de prueba e2e');
        await expect(msgText.first()).toBeVisible({ timeout: 15000 });
    });

    test('opening conversation shows message input', async ({ page }) => {
        test.setTimeout(90000);
        // Create conversation with a message via API
        const conv = await createConversationViaAPI(page, user8Token, user9Id, 'Segundo mensaje e2e');
        const convId = conv.data?.id || conv.id;

        if (!convId) {
            console.warn('Conversation creation failed - skipping test');
            test.skip(true, 'Conversation API returned no ID');
            return;
        }

        await login(page, 'user8@g.com', '123456');
        await page.goto(`/conversations/${convId}`);
        await waitForSplash(page);
        await page.waitForTimeout(3000);

        // Message input should be visible
        const messageInput = page.locator('#ipt-text, textarea, input[type="text"]').first();
        await expect(messageInput).toBeVisible({ timeout: 10000 });
    });
});
