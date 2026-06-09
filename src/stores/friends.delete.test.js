import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const deleteMock = vi.fn();
const indexMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                delete: deleteMock,
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

describe('friends store delete', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        deleteMock.mockReset();
        indexMock.mockReset();
        deleteMock.mockResolvedValue('OK');
        indexMock.mockResolvedValue({
            data: [{ id: 8, name: 'Remaining Friend' }],
            current_page: 1,
            last_page: 1
        });
    });

    it('removes the friend locally and refreshes the friends list after delete', async () => {
        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();
        store.friends = [
            { id: 7, name: 'Removed Friend' },
            { id: 8, name: 'Remaining Friend' }
        ];
        store.friendsSearchParam.data = { value: 'Rem' };

        await store.delete(7);

        expect(deleteMock).toHaveBeenCalledWith(7);
        expect(indexMock).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Rem', page: 1, page_size: 20 })
        );
        expect(store.friends).toEqual([{ id: 8, name: 'Remaining Friend' }]);
    });
});
