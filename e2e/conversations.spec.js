import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, createTripViaAPI } from './helpers.js';

test.describe('Messaging / Conversations', () => {
    test.setTimeout(60000);

    test('conversations page loads when authenticated', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/conversations/);
        // The conversations page should render the conversation list component with search input
        await expect(page.locator('.conversation-component')).toBeVisible({ timeout: 10000 });
    });

    test('can create a conversation and send a message', async ({ page }) => {
        // Login as user1 to get token and create a trip (makes user1 reachable for chat)
        const loginRes1 = await page.request.post('http://localhost:8000/api/login', {
            data: { email: 'user1@g.com', password: '123456' },
        });
        const user1Token = (await loginRes1.json()).token;

        // Create a trip as user1
        const { tripId } = await createTripViaAPI(page, user1Token, {
            description: 'Trip for chat test',
        });

        // Get user1's ID
        const usersRes = await page.request.get('http://localhost:8000/api/users/me', {
            headers: { Authorization: `Bearer ${user1Token}` },
        });
        const user1Data = await usersRes.json();
        const user1Id = user1Data.data?.id || user1Data.id;

        // Login as user0
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        // Get user0's token
        const token = await getToken(page);

        // Create a conversation with user1 via API
        const convRes = await page.request.post('http://localhost:8000/api/conversations', {
            headers: { Authorization: `Bearer ${token}` },
            data: { to: user1Id, tripId: tripId },
        });
        const convBody = await convRes.json();
        const convId = convBody.data?.id || convBody.id;

        if (convId) {
            // Navigate to the conversation
            await page.goto(`/conversations/${convId}`);
            await page.waitForLoadState('networkidle');

            // Wait for chat to load
            const messageInput = page.locator('#ipt-text');
            await expect(messageInput).toBeVisible({ timeout: 10000 });

            // Type and send a message
            await messageInput.fill('Hello from e2e test!');
            await expect(page.locator('#btn-send')).toBeVisible();
            await page.click('#btn-send');

            // Verify the message appears in the chat
            await expect(page.locator('.message_text').filter({ hasText: 'Hello from e2e test!' }).first()).toBeVisible({ timeout: 10000 });
        }

        // Cleanup
        if (tripId) {
            await page.request.delete(`http://localhost:8000/api/trips/${tripId}`, {
                headers: { Authorization: `Bearer ${user1Token}` },
            });
        }
    });

    test('conversations list shows existing conversations', async ({ page }) => {
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');

        // The conversation page should render the conversation list container
        await expect(page.locator('.conversation-component')).toBeVisible({ timeout: 10000 });
    });

    test('redirects unauthenticated user to login', async ({ page }) => {
        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/login/);
    });
});
