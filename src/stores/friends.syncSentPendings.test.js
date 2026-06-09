import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const sentPendingMock = vi.fn();
const indexMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                sentPending: sentPendingMock,
                index: indexMock
            };
        }
    },
    UserApi: class UserApiMock {
        constructor() {
            return {};
        }
    }
}));

describe('friends store sent pending sync', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        sentPendingMock.mockReset();
        indexMock.mockReset();
        indexMock.mockResolvedValue({
            data: [{ id: 2, name: 'Now Friend' }],
            current_page: 1,
            last_page: 1
        });
    });

    it('removes accepted users from sentPendings after loading friends', async () => {
        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();
        store.sentPendings = [
            { id: 2, name: 'Now Friend' },
            { id: 3, name: 'Still Pending' }
        ];

        await store.friendsSearch({});

        expect(store.friends).toEqual([{ id: 2, name: 'Now Friend' }]);
        expect(store.sentPendings).toEqual([{ id: 3, name: 'Still Pending' }]);
    });

    it('prunes sentPendings after reloading outgoing pending requests', async () => {
        sentPendingMock.mockResolvedValue({
            data: [
                { id: 2, name: 'Now Friend' },
                { id: 3, name: 'Still Pending' }
            ]
        });
        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();
        store.friends = [{ id: 2, name: 'Now Friend' }];

        await store.sentPending();

        expect(store.sentPendings).toEqual([{ id: 3, name: 'Still Pending' }]);
    });
});
