import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const countActionMock = vi.fn(() => Promise.resolve());
const getMessagesMock = vi.fn(() => Promise.resolve({ data: [] }));

vi.mock('../services/api', () => ({
    ConversationApi: class ConversationApiMock {
        getMessages = getMessagesMock;
    }
}));

vi.mock('../services/dialogs.js', () => ({
    default: {
        message: vi.fn()
    }
}));

vi.mock('../i18n', () => ({
    default: {
        global: {
            t: (key) => key
        }
    }
}));

vi.mock('../utils/routerLazy.js', () => ({
    fireLazyRouterPush: vi.fn(),
    lazyRouterPush: vi.fn()
}));

vi.mock('./notifications', () => ({
    useNotificationsStore: () => ({
        countAction: countActionMock
    })
}));

describe('conversations store navigation badges', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        countActionMock.mockClear();
        getMessagesMock.mockClear();
    });

    it('refreshes navigation badge counts when opening a conversation', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();
        store.selectedID = 5;
        store.messages = { 5: { list: [], lastPage: false } };

        await store.findMessage({ id: 5, more: false });

        expect(getMessagesMock).toHaveBeenCalled();
        expect(countActionMock).toHaveBeenCalledTimes(1);
    });

    it('does not refresh navigation badge counts when loading older messages', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();
        store.selectedID = 5;
        store.messages = {
            5: { list: [{ id: 1, created_at: '2026-01-01' }], lastPage: false }
        };

        await store.findMessage({ id: 5, more: true });

        expect(countActionMock).not.toHaveBeenCalled();
    });
});
