import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import ReferencesApi from './References.js';

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

describe('ReferencesApi', () => {
    let api;

    beforeEach(() => {
        api = new ReferencesApi();
        network.post.mockClear();
        network.post.mockResolvedValue({ data: {} });
    });

    it('creates a reference', () => {
        api.create({ trip_id: 1, comment: 'ok' });
        expectNetworkCall(network.post, '/api/references', { trip_id: 1, comment: 'ok' });
    });

    it('replies to a reference for a user', () => {
        api.reply(9, { comment: 'gracias' });
        expectNetworkCall(network.post, '/api/references/reply/9', { comment: 'gracias' });
    });
});
