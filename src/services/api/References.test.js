import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReferencesApi from './References.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    post: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('ReferencesApi', () => {
    beforeEach(() => {
        networkMock.post.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('POSTs a new reference', async () => {
        const data = { rating: 5, comment: 'great' };

        await new ReferencesApi().create(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/references',
            data,
            undefined
        );
    });

    it('POSTs a reply to a reference by author user id', async () => {
        const data = { body: 'thanks' };

        await new ReferencesApi().reply(12, data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/references/reply/12',
            data,
            undefined
        );
    });
});
