import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../services/api', () => ({
    ConversationApi: class ConversationApiMock {
        showByTrip() {
            return Promise.resolve({ data: { id: 9, type: 1, trip_date: '2026-06-10 14:30:00' } });
        }

        updateNotifications() {
            return Promise.resolve({ data: { id: 9, notifications_enabled: false } });
        }

        show() {
            return Promise.resolve({ data: { id: 9, type: 1 } });
        }

        getMessages() {
            return Promise.resolve({ data: [] });
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

    it('opens trip group chat by trip id and selects conversation', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        const conversation = await store.openTripGroupChat(42);

        expect(conversation.id).toBe(9);
        expect(store.selectedID).toBe(9);
    });

    it('updates conversation notification preference in selected conversation', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();
        store.conversationSelected = { id: 9, notifications_enabled: true };

        const updated = await store.setConversationNotifications({
            id: 9,
            enabled: false
        });

        expect(updated.notifications_enabled).toBe(false);
        expect(store.conversationSelected.notifications_enabled).toBe(false);
    });
});
