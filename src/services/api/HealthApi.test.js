import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import HealthApi from './HealthApi.js';

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

describe('HealthApi', () => {
    let api;

    beforeEach(() => {
        api = new HealthApi();
        network.get.mockClear();
    });

    it('checks the health endpoint', () => {
        api.check();
        expect(network.get).toHaveBeenCalledWith('/api/health', undefined, undefined);
    });
});
