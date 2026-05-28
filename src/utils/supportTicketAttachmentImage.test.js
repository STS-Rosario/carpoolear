import { describe, it, expect } from 'vitest';
import {
    supportTicketAttachmentImagePath
} from './supportTicketAttachmentImage';

describe('supportTicketAttachmentImage', () => {
    it('builds user and admin attachment image API paths', () => {
        expect(supportTicketAttachmentImagePath(12, 34)).toBe(
            '/api/support/tickets/12/attachments/34/image'
        );
        expect(supportTicketAttachmentImagePath(12, 34, { admin: true })).toBe(
            '/api/admin/support/tickets/12/attachments/34/image'
        );
    });
});
