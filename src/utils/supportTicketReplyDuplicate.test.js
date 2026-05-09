import { describe, it, expect } from 'vitest';
import { ticketReplyBodyAlreadyUsed } from './supportTicketReplyDuplicate';

describe('ticketReplyBodyAlreadyUsed', () => {
    it('returns true when trimmed body matches an existing reply message', () => {
        const replies = [{ message_markdown: 'Same text.' }];
        expect(ticketReplyBodyAlreadyUsed(replies, 'Same text.')).toBe(true);
        expect(ticketReplyBodyAlreadyUsed(replies, '  Same text.  ')).toBe(true);
    });

    it('returns false when message is new', () => {
        const replies = [{ message_markdown: 'First' }];
        expect(ticketReplyBodyAlreadyUsed(replies, 'Second')).toBe(false);
    });

    it('returns false for empty composer message', () => {
        expect(ticketReplyBodyAlreadyUsed([{ message_markdown: 'x' }], '')).toBe(false);
        expect(ticketReplyBodyAlreadyUsed([{ message_markdown: 'x' }], '   ')).toBe(false);
    });
});
