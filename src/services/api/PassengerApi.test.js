import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import PassengerApi from './PassengerApi.js';

const mockNetwork = vi.hoisted(() => ({
    pendingRequest: { add: vi.fn() },
    addRequest: vi.fn(),
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    put: vi.fn(() => Promise.resolve({})),
    patch: vi.fn(() => Promise.resolve({})),
    delete: vi.fn(() => Promise.resolve({}))
}));

vi.mock('../../services/network.js', () => ({ default: mockNetwork }));

function expectNetworkCall(method, url, params) {
    expect(method).toHaveBeenCalledWith(url, params, undefined);
}

describe('PassengerApi', () => {
    let api;

    beforeEach(() => {
        api = new PassengerApi();
        network.get.mockClear();
        network.post.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
    });

    it('lists pending payment requests', () => {
        api.pendingPaymentRequests();
        expectNetworkCall(network.get, '/api/users/payment-pending', {});
    });

    it('lists all requests and seat requests', () => {
        api.allRequest();
        expectNetworkCall(network.get, '/api/users/requests', {});

        api.seatRequests();
        expectNetworkCall(network.get, '/api/users/seat-requests', {});
    });

    it('lists requests for a trip', () => {
        api.tripRequest(6);
        expectNetworkCall(network.get, '/api/trips/6/requests', {});
    });

    it('makes a seat request for a trip', () => {
        api.make(6);
        expectNetworkCall(network.post, '/api/trips/6/requests', {});
    });

    it('accepts, cancels and rejects requests through a shared verb', () => {
        api.accept(6, 55);
        expectNetworkCall(network.post, '/api/trips/6/requests/55/accept', {});

        api.cancel(6, 56);
        expectNetworkCall(network.post, '/api/trips/6/requests/56/cancel', {});

        api.reject(6, 57);
        expectNetworkCall(network.post, '/api/trips/6/requests/57/reject', {});
    });

    it('lists trip transactions', () => {
        api.transactions();
        expectNetworkCall(network.get, '/api/trips/transactions', {});
    });
});
