import { describe, it, expect, vi, beforeEach } from 'vitest';
import TripCreationTemplateApi from './TripCreationTemplate.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('TripCreationTemplateApi', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('GETs the template index', async () => {
        await new TripCreationTemplateApi().index();

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/trip-creation-templates',
            undefined,
            undefined
        );
    });

    it('POSTs a new template', async () => {
        const data = { name: 'roadtrip' };

        await new TripCreationTemplateApi().store(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/trip-creation-templates',
            data,
            undefined
        );
    });

    it('GETs a template by URL-encoded name', async () => {
        await new TripCreationTemplateApi().show('a b');

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/trip-creation-templates/a%20b',
            undefined,
            undefined
        );
    });
});
