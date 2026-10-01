import { describe, expect, it } from 'vitest';
import {
    TICKET_SOURCE_FEEDBACK_TAB,
    TICKET_SOURCE_WEB_FORM,
    ticketSourceLabelKey
} from './supportTicketSources';

describe('supportTicketSources', () => {
    it('exposes web form and feedback tab source constants', () => {
        expect(TICKET_SOURCE_WEB_FORM).toBe('web_form');
        expect(TICKET_SOURCE_FEEDBACK_TAB).toBe('feedback_tab');
    });

    it('maps known sources to i18n label keys', () => {
        expect(ticketSourceLabelKey(TICKET_SOURCE_WEB_FORM)).toBe('ticketOrigenFormulario');
        expect(ticketSourceLabelKey(TICKET_SOURCE_FEEDBACK_TAB)).toBe('ticketOrigenPestana');
    });

    it('returns empty label key for unknown or missing source', () => {
        expect(ticketSourceLabelKey('email')).toBe('');
        expect(ticketSourceLabelKey(null)).toBe('');
        expect(ticketSourceLabelKey(undefined)).toBe('');
    });
});
