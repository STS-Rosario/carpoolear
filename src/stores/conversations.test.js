import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const showByTripMock = vi.fn(() =>
    Promise.resolve({
        data: {
            id: 9,
            type: 1,
            trip_date: '2026-06-10 14:30:00',
            users: [
                { id: 1, name: 'Driver' },
                { id: 2, name: 'Passenger' }
            ]
        }
    })
);

const { getMessagesMock, listMock, sendMock, showMock } = vi.hoisted(() => ({
    getMessagesMock: vi.fn(() => Promise.resolve({ data: [] })),
    listMock: vi.fn(() =>
        Promise.resolve({
            data: [],
            meta: { pagination: { total_pages: 1, current_page: 1 } }
        })
    ),
    sendMock: vi.fn(),
    showMock: vi.fn(() =>
        Promise.resolve({
            data: {
                id: 9,
                type: 1,
                users: [
                    { id: 1, name: 'Driver' },
                    { id: 2, name: 'Passenger' }
                ]
            }
        })
    )
}));

vi.mock('../services/api', async (importOriginal) => {
    const actual = await importOriginal();

    return {
        ...actual,
        ConversationApi: class ConversationApiMock {
            showByTrip = showByTripMock;

            updateNotifications() {
                return Promise.resolve({
                    data: { id: 9, notifications_enabled: false }
                });
            }

            show = showMock;

            send = sendMock;

            getMessages(id, data) {
                return getMessagesMock(id, data);
            }

            list() {
                return listMock();
            }
        }
    };
});

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
        showByTripMock.mockClear();
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

        expect(showByTripMock).toHaveBeenCalledWith(42);
        expect(conversation.id).toBe(9);
        expect(conversation.type).toBe(1);
        expect(store.selectedID).toBe(9);
    });

    it('stores group chat participants returned by showByTrip for trip group chat UI', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        const conversation = await store.openTripGroupChat(42);

        expect(conversation.users).toEqual([
            { id: 1, name: 'Driver' },
            { id: 2, name: 'Passenger' }
        ]);
        expect(store.conversationSelected.type).toBe(1);
        expect(store.conversationSelected.users).toEqual([
            { id: 1, name: 'Driver' },
            { id: 2, name: 'Passenger' }
        ]);
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

describe('conversations store message pagination', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        getMessagesMock.mockClear();
        getMessagesMock.mockResolvedValue({ data: [] });
    });

    it('uses the oldest message id with its timestamp as the pagination cursor', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();
        const timestamp = '2026-01-02T03:04:05.000Z';

        store.selectedID = 9;
        store.messages[9] = {
            list: [{ id: 42, created_at: timestamp }],
            lastPage: false
        };

        await store.findMessage({ more: true });

        expect(getMessagesMock).toHaveBeenCalledWith(9, {
            read: true,
            unread: false,
            pageSize: 20,
            timestamp,
            before_id: 42
        });
    });
});

describe('conversations store unreadCount getter', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('returns zero while conversations are loading', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = null;

        expect(store.unreadCount).toBe(0);
    });

    it('counts conversations marked as unread', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = [
            { id: 1, unread: true },
            { id: 2, unread: false },
            { id: 3, unread: true }
        ];

        expect(store.unreadCount).toBe(2);
    });
});

describe('conversations store listSearch load-more loading', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        listMock.mockReset();
        listMock.mockResolvedValue({
            data: [{ id: 2, title: 'User 2' }],
            meta: { pagination: { total_pages: 2, current_page: 2 } }
        });
    });

    it('sets listLoadingMore while fetching the next page and clears it after success', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = [{ id: 1, title: 'User 1' }];
        store.listSearchParam.lastPage = false;

        expect(store.listLoadingMore).toBe(false);

        const promise = store.listSearch({ next: true });

        expect(store.listLoadingMore).toBe(true);

        await promise;

        expect(store.listLoadingMore).toBe(false);
    });

    it('clears listLoadingMore when the next page request fails', async () => {
        listMock.mockRejectedValueOnce(new Error('network'));

        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store._list = [{ id: 1, title: 'User 1' }];
        store.listSearchParam.lastPage = false;

        await expect(store.listSearch({ next: true })).rejects.toThrow('network');

        expect(store.listLoadingMore).toBe(false);
    });
});

describe('conversations store closed conversations', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        sendMock.mockReset();
        showMock.mockReset();
        showMock.mockResolvedValue({
            data: {
                id: 9,
                type: 1,
                users: [
                    { id: 1, name: 'Driver' },
                    { id: 2, name: 'Passenger' }
                ]
            }
        });
    });

    it('derives the closed flag from closed_at when fetching a conversation', async () => {
        showMock.mockResolvedValueOnce({
            data: { id: 9, type: 1, closed_at: '2026-08-01T00:00:00.000Z' }
        });

        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        await store.select(9);

        expect(store.conversationSelected.closed).toBe(true);
    });

    it('marks the conversation closed and warns when the backend rejects a send with conversation_closed', async () => {
        const { useConversationsStore } = await import('./conversations');
        const { default: dialogs } = await import('../services/dialogs.js');
        const store = useConversationsStore();

        store.selectedID = 9;
        store.conversationSelected = { id: 9, type: 1, closed: false };
        dialogs.message.mockClear();
        sendMock.mockRejectedValueOnce({
            status: 422,
            data: { errors: { conversation_id: ['conversation_closed'] } }
        });

        await expect(store.sendMessage('hola')).rejects.toBeTruthy();

        expect(store.conversationSelected.closed).toBe(true);
        expect(store.conversationSelected.closed_at).toBeTruthy();
        expect(dialogs.message).toHaveBeenCalledWith('chatCerrado', {
            estado: 'warning'
        });
    });

    it('does not mark the conversation closed for unrelated send errors', async () => {
        const { useConversationsStore } = await import('./conversations');
        const store = useConversationsStore();

        store.selectedID = 9;
        store.conversationSelected = { id: 9, type: 1, closed: false };
        sendMock.mockRejectedValueOnce({
            status: 500,
            data: { errors: {} }
        });

        await expect(store.sendMessage('hola')).rejects.toBeTruthy();

        expect(store.conversationSelected.closed).toBe(false);
    });
});
