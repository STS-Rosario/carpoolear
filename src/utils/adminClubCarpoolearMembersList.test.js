import { describe, expect, it } from 'vitest';
import {
    ADMIN_CLUB_MEMBERS_SORT_COLUMNS,
    buildClubMembersListParams,
    parseClubMembersListFromRoute,
    getNextClubMembersSortState
} from './adminClubCarpoolearMembersList.js';

describe('adminClubCarpoolearMembersList', () => {
    it('defaults to current members', () => {
        expect(parseClubMembersListFromRoute({})).toEqual({
            status: 'current',
            q: '',
            tier: '',
            sortKey: null,
            sortDir: 'desc',
            page: 1,
            perPage: 100
        });
    });

    it('parses former status and filters from the route', () => {
        expect(
            parseClubMembersListFromRoute({
                status: 'former',
                q: 'Ana',
                tier: 'cafe',
                sort: 'total_donated_cents',
                direction: 'asc',
                page: '2',
                per_page: '10'
            })
        ).toEqual({
            status: 'former',
            q: 'Ana',
            tier: 'cafe',
            sortKey: 'total_donated_cents',
            sortDir: 'asc',
            page: 2,
            perPage: 10
        });
    });

    it('builds API params including membership status', () => {
        expect(
            buildClubMembersListParams({
                status: 'former',
                q: 'Bruno',
                tier: 'beer',
                sortKey: 'joined_at',
                sortDir: 'desc',
                page: 1,
                perPage: 20
            })
        ).toEqual({
            status: 'former',
            q: 'Bruno',
            tier: 'beer',
            sort: 'joined_at',
            direction: 'desc',
            page: 1,
            per_page: 20
        });
    });

    it('toggles sort on repeated column clicks', () => {
        expect(getNextClubMembersSortState('joined_at', 'desc', 'joined_at')).toEqual({
            sortKey: 'joined_at',
            sortDir: 'asc'
        });
    });

    it('includes join, last payment, plan and total columns', () => {
        const keys = ADMIN_CLUB_MEMBERS_SORT_COLUMNS.map((column) => column.key);
        expect(keys).toEqual(
            expect.arrayContaining([
                'user_name',
                'joined_at',
                'last_paid_at',
                'tier_slug',
                'total_donated_cents'
            ])
        );
    });
});
