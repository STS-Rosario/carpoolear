import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const sentPendingMock = vi.fn();
const cancelRequestMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                sentPending: sentPendingMock,
                cancelRequest: cancelRequestMock
            };
        }
    },
    UserApi: class UserApiMock {
        constructor() {
            return {};
        }
    }
}));

describe('friends store sent pending requests', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        sentPendingMock.mockReset();
        cancelRequestMock.mockReset();
        cancelRequestMock.mockResolvedValue('OK');
    });

    it('loads outgoing pending friend requests into sentPendings', async () => {
        sentPendingMock.mockResolvedValue({
            data: [{ id: 5, name: 'Lilliana Treutel' }]
        });

        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();

        await store.sentPending();

        expect(sentPendingMock).toHaveBeenCalled();
        expect(store.sentPendings).toEqual([
            { id: 5, name: 'Lilliana Treutel' }
        ]);
    });

    it('removes a canceled outgoing request from sentPendings', async () => {
        sentPendingMock.mockResolvedValue({ data: [] });
        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();
        store.sentPendings = [
            { id: 5, name: 'Lilliana Treutel' },
            { id: 6, name: 'Other User' }
        ];

        await store.cancelRequest(5);

        expect(cancelRequestMock).toHaveBeenCalledWith(5);
        expect(store.sentPendings).toEqual([{ id: 6, name: 'Other User' }]);
    });
});
