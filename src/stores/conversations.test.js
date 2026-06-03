import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../services/api', () => ({
    ConversationApi: class ConversationApiMock {
        constructor() {
            return {};
        }
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

describe('conversations store list getter', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('returns null while conversations are loading so UI can show loading state', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = null;

        expect(store.list).toBeNull();
    });

    it('returns empty array after loading when user has no conversations', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = [];

        expect(store.list).toEqual([]);
    });
});
