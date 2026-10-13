import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicketsApi from './TicketsApi.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    put: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('TicketsApi admin ticket actions', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.put.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('POSTs needs-review for a ticket id', async () => {
        await new TicketsApi().adminMarkNeedsReview(5);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/support/tickets/5/needs-review',
            {},
            undefined
        );
    });

    it('POSTs purge-attachments for a ticket id', async () => {
        await new TicketsApi().adminPurgeAttachments(5);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/support/tickets/5/purge-attachments',
            {},
            undefined
        );
    });

    it('POSTs unresolve for a ticket id', async () => {
        await new TicketsApi().adminUnresolve(5);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/support/tickets/5/unresolve',
            {},
            undefined
        );
    });

    it('PUTs the type for an admin category update', async () => {
        await new TicketsApi().adminSetType(5, 'bug');

        expect(networkMock.put).toHaveBeenCalledWith(
            '/api/admin/support/tickets/5/type',
            { type: 'bug' },
            undefined
        );
    });
});

describe('TicketsApi admin reply templates', () => {
    beforeEach(() => {
        networkMock.post.mockClear();
    });

    it('POSTs duplicate for a reply template id', async () => {
        await new TicketsApi().adminReplyTemplateDuplicate(3);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/support/reply-templates/3/duplicate',
            {},
            undefined
        );
    });
});

describe('TicketsApi.toFormData', () => {
    beforeEach(() => {
        networkMock.post.mockClear();
    });

    it('limits attachments to three files', () => {
        const api = new TicketsApi();
        const files = [
            new File(['a'], 'a.png', { type: 'image/png' }),
            new File(['b'], 'b.png', { type: 'image/png' }),
            new File(['c'], 'c.png', { type: 'image/png' }),
            new File(['d'], 'd.png', { type: 'image/png' })
        ];

        const form = api.toFormData({
            subject: 'hello',
            attachments: files
        });

        expect(form.get('subject')).toBe('hello');
        expect(form.getAll('attachments[]')).toHaveLength(3);
    });

    it('POSTs multipart form data when creating a ticket', async () => {
        const api = new TicketsApi();

        await api.create({ subject: 'hello' });

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/support/tickets',
            expect.any(FormData),
            undefined
        );
    });
});
