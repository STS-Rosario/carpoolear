import { describe, expect, it } from 'vitest';
import {
    ADMIN_SUPPORT_TICKET_SORT_COLUMNS,
    buildAdminSupportTicketListParams,
    filtersAreActive,
    getNextAdminSupportTicketSortState,
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
                createdByAdmin: true,
                userId: 42,
                page: 2,
                perPage: 50
            })
        ).toEqual({
            type: 'bug_report',
            priority: 'high',
            needs_reply: '1',
            open: '1',
            created_by_admin: '1',
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
                open: false,
                createdByAdmin: false
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
                created_by_admin: '1',
                user_id: '99',
                page: '3',
                per_page: '30'
            })
        ).toEqual({
            type: 'contact',
            priority: 'low',
            needsReply: true,
            open: true,
            createdByAdmin: true,
            userId: 99,
            page: 3,
            perPage: 30,
            sortKey: null,
            sortDir: 'desc'
        });
    });

    it('ADMIN_SUPPORT_TICKET_SORT_COLUMNS lists sortable columns without Club', () => {
        expect(ADMIN_SUPPORT_TICKET_SORT_COLUMNS.map((column) => column.key)).toEqual([
            'subject',
            'priority',
            'created_at',
            'updated_at',
            'status',
            'assigned_to',
            'type'
        ]);
        expect(ADMIN_SUPPORT_TICKET_SORT_COLUMNS.map((column) => column.labelKey)).toEqual([
            'asuntoTicket',
            'prioridad',
            'creado',
            'actualizado',
            'estado',
            'asignadoA',
            'categoriaTicket'
        ]);
    });

    describe('getNextAdminSupportTicketSortState', () => {
        it('toggles direction when clicking the active column', () => {
            expect(getNextAdminSupportTicketSortState('priority', 'desc', 'priority')).toEqual({
                sortKey: 'priority',
                sortDir: 'asc'
            });
        });

        it('defaults to desc for created_at, updated_at, and priority on first click', () => {
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'created_at')).toEqual({
                sortKey: 'created_at',
                sortDir: 'desc'
            });
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'updated_at')).toEqual({
                sortKey: 'updated_at',
                sortDir: 'desc'
            });
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'priority')).toEqual({
                sortKey: 'priority',
                sortDir: 'desc'
            });
        });

        it('defaults to asc for subject, status, assigned_to, and type on first click', () => {
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'subject')).toEqual({
                sortKey: 'subject',
                sortDir: 'asc'
            });
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'status')).toEqual({
                sortKey: 'status',
                sortDir: 'asc'
            });
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'assigned_to')).toEqual({
                sortKey: 'assigned_to',
                sortDir: 'asc'
            });
            expect(getNextAdminSupportTicketSortState(null, 'asc', 'type')).toEqual({
                sortKey: 'type',
                sortDir: 'asc'
            });
        });
    });

    it('buildAdminSupportTicketListParams adds sort and direction when sortKey is set', () => {
        expect(
            buildAdminSupportTicketListParams({
                sortKey: 'priority',
                sortDir: 'desc'
            })
        ).toEqual({
            sort: 'priority',
            direction: 'desc'
        });
    });

    it('parseAdminSupportTicketListFiltersFromRoute reads sort and direction from query', () => {
        expect(
            parseAdminSupportTicketListFiltersFromRoute({
                sort: 'subject',
                direction: 'asc'
            })
        ).toMatchObject({
            sortKey: 'subject',
            sortDir: 'asc'
        });
    });

    it('parseAdminSupportTicketListFiltersFromRoute clears unknown sort keys', () => {
        expect(
            parseAdminSupportTicketListFiltersFromRoute({
                sort: 'club_carpoolear_active',
                direction: 'asc'
            })
        ).toMatchObject({
            sortKey: null,
            sortDir: 'desc'
        });
    });

    it('parseAdminSupportTicketListFiltersFromRoute defaults direction to desc when missing or invalid', () => {
        expect(parseAdminSupportTicketListFiltersFromRoute({ sort: 'created_at' })).toMatchObject({
            sortKey: 'created_at',
            sortDir: 'desc'
        });
        expect(
            parseAdminSupportTicketListFiltersFromRoute({ sort: 'created_at', direction: 'sideways' })
        ).toMatchObject({
            sortKey: 'created_at',
            sortDir: 'desc'
        });
    });

    it('filtersAreActive is true when userId filter is set', () => {
        expect(
            filtersAreActive({
                type: '',
                priority: '',
                needsReply: false,
                open: false,
                createdByAdmin: false,
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
        expect(
            filtersAreActive({
                type: '',
                priority: '',
                needsReply: false,
                open: false,
                createdByAdmin: true
            })
        ).toBe(true);
        expect(
            filtersAreActive({
                type: '',
                priority: '',
                needsReply: false,
                open: false,
                createdByAdmin: false
            })
        ).toBe(false);
    });
});
