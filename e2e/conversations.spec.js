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
        // Create a trip as user1 via UI so user1 is "chattable" (usersCanChat check)
        await setupAutocompleteMocks(page);
        await login(page, 'user1@g.com', '123456');
        await dismissOnboarding(page);
        const user1TripId = await createTripViaUI(page, {
            description: 'Trip to enable chat for messaging test',
        });
        const user1Token = await getToken(page);

        // Get user1's actual name from the header (Faker names are random)
        const user1Name = await page.request.get('http://localhost:8000/api/users/me', {
            headers: { Authorization: `Bearer ${user1Token}` },
        }).then(r => r.json()).then(d => d.data.name);

        // Login as user0
        await login(page, 'user0@g.com', '123456');
        await dismissOnboarding(page);

        // Navigate to conversations page
        await page.goto('/conversations');
        await page.waitForLoadState('networkidle');

        // Search for user1 in the search bar
        const searchInput = page.locator('.conversation_list input[type="text"]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        // Search by a unique part of user1's name (skip common prefixes like Mr./Mrs.)
        const nameParts = user1Name.split(' ').filter(p => !p.match(/^(Mr|Mrs|Ms|Dr|Jr|Sr|II|III|IV|V)\.?$/i));
        const searchTerm = nameParts[0] || user1Name.split(' ').pop();
        await searchInput.fill(searchTerm);
        await page.click('#btn-search');

        // Wait for user results to appear and click first user
        const userResult = page.locator('.conversation_chat--search .list-group-item').first();
        await expect(userResult).toBeVisible({ timeout: 10000 });
        await userResult.click();

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
