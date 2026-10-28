const { test, expect } = require('@playwright/test');
const {
  MOCK_CONFIG,
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

    await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(MOCK_CONVERSATIONS)),
      });
    });

    await page.route(/\/api\/conversations\/show\/\d+/, (route) => {
      const url = route.request().url();
      const id = parseInt(url.match(/show\/(\d+)/)[1], 10);
      const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: conversation || MOCK_CONVERSATIONS[0] }),
      });
    });

    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_MESSAGES }),
      });
    });

    await page.route(/\/api\/conversations\/2(\?.*)?$/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 20,
              conversation_id: 2,
              text: 'Dale, nos vemos!',
              created_at: '2025-06-08T15:00:00.000Z',
              user: { id: 3, name: 'Carlos López' },
            },
          ],
        }),
      });
    });
  });

  test('displays conversation list with last messages', async ({ page }) => {
    await page.goto('/conversations');
    await waitForPageReady(page);

    await expect(page.getByText('María García')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Hola, ¿a qué hora salís?')).toBeVisible();
    await expect(page.getByText('Carlos López')).toBeVisible();
    await expect(page.getByText('Dale, nos vemos!')).toBeVisible();
  });

  test('navigates to conversation chat on click', async ({ page }) => {
    await page.goto('/conversations');
    await waitForPageReady(page);

    await page.getByText('María García').click();
    await expect(page).toHaveURL(/\/conversations\/1/);
  });

  test('displays other participant ratings in conversation chat header on desktop', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/conversations/1');
    await waitForPageReady(page);

    await expect(page.getByText('Hola! Tenés lugar?')).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText('8', { exact: true }).filter({ visible: true })
    ).toBeVisible();
    await expect(
      page.getByText('2', { exact: true }).filter({ visible: true })
    ).toBeVisible();
  });

  test('displays messages in conversation chat', async ({ page }) => {
    await page.goto('/conversations/1');
    await waitForPageReady(page);

    await expect(page.getByText('Hola! Tenés lugar?')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('Sí, hay 2 lugares disponibles')).toBeVisible();
  });

  test('sends a message and clears the editor', async ({ page }) => {
    await page.route(/\/api\/conversations\/1\/send/, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 100,
            conversation_id: 1,
            text: 'Test message',
            created_at: '2025-07-15T12:01:00.000Z',
            user: { id: 1, name: 'Juan Pérez' },
          },
        }),
      });
    });

    await page.goto('/conversations/1');
    await waitForPageReady(page);

    await expect(page.getByText('Hola! Tenés lugar?')).toBeVisible({
      timeout: 10000,
    });

    // Toast UI uses a contenteditable surface (stable HTML contract for rich text).
    const editor = page
      .locator('[contenteditable="true"]')
      .filter({ visible: true });
    await editor.click();
    await page.keyboard.type('Hello! This is a test message');

    const sendResponse = page.waitForResponse(/\/api\/conversations\/1\/send/);
    await page.getByRole('button', { name: /enviar mensaje/i }).click();
    await sendResponse;

    await expect(
      page.getByText('Hello! This is a test message')
    ).not.toBeVisible({
      timeout: 10000,
    });
  });

  test('shows messages from current user and other participants', async ({ page }) => {
    await page.goto('/conversations/1');
    await waitForPageReady(page);

    await expect(page.getByText('Hola! Tenés lugar?')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText('Sí, hay 2 lugares disponibles')).toBeVisible();
    await expect(
      page.getByText('Hola, ¿a qué hora salís?', { exact: true }).first()
    ).toBeVisible();
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

    await expect(page.getByText('No tienes conversaciones')).toBeVisible({
      timeout: 10000,
    });
  });

  test('renders single conversation with no "more results" button', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const single = makeMockConversation(1, {
      title: 'Solo Conversation',
      last_message: {
        id: 10,
        text: 'Hello!',
        created_at: '2025-06-10T10:00:00.000Z',
      },
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

    await expect(page.getByText('Solo Conversation')).toBeVisible();
    await expect(page.getByText('Más resultados')).not.toBeVisible();
  });

  test('shows "Más resultados" button when there are many conversations (multi-page)', async ({
    page,
  }) => {
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

    await expect(page.getByText('Conv User 1', { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole('button', { name: /más resultados/i })
    ).toBeVisible();
  });

  test('empty conversation with purged history shows retention note and no "load more" button', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, {
      title: 'Empty Chat',
      history_pruned: true,
    });

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

    await expect(
      page.getByRole('button', { name: /enviar mensaje/i })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole('button', { name: /ver más mensajes/i })
    ).not.toBeVisible();
    await expect(
      page.getByText(
        'Los mensajes de más de 1 año son eliminados automáticamente.'
      )
    ).toBeVisible();
  });

  test('chat with 1 recent message does not claim older history was purged', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, { title: 'Single Message Chat' });
    const msg = makeMockMessage(1, {
      text: 'Solo message',
      conversation_id: 1,
    });

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
    let messageRequestCount = 0;
    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      messageRequestCount += 1;
      if (firstCall) {
        firstCall = false;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [msg] }),
        });
      } else {
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

    await expect(page.getByText('Solo message', { exact: true })).toBeVisible({
      timeout: 10000,
    });
    const loadMoreButton = page.getByRole('button', {
      name: /ver más mensajes/i,
    });
    if (await loadMoreButton.isVisible()) {
      await loadMoreButton.click();
    }
    await expect.poll(() => messageRequestCount).toBeGreaterThan(1);
    await expect(
      page.getByText(
        'Los mensajes de más de 1 año son eliminados automáticamente.'
      )
    ).not.toBeVisible();
    await expect(loadMoreButton).not.toBeVisible();
  });

  test('shows the retention note at the end of a conversation with purged history', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, {
      title: 'Conversation with purged history',
      history_pruned: true,
    });
    const msg = makeMockMessage(1, {
      text: 'Recent message',
      conversation_id: 1,
    });

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
      const data = firstCall ? [msg] : [];
      firstCall = false;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data }),
      });
    });

    await setupAuthState(page);
    const config = {
      ...MOCK_CONFIG,
      messages_retention_years: 2,
    };
    await page.route('**/api/config', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(config),
      });
    });
    await page.route('**/api/retoken', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token-for-testing',
          config,
        }),
      });
    });
    await page.goto('/conversations/1');
    await waitForPageReady(page);
    const notice = page.getByText(
      'Los mensajes de más de 2 años son eliminados automáticamente.'
    );
    await expect(notice).not.toBeVisible();
    await page.getByRole('button', { name: /ver más mensajes/i }).click();
    await expect(notice).toBeVisible();
  });

  test('chat with many messages shows "Ver más mensajes" button', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, {
      title: 'Busy Chat',
      history_pruned: true,
    });
    const messages = generateItems(
      (id) =>
        makeMockMessage(id, { text: `Message ${id}`, conversation_id: 1 }),
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

    let firstCall = true;
    await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
      const data = firstCall ? messages : [];
      firstCall = false;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data }),
      });
    });

    await setupAuthState(page);

    await page.goto('/conversations/1');
    await waitForPageReady(page);

    await expect(page.getByText('Message 1', { exact: true })).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole('button', { name: /ver más mensajes/i })
    ).toBeVisible();
    await page.locator('#messagesWrapper').evaluate((element) => {
      element.scrollTop = 0;
    });
    await page.getByRole('button', { name: /ver más mensajes/i }).click();
    await expect(
      page.getByText(
        'Los mensajes de más de 1 año son eliminados automáticamente.'
      )
    ).toBeVisible();
  });

  test('keeps the visible message in place when loading an older page', async ({
    page,
  }) => {
    await freezeClock(page);
    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    const conv = makeMockConversation(1, { title: 'Paged Chat' });
    const recentMessages = Array.from({ length: 20 }, (_, index) =>
      makeMockMessage(index + 1, {
        text: `Message ${index + 1}`,
        conversation_id: 1,
        created_at: new Date(
          Date.UTC(2025, 5, 10, 10, index)
        ).toISOString(),
      })
    ).reverse();
    const olderMessages = Array.from({ length: 20 }, (_, index) =>
      makeMockMessage(index + 21, {
        text: `Message ${index + 21}`,
        conversation_id: 1,
        created_at: new Date(
          Date.UTC(2025, 5, 9, 10, index)
        ).toISOString(),
      })
    ).reverse();

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
    let releaseOlderPage;
    const olderPagePromise = new Promise((resolve) => {
      releaseOlderPage = resolve;
    });
    await page.route(/\/api\/conversations\/1(\?.*)?$/, async (route) => {
      const isFirstCall = firstCall;
      const data = isFirstCall ? recentMessages : olderMessages;
      firstCall = false;
      if (!isFirstCall) {
        await olderPagePromise;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data }),
      });
    });

    await setupAuthState(page);
    await page.goto('/conversations/1');
    await waitForPageReady(page);
    await expect(page.getByText('Message 1', { exact: true })).toBeVisible({
      timeout: 10000,
    });

    const wrapper = page.locator('#messagesWrapper');
    await wrapper.evaluate((element) => {
      element.scrollTop = 0;
    });
    const initialTop = (
      await page.getByText('Message 1', { exact: true }).boundingBox()
    ).y;

    const loadMoreButton = page.getByRole('button', {
      name: /ver más mensajes/i,
    });
    await loadMoreButton.click();
    await expect(loadMoreButton).toBeDisabled();
    releaseOlderPage();

    await expect(page.getByText('Message 21', { exact: true })).toBeVisible();
    await expect
      .poll(async () => {
        const box = await page
          .getByText('Message 1', { exact: true })
          .boundingBox();
        return box ? Math.abs(Math.round(box.y) - Math.round(initialTop)) : null;
      })
      .toBeLessThanOrEqual(2);
  });
});
