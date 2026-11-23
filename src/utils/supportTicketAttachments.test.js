import { describe, expect, it } from 'vitest';
import {
    DEFAULT_SUPPORT_TICKET_MAX_ATTACHMENTS,
    getSupportTicketMaxAttachments
} from './supportTicketAttachments';

describe('supportTicketAttachments', () => {
    it('defaults to six when config is missing', () => {
        expect(DEFAULT_SUPPORT_TICKET_MAX_ATTACHMENTS).toBe(6);
        expect(getSupportTicketMaxAttachments(null)).toBe(6);
        expect(getSupportTicketMaxAttachments({})).toBe(6);
    });

    it('reads support_ticket_max_attachments from app config', () => {
        expect(getSupportTicketMaxAttachments({ support_ticket_max_attachments: 8 })).toBe(8);
    });

    it('clamps config above hard cap', () => {
        expect(getSupportTicketMaxAttachments({ support_ticket_max_attachments: 99 })).toBe(20);
    });
});
