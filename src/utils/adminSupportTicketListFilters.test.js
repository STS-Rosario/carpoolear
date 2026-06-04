import { describe, expect, it } from 'vitest';
import {
    buildAdminSupportTicketListParams,
    filtersAreActive,
    parseAdminSupportTicketListFiltersFromRoute
} from './adminSupportTicketListFilters';

describe('adminSupportTicketListFilters', () => {
    it('buildAdminSupportTicketListParams maps active filters to API query keys', () => {
        expect(
            buildAdminSupportTicketListParams({
                type: 'bug_report',
                priority: 'high',
                needsReply: true,
                userId: 42
            })
        ).toEqual({
            type: 'bug_report',
            priority: 'high',
            needs_reply: '1',
            user_id: '42'
        });
    });

    it('buildAdminSupportTicketListParams omits empty filter values', () => {
        expect(buildAdminSupportTicketListParams({})).toEqual({});
        expect(buildAdminSupportTicketListParams({ type: '', priority: '', needsReply: false })).toEqual({});
    });

    it('parseAdminSupportTicketListFiltersFromRoute reads route query', () => {
        expect(
            parseAdminSupportTicketListFiltersFromRoute({
                type: 'contact',
                priority: 'low',
                needs_reply: '1',
                user_id: '99'
            })
        ).toEqual({
            type: 'contact',
            priority: 'low',
            needsReply: true,
            userId: 99
        });
    });

    it('filtersAreActive is true when userId filter is set', () => {
        expect(filtersAreActive({ type: '', priority: '', needsReply: false, userId: 5 })).toBe(true);
    });

    it('filtersAreActive is true when any filter is set', () => {
        expect(filtersAreActive({ type: 'feedback', priority: '', needsReply: false })).toBe(true);
        expect(filtersAreActive({ type: '', priority: '', needsReply: true })).toBe(true);
        expect(filtersAreActive({ type: '', priority: '', needsReply: false })).toBe(false);
    });
});
