import { describe, expect, it } from 'vitest';
import {
    ADMIN_DONATION_LEDGER_SORT_COLUMNS,
    buildDonationLedgerListParams,
    parseDonationLedgerListFromRoute,
    getNextDonationLedgerSortState
} from './adminDonationLedgerList.js';

describe('adminDonationLedgerList', () => {
    it('parses kind, status, search, sort and pagination from the route', () => {
        expect(
            parseDonationLedgerListFromRoute({
                kind: 'club',
                status: 'approved',
                q: 'Ana',
                sort: 'amount_cents',
                direction: 'desc',
                page: '2',
                per_page: '20'
            })
        ).toEqual({
            kind: 'club',
            status: 'approved',
            q: 'Ana',
            sortKey: 'amount_cents',
            sortDir: 'desc',
            page: 2,
            perPage: 20
        });
    });

    it('builds API params from list state', () => {
        expect(
            buildDonationLedgerListParams({
                kind: 'unica_vez',
                status: 'pending',
                q: 'Bruno',
                sortKey: 'paid_at',
                sortDir: 'desc',
                page: 3,
                perPage: 50
            })
        ).toEqual({
            kind: 'unica_vez',
            status: 'pending',
            q: 'Bruno',
            sort: 'paid_at',
            direction: 'desc',
            page: 3,
            per_page: 50
        });
    });

    it('toggles sort direction on the same column', () => {
        expect(getNextDonationLedgerSortState('paid_at', 'desc', 'paid_at')).toEqual({
            sortKey: 'paid_at',
            sortDir: 'asc'
        });
    });

    it('includes name, date, amount and club columns', () => {
        const keys = ADMIN_DONATION_LEDGER_SORT_COLUMNS.map((column) => column.key);
        expect(keys).toEqual(
            expect.arrayContaining(['user_name', 'paid_at', 'amount_cents', 'kind', 'status'])
        );
    });
});
