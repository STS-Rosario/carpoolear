import { test, expect } from '@playwright/test';
import { login, dismissOnboarding, getToken, setupAutocompleteMocks, createTripViaUI, deleteTripViaAPI } from './helpers.js';

test.describe('Messaging / Conversations', () => {
    test.setTimeout(90000);

    test('conversations page loads when authenticated', async ({ page }) => {
        await login(page);
        await dismissOnboarding(page);

        // Navigate to conversations via the UI
        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/conversations/);
        // The conversations page should render with search input
        await expect(page.locator('.conversation-component')).toBeVisible({ timeout: 10000 });
    });

    test('can search for users in conversations page', async ({ page }) => {
        // First, create a trip as user1 via UI so user1 is "chattable"
        await setupAutocompleteMocks(page);
        await login(page, 'user1@g.com', '123456');
        await dismissOnboarding(page);
        const user1TripId = await createTripViaUI(page, {
            description: 'Trip to enable chat',
        });
        const user1Token = await getToken(page);

        // Now login as user0
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        // Navigate to conversations
        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');

        // Search for user1 by name in the search input
        const searchInput = page.locator('.conversation_list input[type="text"]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('Lazaro');
        await page.click('#btn-search');

        // Wait for search results - either user list items or "no matches" alert
        const userResult = page.locator('.conversation_chat--search .list-group-item');
        const noResults = page.locator('.conversation_chat--search .alert-warning');
        await expect(userResult.first().or(noResults.first())).toBeVisible({ timeout: 10000 });

        // Cleanup
        await deleteTripViaAPI(page, user1TripId, user1Token);
    });

    test('can create a conversation and send a message via UI', async ({ page }) => {
        // Create a trip as user1 via UI so user0 can message user1 via the trip page
        await setupAutocompleteMocks(page);
        await login(page, 'user1@g.com', '123456');
        await dismissOnboarding(page);
        const user1TripId = await createTripViaUI(page, {
            description: 'Trip to enable chat for messaging test',
        });
        const user1Token = await getToken(page);

        // Login as user0
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        // Navigate to the trip detail page where user0 can message the driver (user1)
        await page.goto(`/trips/${user1TripId}`);
        await page.waitForLoadState('networkidle');

        // Click the "Enviar Mensaje" button on the trip detail page (outside any modal)
        const msgBtn = page.locator('.trip-detail button, .trip-detail a, main button, main a').filter({ hasText: /Enviar Mensaje/i }).first();
        await msgBtn.waitFor({ state: 'visible', timeout: 15000 });
        await msgBtn.click();

        // Handle "Carpoodatos" modal if it appears (user hint before sending message)
        // The modal uses .modal-container (not .modal-content)
        const modalMsgBtn = page.locator('.modal-container button').filter({ hasText: /Enviar Mensaje/i }).first();
        if (await modalMsgBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await modalMsgBtn.click();
        }

        // Should navigate to conversation chat
        await page.waitForURL(/\/conversations\/\d+/, { timeout: 15000 });

        // Wait for chat interface to load
        const messageInput = page.locator('#ipt-text');
        await expect(messageInput).toBeVisible({ timeout: 10000 });

        // Type and send a message
        await messageInput.fill('Hello from e2e test!');
        await expect(page.locator('#btn-send')).toBeVisible();
        await page.click('#btn-send');

        // Verify the message appears in the chat
        await expect(
            page.locator('.message_text').filter({ hasText: 'Hello from e2e test!' }).first()
        ).toBeVisible({ timeout: 10000 });

        // Cleanup
        await deleteTripViaAPI(page, user1TripId, user1Token);
    });

    test('redirects unauthenticated user to login', async ({ page }) => {
        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/\/login/);
    });
});
