import { describe, it, expect } from 'vitest';
import { TICKET_TYPE_LABEL_KEYS } from './supportTicketLabels';

describe('supportTicketLabels', () => {
    it('maps account_recovery to its i18n label key', () => {
        expect(TICKET_TYPE_LABEL_KEYS.account_recovery).toBe('ticketTypeAccountRecovery');
    });
});
