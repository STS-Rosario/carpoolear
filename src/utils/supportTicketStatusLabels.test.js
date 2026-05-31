import { describe, it, expect } from 'vitest';
import {
    TICKET_STATUS_LABEL_KEYS,
    USER_TICKET_STATUS_LABEL_KEYS,
    TICKET_STATUS_CLASS_MAP,
    SOLVED_TICKET_STATUSES,
    SOLVED_TICKET_NEUTRAL_CLASS
} from './supportTicketStatusLabels';

describe('supportTicketStatusLabels', () => {
    it('maps needs review status for admin and user views', () => {
        expect(TICKET_STATUS_LABEL_KEYS['Necesita revisión']).toBe('estadoNecesitaRevision');
        expect(USER_TICKET_STATUS_LABEL_KEYS['Necesita revisión']).toBe('estadoNecesitaRevision');
        expect(TICKET_STATUS_CLASS_MAP['Necesita revisión']).toBe('label label-danger');
    });

    it('maps resolved status to estadoResuelto not identity approval copy', () => {
        expect(TICKET_STATUS_LABEL_KEYS.Resuelto).toBe('estadoResuelto');
        expect(USER_TICKET_STATUS_LABEL_KEYS.Resuelto).toBe('estadoResuelto');
    });

    it('uses neutral status styling for resolved and closed tickets in admin', () => {
        expect(SOLVED_TICKET_STATUSES.has('Resuelto')).toBe(true);
        expect(SOLVED_TICKET_STATUSES.has('Cerrado')).toBe(true);
        expect(TICKET_STATUS_CLASS_MAP.Resuelto).toBe(SOLVED_TICKET_NEUTRAL_CLASS);
        expect(TICKET_STATUS_CLASS_MAP.Cerrado).toBe(SOLVED_TICKET_NEUTRAL_CLASS);
    });
});
