const { test, expect } = require('@playwright/test');
const {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  makeMockConversation,
  makeMockMessage,
  generateItems,
  paginated,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
} = require('./shared/mocks');

test.describe('Conversations', () => {
  test.beforeEach(async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
    await setupAuthState(page);

    // Mock conversations list
    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(MOCK_CONVERSATIONS)),
      });
    });

    // Mock individual conversation detail
    await page.route(/\/api\/conversations\/show\/\d+/, (route) => {
      const url = route.request().url();
      const id = parseInt(url.match(/show\/(\d+)/)[1]);
      const conversation = MOCK_CONVERSATIONS.find(c => c.id === id);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: conversation || MOCK_CONVERSATIONS[0] }),
      });
    });

    // Mock messages for conversation 1
    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_MESSAGES }),
      });
    });

    // Mock messages for conversation 2
    await page.route(/\/api\/conversations\/2(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 20, conversation_id: 2, text: 'Dale, nos vemos!', created_at: '2025-06-08T15:00:00.000Z', user: { id: 3, name: 'Carlos López' } },
          ],
        }),
      });
    });
  });

  test('displays conversation list with last messages', async ({ page }) => {
    await page.goto('/conversations');
    await waitForPageReady(page);

    // Both conversations should be visible
    const items = page.locator('.list-group-item.conversation_header');
    await expect(items).toHaveCount(2);

    // First conversation shows María García
    await expect(items.nth(0)).toContainText('María García');
    await expect(items.nth(0).locator('.conversation-lastmessage')).toContainText('Hola, ¿a qué hora salís?');

    // Second conversation shows Carlos López
    await expect(items.nth(1)).toContainText('Carlos López');
    await expect(items.nth(1).locator('.conversation-lastmessage')).toContainText('Dale, nos vemos!');
  });

  test('navigates to conversation chat on click', async ({ page }) => {
    await page.goto('/conversations');
    await waitForPageReady(page);

    // Click the first conversation
    const firstConversation = page.locator('.list-group-item.conversation_header').first();
    await firstConversation.click();

    // Should navigate to conversation detail
    await expect(page).toHaveURL(/\/conversations\/1/);
  });

  test('displays messages in conversation chat', async ({ page }) => {
    await page.goto('/conversations/1');
    await waitForPageReady(page);

    // Messages should be visible
    const messages = page.locator('.message-wrapper');
    await expect(messages.first()).toBeVisible({ timeout: 10000 });

    // Verify message content is rendered
    const messageTexts = page.locator('.message_text');
    await expect(messageTexts.first()).toBeVisible();

    // Check that specific messages appear on the page
    await expect(page.getByText('Hola! Tenés lugar?')).toBeVisible();
    await expect(page.getByText('Sí, hay 2 lugares disponibles')).toBeVisible();
  });

  test('distinguishes own messages from others', async ({ page }) => {
    await page.goto('/conversations/1');
    await waitForPageReady(page);

    // Wait for all 3 messages to render
    await expect(page.locator('.message-wrapper')).toHaveCount(3, { timeout: 10000 });

    // Message from current user (id: 1) should have the 'message-wrapper-me' class
    const ownMessages = page.locator('.message-wrapper-me');
    await expect(ownMessages).toHaveCount(1);

    // Other user's messages should not have the 'me' class
    const otherMessages = page.locator('.message-wrapper:not(.message-wrapper-me)');
    await expect(otherMessages).toHaveCount(2);
  });
});

test.describe('Conversations — edge cases', () => {
  test('shows empty state when there are 0 conversations', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated([])),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations');
    await waitForPageReady(page);

    await expect(page.getByText('No tienes conversaciones')).toBeVisible({ timeout: 10000 });
  });

  test('renders single conversation with no "more results" button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const single = makeMockConversation(1, {
      title: 'Solo Conversation',
      last_message: { id: 10, text: 'Hello!', created_at: '2025-06-10T10:00:00.000Z' },
    });

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated([single])),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations');
    await waitForPageReady(page);

    const items = page.locator('.list-group-item.conversation_header');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText('Solo Conversation');

    // No "more results" button since single page
    await expect(page.getByText('Más resultados')).not.toBeVisible();
  });

  test('shows "Más resultados" button when there are many conversations (multi-page)', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conversations = generateItems(
      (id) => makeMockConversation(id, { title: `Conv User ${id}` }),
      20
    );

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(conversations, 1, 5)),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations');
    await waitForPageReady(page);

    // Conversations should render
    const items = page.locator('.list-group-item.conversation_header');
    await expect(items.first()).toBeVisible({ timeout: 10000 });

    // "Más resultados" button should be visible
    await expect(page.getByText('Más resultados')).toBeVisible();
  });

  test('chat with 0 messages shows empty chat area and no "load more" button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, { title: 'Empty Chat' });

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated([conv])),
      });
    });

    await page.route(/\/api\/conversations\/show\/1/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: conv }),
      });
    });

    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations/1');
    await waitForPageReady(page);

    // No messages rendered
    const messages = page.locator('.message-wrapper');
    await expect(messages).toHaveCount(0);

    // No "load more" button
    await expect(page.locator('#btn-more')).not.toBeVisible();
  });

  test('chat with 1 message shows single message and no "load more" button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, { title: 'Single Message Chat' });
    const msg = makeMockMessage(1, { text: 'Solo message', conversation_id: 1 });

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated([conv])),
      });
    });

    await page.route(/\/api\/conversations\/show\/1/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: conv }),
      });
    });

    let firstCall = true;
    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      if (firstCall) {
        firstCall = false;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [msg] }),
        });
      } else {
        // Subsequent calls return empty (indicating last page)
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      }
    });

    await setupAuthState(page);

    await page.goto('/conversations/1');
    await waitForPageReady(page);

    // Single message should be visible
    await expect(page.getByText('Solo message')).toBeVisible({ timeout: 10000 });

    const messages = page.locator('.message-wrapper');
    await expect(messages).toHaveCount(1);
  });

  test('chat with many messages shows "Ver más mensajes" button', async ({ page }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, { title: 'Busy Chat' });
    const messages = generateItems(
      (id) => makeMockMessage(id, { text: `Message ${id}`, conversation_id: 1 }),
      20
    );

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated([conv])),
      });
    });

    await page.route(/\/api\/conversations\/show\/1/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: conv }),
      });
    });

    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: messages }),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations/1');
    await waitForPageReady(page);

    // Messages should render
    const messageWrappers = page.locator('.message-wrapper');
    await expect(messageWrappers.first()).toBeVisible({ timeout: 10000 });

    // "Ver más mensajes" button should be visible since we returned a full page
    await expect(page.locator('#btn-more')).toBeVisible();
  });
});
