import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import RateApi from './Rating.js';

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

describe('RateApi', () => {
    let api;

    beforeEach(() => {
        api = new RateApi();
        network.get.mockClear();
        network.post.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
    });

    it('lists ratings for a user or for the current user', () => {
        api.index(4, { page: 1 });
        expectNetworkCall(network.get, '/api/users/4/ratings', { page: 1 });

        api.index(null, {});
        expectNetworkCall(network.get, '/api/users/ratings', {});
    });

    it('lists pending ratings', () => {
        api.pending({ days: 7 });
        expectNetworkCall(network.get, '/api/users/ratings/pending', { days: 7 });
    });

    it('posts a rating for a trip and user', () => {
        api.rate(1, 2, { comment: 'ok', rating: 5 });
        expectNetworkCall(network.post, '/api/trips/1/rate/2', { comment: 'ok', rating: 5 });
    });

    it('posts a reply for a trip and user', () => {
        api.reply(1, 2, { comment: 'gracias' });
        expectNetworkCall(network.post, '/api/trips/1/reply/2', { comment: 'gracias' });
    });
});
