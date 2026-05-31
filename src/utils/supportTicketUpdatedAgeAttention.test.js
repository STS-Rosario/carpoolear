import { describe, it, expect } from 'vitest';
import dayjs from '../dayjs';
import {
    ticketNeedsAdminAttention,
    getUpdatedAgeAttentionLevel,
    getUpdatedAgeAttentionClass
} from './supportTicketUpdatedAgeAttention.js';

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

    it('returns false for resolved or closed tickets even with unread admin messages', () => {
        expect(ticketNeedsAdminAttention({ status: 'Resuelto', unread_for_admin: 1 })).toBe(false);
        expect(ticketNeedsAdminAttention({ status: 'Cerrado', unread_for_admin: 1 })).toBe(false);
    });
});

describe('getUpdatedAgeAttentionLevel', () => {
    const now = dayjs('2026-05-29T12:00:00');

    it('returns null when updated less than 2 days ago', () => {
        expect(getUpdatedAgeAttentionLevel('2026-05-28T12:00:00', now)).toBeNull();
    });

    it('returns warning when updated at least 2 days but less than 4 days ago', () => {
        expect(getUpdatedAgeAttentionLevel('2026-05-27T12:00:00', now)).toBe('warning');
        expect(getUpdatedAgeAttentionLevel('2026-05-26T12:01:00', now)).toBe('warning');
    });

    it('returns critical when updated 4 days ago or older', () => {
        expect(getUpdatedAgeAttentionLevel('2026-05-25T12:00:00', now)).toBe('critical');
        expect(getUpdatedAgeAttentionLevel('2026-05-20T08:00:00', now)).toBe('critical');
    });

    it('returns null when updated_at is missing', () => {
        expect(getUpdatedAgeAttentionLevel(null, now)).toBeNull();
    });
});

describe('getUpdatedAgeAttentionClass', () => {
    const now = dayjs('2026-05-29T12:00:00');

    it('returns empty string when ticket does not need admin attention', () => {
        expect(getUpdatedAgeAttentionClass({
            status: 'Esperando respuesta',
            unread_for_admin: 0,
            updated_at: '2026-05-20T08:00:00'
        }, now)).toBe('');
    });

    it('returns warning class when attention is needed and updated 2+ days ago', () => {
        expect(getUpdatedAgeAttentionClass({
            status: 'En revision',
            unread_for_admin: 0,
            updated_at: '2026-05-27T12:00:00'
        }, now)).toBe('support-tickets-table__updated--warning');
    });

    it('returns critical class when attention is needed and updated 4+ days ago', () => {
        expect(getUpdatedAgeAttentionClass({
            status: 'En revision',
            unread_for_admin: 0,
            updated_at: '2026-05-25T12:00:00'
        }, now)).toBe('support-tickets-table__updated--critical');
    });

    it('returns empty string when attention is needed but updated recently', () => {
        expect(getUpdatedAgeAttentionClass({
            status: 'En revision',
            unread_for_admin: 0,
            updated_at: '2026-05-28T12:00:00'
        }, now)).toBe('');
    });

    it('returns empty string for resolved or closed tickets even when stale and unread', () => {
        const staleResolved = {
            status: 'Resuelto',
            unread_for_admin: 1,
            updated_at: '2026-05-20T08:00:00'
        };
        const staleClosed = {
            status: 'Cerrado',
            unread_for_admin: 1,
            updated_at: '2026-05-20T08:00:00'
        };
        expect(getUpdatedAgeAttentionClass(staleResolved, now)).toBe('');
        expect(getUpdatedAgeAttentionClass(staleClosed, now)).toBe('');
    });
});
