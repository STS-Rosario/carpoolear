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
                open: true,
                userId: 42,
                page: 2,
                perPage: 50
            })
        ).toEqual({
            type: 'bug_report',
            priority: 'high',
            needs_reply: '1',
            open: '1',
            user_id: '42',
            page: 2,
            per_page: 50
        });
    });

    it('buildAdminSupportTicketListParams omits empty filter values', () => {
        expect(buildAdminSupportTicketListParams({})).toEqual({});
        expect(
            buildAdminSupportTicketListParams({
                type: '',
                priority: '',
                needsReply: false,
                open: false
            })
        ).toEqual({});
    });

    it('parseAdminSupportTicketListFiltersFromRoute reads route query', () => {
        expect(
            parseAdminSupportTicketListFiltersFromRoute({
                type: 'contact',
                priority: 'low',
                needs_reply: '1',
                open: '1',
                user_id: '99',
                page: '3',
                per_page: '30'
            })
        ).toEqual({
            type: 'contact',
            priority: 'low',
            needsReply: true,
            open: true,
            userId: 99,
            page: 3,
            perPage: 30
        });
    });

    it('filtersAreActive is true when userId filter is set', () => {
        expect(
            filtersAreActive({
                type: '',
                priority: '',
                needsReply: false,
                open: false,
                userId: 5
            })
        ).toBe(true);
    });

    it('filtersAreActive is true when any filter is set', () => {
        expect(filtersAreActive({ type: 'feedback', priority: '', needsReply: false })).toBe(true);
        expect(filtersAreActive({ type: '', priority: '', needsReply: true })).toBe(true);
        expect(filtersAreActive({ type: '', priority: '', needsReply: false, open: true })).toBe(
            true
        );
        expect(filtersAreActive({ type: '', priority: '', needsReply: false, open: false })).toBe(
            false
        );
    });
});
