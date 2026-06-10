import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';

const listMock = vi.fn();
const requestMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {
                request: requestMock
            };
        }
    },
    UserApi: class UserApiMock {
        list(data) {
            return listMock(data);
        }
    }
}));

describe('friends store searchUsers', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        listMock.mockReset();
        requestMock.mockReset();
        requestMock.mockResolvedValue({});
    });

    it('stores user list items from the API data envelope', async () => {
        listMock.mockResolvedValue({
            data: [{ id: 5, name: 'Lilliana Treutel', state: 'none' }]
        });

        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();

        await store.searchUsers('Lil');

        expect(listMock).toHaveBeenCalledWith({ value: 'Lil' });
        expect(store.users).toEqual([
            { id: 5, name: 'Lilliana Treutel', state: 'none' }
        ]);
    });

    it('marks pending requests as request in the local list', async () => {
        listMock.mockResolvedValue({
            data: [{ id: 5, name: 'Lilliana Treutel', state: 'none' }]
        });

        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();

        await store.searchUsers('Lil');
        await store.request(5);

        expect(store.users[0].state).toBe('request');
    });

    it('does not reset to an empty array when the in-flight request is cancelled', async () => {
        const cancelError = new Error('Abort by the system');
        vi.spyOn(axios, 'isCancel').mockReturnValue(true);
        listMock.mockRejectedValue(cancelError);

        const { useFriendsStore } = await import('./friends');
        const store = useFriendsStore();

        await expect(store.searchUsers('Li')).rejects.toBe(cancelError);
        expect(store.users).toBeNull();
    });
});
