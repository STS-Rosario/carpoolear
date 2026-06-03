import { describe, it, expect } from 'vitest';
import {
    SUPPORT_TICKET_REPLY_EDITOR_HEIGHT,
    SUPPORT_TICKET_REPLY_EDITOR_CLASS
} from './supportTicketReplyEditor';

describe('supportTicketReplyEditor', () => {
    it('uses doubled default height for reply composers', () => {
        expect(SUPPORT_TICKET_REPLY_EDITOR_HEIGHT).toBe('280px');
    });

    it('exposes a shared mount class for reply editor styling', () => {
        expect(SUPPORT_TICKET_REPLY_EDITOR_CLASS).toBe('support-ticket-reply-editor');
    });
});
