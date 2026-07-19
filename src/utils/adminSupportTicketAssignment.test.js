import { describe, expect, it } from 'vitest';
import {
    assignedAdminDisplayName,
    hasActiveTicketAssignment,
    isReplyBlockedByOtherAdminAssignment,
    isTicketAssignableByAdmin,
    isTicketAssignedToAdmin
} from './adminSupportTicketAssignment';

describe('adminSupportTicketAssignment', () => {
    it('marks actionable tickets as assignable', () => {
        expect(isTicketAssignableByAdmin({ status: 'Open', unread_for_admin: 0 })).toBe(true);
        expect(isTicketAssignableByAdmin({ status: 'En revision', unread_for_admin: 0 })).toBe(true);
        expect(isTicketAssignableByAdmin({ status: 'Necesita revisión', unread_for_admin: 0 })).toBe(true);
        expect(isTicketAssignableByAdmin({ status: 'Esperando respuesta', unread_for_admin: 1 })).toBe(true);
    });

    it('marks waiting and terminal tickets as not assignable', () => {
        expect(isTicketAssignableByAdmin({ status: 'Esperando respuesta', unread_for_admin: 0 })).toBe(false);
        expect(isTicketAssignableByAdmin({ status: 'Resuelto', unread_for_admin: 0 })).toBe(false);
        expect(isTicketAssignableByAdmin({ status: 'Cerrado', unread_for_admin: 0 })).toBe(false);
        expect(isTicketAssignableByAdmin(null)).toBe(false);
    });

    it('detects assignment for current admin', () => {
        const ticket = { assigned_to_user_id: 7 };
        expect(isTicketAssignedToAdmin(ticket, 7)).toBe(true);
        expect(isTicketAssignedToAdmin(ticket, 8)).toBe(false);
    });

    it('returns assigned admin display name', () => {
        expect(assignedAdminDisplayName({ assigned_to: { name: ' Ana ' } })).toBe('Ana');
        expect(assignedAdminDisplayName({ assigned_to_user_id: 1 })).toBe('');
        expect(assignedAdminDisplayName(null)).toBe('');
    });

    it('detects active assignment', () => {
        expect(hasActiveTicketAssignment({ assigned_to_user_id: 3 })).toBe(true);
        expect(hasActiveTicketAssignment({ assigned_to_user_id: null })).toBe(false);
    });

    it('blocks reply when ticket is assigned to another admin', () => {
        const ticket = { assigned_to_user_id: 5 };
        expect(isReplyBlockedByOtherAdminAssignment(ticket, 7)).toBe(true);
        expect(isReplyBlockedByOtherAdminAssignment(ticket, 5)).toBe(false);
        expect(isReplyBlockedByOtherAdminAssignment({ assigned_to_user_id: null }, 5)).toBe(false);
    });
});
