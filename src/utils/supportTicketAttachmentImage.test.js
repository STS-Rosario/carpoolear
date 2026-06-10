import { describe, it, expect, vi, afterEach } from 'vitest';
import {
    supportTicketAttachmentImagePath,
    openBlobImageInNewTab
} from './supportTicketAttachmentImage';

describe('supportTicketAttachmentImage', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('builds user and admin attachment image API paths', () => {
        expect(supportTicketAttachmentImagePath(12, 34)).toBe(
            '/api/support/tickets/12/attachments/34/image'
        );
        expect(supportTicketAttachmentImagePath(12, 34, { admin: true })).toBe(
            '/api/admin/support/tickets/12/attachments/34/image'
        );
    });

    it('opens a blob image URL in a new browser tab', () => {
        const open = vi.fn();
        vi.stubGlobal('open', open);

        openBlobImageInNewTab('blob:http://localhost/abc-123');

        expect(open).toHaveBeenCalledWith(
            'blob:http://localhost/abc-123',
            '_blank',
            'noopener,noreferrer'
        );
    });

    it('does not open a new tab when blob URL is missing', () => {
        const open = vi.fn();
        vi.stubGlobal('open', open);

        openBlobImageInNewTab('');
        openBlobImageInNewTab(null);
        openBlobImageInNewTab(undefined);

        expect(open).not.toHaveBeenCalled();
    });
});
