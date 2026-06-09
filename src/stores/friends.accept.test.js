import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const acceptMock = vi.fn();
const indexMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                accept: acceptMock,
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

describe('friends store accept', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        acceptMock.mockReset();
        indexMock.mockReset();
        acceptMock.mockResolvedValue('OK');
        indexMock.mockResolvedValue({
            data: [{ id: 9, name: 'New Friend' }],
            current_page: 1,
            last_page: 1
        });
    });

    it('removes the accepted user from pendings and refreshes the friends list', async () => {
        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();
        store.pendings = [
            { id: 9, name: 'New Friend' },
            { id: 10, name: 'Other Pending' }
        ];
        store.friendsSearchParam.data = { value: 'New' };

        await store.accept(9);

        expect(acceptMock).toHaveBeenCalledWith(9);
        expect(indexMock).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'New', page: 1, page_size: 20 })
        );
        expect(store.pendings).toEqual([{ id: 10, name: 'Other Pending' }]);
        expect(store.friends).toEqual([{ id: 9, name: 'New Friend' }]);
    });
});
