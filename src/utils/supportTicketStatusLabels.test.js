import { describe, it, expect } from 'vitest';
import {
    TICKET_STATUS_LABEL_KEYS,
    USER_TICKET_STATUS_LABEL_KEYS,
    TICKET_STATUS_CLASS_MAP
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
});
