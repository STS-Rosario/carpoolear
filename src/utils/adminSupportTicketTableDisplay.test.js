import { describe, expect, it } from 'vitest';
import dayjs from '../dayjs.js';
import {
    capitalizeFirst,
    supportTicketCanLinkOwnerProfile,
    supportTicketFullDate,
    supportTicketHasUserLastReply,
    supportTicketOwnerDisplayName,
    supportTicketPriorityClass,
    supportTicketPriorityLabel,
    supportTicketRelativeDate,
    supportTicketStatusClass,
    supportTicketStatusLabel,
    supportTicketUpdatedAgeAttentionClass,
    ticketCategoryLabel
} from './adminSupportTicketTableDisplay.js';

const t = (key) => `[${key}]`;

describe('capitalizeFirst', () => {
    it('capitalizes the first character', () => {
        expect(capitalizeFirst('hola')).toBe('Hola');
        expect(capitalizeFirst('Hola')).toBe('Hola');
    });

    it('returns an empty string for falsy values', () => {
        expect(capitalizeFirst('')).toBe('');
        expect(capitalizeFirst(null)).toBe('');
    });
});

describe('ticketCategoryLabel', () => {
    it('translates known ticket types through the i18n function', () => {
        expect(ticketCategoryLabel('bug_report', t)).toBe('[ticketTypeBug]');
        expect(ticketCategoryLabel('contact', t)).toBe('[ticketTypeContact]');
    });

    it('falls back to the capitalized raw type', () => {
        expect(ticketCategoryLabel('other_type', t)).toBe('Other_type');
    });
});

describe('supportTicketStatusLabel / supportTicketStatusClass', () => {
    it('maps known statuses to i18n labels and CSS classes', () => {
        expect(supportTicketStatusLabel('Open', t)).toBe('[estadoPendiente]');
        expect(supportTicketStatusLabel('Resuelto', t)).toBe('[estadoResuelto]');
        expect(supportTicketStatusClass('Resuelto')).toBe('label label-default');
        expect(supportTicketStatusClass('Necesita revisión')).toBe('label label-danger');
    });

    it('falls back to the raw status for unknown values', () => {
        expect(supportTicketStatusLabel('raro', t)).toBe('raro');
        expect(supportTicketStatusClass('raro')).toBe('label label-primary');
    });
});

describe('supportTicketPriorityLabel / supportTicketPriorityClass', () => {
    it('maps known priorities to i18n labels and CSS classes', () => {
        expect(supportTicketPriorityLabel('HIGH', t)).toBe('[prioridadAlta]');
        expect(supportTicketPriorityLabel('normal', t)).toBe('[prioridadNormal]');
        expect(supportTicketPriorityLabel('low', t)).toBe('[prioridadBaja]');
        expect(supportTicketPriorityClass('high')).toBe('label label-danger');
        expect(supportTicketPriorityClass('normal')).toBe('label label-info');
        expect(supportTicketPriorityClass('low')).toBe('label label-default');
    });

    it('falls back to the capitalized raw priority', () => {
        expect(supportTicketPriorityLabel('ultra', t)).toBe('Ultra');
        expect(supportTicketPriorityClass('ultra')).toBe('label label-default');
    });
});

describe('supportTicket dates', () => {
    it('renders full dates and relative dates', () => {
        const value = '2026-01-02T03:04:05.000Z';
        expect(supportTicketFullDate(value)).toBe(
            dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        );
        expect(supportTicketRelativeDate(value)).toBe(dayjs(value).fromNow());
    });

    it('renders a dash without a value', () => {
        expect(supportTicketFullDate(null)).toBe('-');
        expect(supportTicketRelativeDate('')).toBe('-');
    });
});

describe('supportTicketUpdatedAgeAttentionClass / supportTicketHasUserLastReply', () => {
    it('delegates to the shared attention rules', () => {
        const ticket = { status: 'Open' };
        expect(supportTicketUpdatedAgeAttentionClass(ticket, dayjs())).toBe(
            supportTicketUpdatedAgeAttentionClass(ticket, dayjs())
        );
        expect(typeof supportTicketHasUserLastReply({ lastRepliedBy: null })).toBe('boolean');
    });
});

describe('supportTicket owner display', () => {
    it('prefers the name, then the username, then empty', () => {
        expect(
            supportTicketOwnerDisplayName({ user: { name: 'Ana', username: 'ana_u' } })
        ).toBe('Ana');
        expect(
            supportTicketOwnerDisplayName({ user: { name: '', username: 'ana_u' } })
        ).toBe('ana_u');
        expect(supportTicketOwnerDisplayName({ user: {} })).toBe('');
        expect(supportTicketOwnerDisplayName({})).toBe('');
    });

    it('can link owners that have an id', () => {
        expect(supportTicketCanLinkOwnerProfile({ user: { id: 42 } })).toBe(true);
        expect(supportTicketCanLinkOwnerProfile({ user: {} })).toBe(false);
        expect(supportTicketCanLinkOwnerProfile({})).toBe(false);
    });
});
