import { describe, it, expect, vi, beforeEach } from 'vitest';
import FriendApi from './FriendApi.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('FriendApi', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('GETs the friends index with query params', () => {
        const params = { page: 2 };

        new FriendApi().index(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/friends',
            params,
            undefined
        );
    });

    it('POSTs to accept a friend request by user id', () => {
        new FriendApi().accept(4);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/friends/accept/4',
            {},
            undefined
        );
    });

    it('POSTs to cancel a friend request by user id', () => {
        new FriendApi().cancelRequest(4);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/friends/cancel-request/4',
            {},
            undefined
        );
    });

    it('POSTs to toggle trip alerts for a user id', () => {
        new FriendApi().toggleTripAlerts(9);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/friends/trip-alerts/9',
            {},
            undefined
        );
    });
});
