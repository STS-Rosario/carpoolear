import { describe, expect, it } from 'vitest';
import {
    assignedAdminDisplayName,
    hasActiveTicketAssignment,
    isAssignTicketDisabled,
    isReplyBlockedByOtherAdminAssignment,
    isTicketAssignableByAdmin,
    isTicketAssignedToAdmin,
    shouldShowAssignTicketButton
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

    it('shows assign button for assignable unassigned tickets', () => {
        const ticket = { status: 'Open', unread_for_admin: 0 };
        expect(shouldShowAssignTicketButton(ticket, 3)).toBe(true);
        expect(isAssignTicketDisabled(ticket, 3)).toBe(false);
    });

    it('shows disabled assign button when ticket is assigned to another admin', () => {
        const ticket = { status: 'Open', unread_for_admin: 0, assigned_to_user_id: 9 };
        expect(shouldShowAssignTicketButton(ticket, 3)).toBe(true);
        expect(isAssignTicketDisabled(ticket, 3)).toBe(true);
    });

    it('hides assign button when ticket is assigned to current admin', () => {
        const ticket = { status: 'Open', unread_for_admin: 0, assigned_to_user_id: 3 };
        expect(shouldShowAssignTicketButton(ticket, 3)).toBe(false);
    });
});
