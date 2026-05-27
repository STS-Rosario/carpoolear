import { describe, it, expect } from 'vitest';
import {
    DEFAULT_USER_TICKET_TYPE,
    USER_TICKET_TYPE_OPTIONS,
    USER_TICKET_TYPE_VALUES
} from './supportTicketTypeOptions';

describe('supportTicketTypeOptions', () => {
    it('defaults to account recovery and lists it first', () => {
        expect(DEFAULT_USER_TICKET_TYPE).toBe('account_recovery');
        expect(USER_TICKET_TYPE_OPTIONS[0]).toEqual({
            value: 'account_recovery',
            labelKey: 'ticketTypeAccountRecovery'
        });
        expect(USER_TICKET_TYPE_VALUES).toContain('account_recovery');
    });
});
