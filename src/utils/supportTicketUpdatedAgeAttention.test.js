import { describe, it, expect } from 'vitest';
import { ticketNeedsAdminAttention } from './supportTicketUpdatedAgeAttention.js';

describe('ticketNeedsAdminAttention', () => {
    it('returns true when the user replied and admin has unread messages', () => {
        expect(ticketNeedsAdminAttention({ status: 'Esperando respuesta', unread_for_admin: 1 })).toBe(true);
    });

    it('returns true for tickets in En revision status', () => {
        expect(ticketNeedsAdminAttention({ status: 'En revision', unread_for_admin: 0 })).toBe(true);
    });

    it('returns true for tickets that need review', () => {
        expect(ticketNeedsAdminAttention({ status: 'Necesita revisión', unread_for_admin: 0 })).toBe(true);
    });

    it('returns false when waiting on the user without unread admin messages', () => {
        expect(ticketNeedsAdminAttention({ status: 'Esperando respuesta', unread_for_admin: 0 })).toBe(false);
    });

    it('returns false for resolved or closed tickets', () => {
        expect(ticketNeedsAdminAttention({ status: 'Resuelto', unread_for_admin: 0 })).toBe(false);
        expect(ticketNeedsAdminAttention({ status: 'Cerrado', unread_for_admin: 0 })).toBe(false);
    });
});
