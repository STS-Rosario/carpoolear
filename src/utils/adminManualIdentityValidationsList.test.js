import { describe, expect, it, vi } from 'vitest';
import {
    ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY,
    filterManualIdentityValidationsList,
    getShowResolvedManualIdentityValidations,
    isManualIdentityValidationResolved,
    saveShowResolvedManualIdentityValidations,
    sortManualIdentityValidationsList,
    getNextManualIdentityValidationSortState
} from './adminManualIdentityValidationsList.js';

describe('adminManualIdentityValidationsList', () => {
    const pending = { id: 1, review_status: 'pending' };
    const approved = { id: 2, review_status: 'approved' };
    const rejected = { id: 3, review_status: 'rejected' };
    const list = [pending, approved, rejected];

    describe('isManualIdentityValidationResolved', () => {
        it('treats approved and rejected as resolved', () => {
            expect(isManualIdentityValidationResolved(approved)).toBe(true);
            expect(isManualIdentityValidationResolved(rejected)).toBe(true);
            expect(isManualIdentityValidationResolved({ review_status: 'approve' })).toBe(true);
            expect(isManualIdentityValidationResolved({ review_status: 'reject' })).toBe(true);
        });

        it('treats pending and other statuses as unresolved', () => {
            expect(isManualIdentityValidationResolved(pending)).toBe(false);
            expect(isManualIdentityValidationResolved({ review_status: null })).toBe(false);
        });
    });

    describe('filterManualIdentityValidationsList', () => {
        it('hides resolved cases by default', () => {
            expect(filterManualIdentityValidationsList(list)).toEqual([pending]);
        });

        it('shows all cases when showResolved is true', () => {
            expect(filterManualIdentityValidationsList(list, true)).toEqual(list);
        });
    });

    describe('sortManualIdentityValidationsList', () => {
        const unsorted = [
            { id: 3, user_name: 'Charlie' },
            { id: 1, user_name: 'Alice' },
            { id: 2, user_name: 'Bob' }
        ];

        it('sorts by id ascending', () => {
            expect(sortManualIdentityValidationsList(unsorted, 'id', 'asc').map((item) => item.id))
                .toEqual([1, 2, 3]);
        });

        it('sorts by id descending', () => {
            expect(sortManualIdentityValidationsList(unsorted, 'id', 'desc').map((item) => item.id))
                .toEqual([3, 2, 1]);
        });

        it('returns the original order when sortKey is empty', () => {
            expect(sortManualIdentityValidationsList(unsorted, null)).toEqual(unsorted);
            expect(sortManualIdentityValidationsList(unsorted, '')).toEqual(unsorted);
        });

        it('does not mutate the input list', () => {
            const input = [...unsorted];

            sortManualIdentityValidationsList(input, 'id', 'asc');

            expect(input).toEqual(unsorted);
        });

        it('sorts by user name case-insensitively', () => {
            const list = [
                { id: 1, user_name: 'charlie' },
                { id: 2, user_name: 'Alice' },
                { id: 3, user_name: null }
            ];

            expect(sortManualIdentityValidationsList(list, 'user_name', 'asc').map((item) => item.id))
                .toEqual([2, 1, 3]);
        });

        it('sorts by paid_at with null values last', () => {
            const list = [
                { id: 1, paid_at: '2026-06-03 10:00:00' },
                { id: 2, paid_at: null },
                { id: 3, paid_at: '2026-06-01 10:00:00' }
            ];

            expect(sortManualIdentityValidationsList(list, 'paid_at', 'asc').map((item) => item.id))
                .toEqual([3, 1, 2]);
        });

        it('sorts by submitted_at with null values last', () => {
            const list = [
                { id: 1, submitted_at: '2026-06-03 10:00:00' },
                { id: 2, submitted_at: null },
                { id: 3, submitted_at: '2026-06-01 10:00:00' }
            ];

            expect(sortManualIdentityValidationsList(list, 'submitted_at', 'asc').map((item) => item.id))
                .toEqual([3, 1, 2]);
        });

        it('sorts by waiting time in milliseconds', () => {
            const now = new Date('2026-06-18 12:00:00').getTime();
            const list = [
                {
                    id: 1,
                    submitted_at: '2026-06-18 10:00:00',
                    manual_validation_started_at: '2026-06-18 11:00:00'
                },
                {
                    id: 2,
                    submitted_at: null
                },
                {
                    id: 3,
                    submitted_at: '2026-06-18 09:00:00',
                    manual_validation_started_at: null
                }
            ];

            expect(
                sortManualIdentityValidationsList(list, 'waiting_time', 'asc', now).map((item) => item.id)
            ).toEqual([1, 3, 2]);
        });

        it('sorts by paid flag with unpaid rows first when ascending', () => {
            const list = [
                { id: 1, paid: true },
                { id: 2, paid: false },
                { id: 3, paid: true }
            ];

            expect(sortManualIdentityValidationsList(list, 'paid', 'asc').map((item) => item.id))
                .toEqual([2, 1, 3]);
        });

        it('sorts by review status with unpaid first, then pending, approved and rejected', () => {
            const list = [
                { id: 1, paid: true, review_status: 'approved' },
                { id: 2, paid: true, review_status: 'pending' },
                { id: 3, paid: true, review_status: 'rejected' },
                { id: 4, paid: false, review_status: null }
            ];

            expect(sortManualIdentityValidationsList(list, 'review_status', 'asc').map((item) => item.id))
                .toEqual([4, 2, 1, 3]);
        });
    });

    describe('getNextManualIdentityValidationSortState', () => {
        it('toggles direction when clicking the active column', () => {
            expect(getNextManualIdentityValidationSortState('id', 'desc', 'id')).toEqual({
                sortKey: 'id',
                sortDir: 'asc'
            });
        });

        it('defaults to descending when selecting id for the first time', () => {
            expect(getNextManualIdentityValidationSortState(null, 'asc', 'id')).toEqual({
                sortKey: 'id',
                sortDir: 'desc'
            });
        });

        it('defaults to ascending when selecting other columns for the first time', () => {
            expect(getNextManualIdentityValidationSortState(null, 'asc', 'user_name')).toEqual({
                sortKey: 'user_name',
                sortDir: 'asc'
            });
        });
    });

    describe('showResolved persistence', () => {
        it('defaults to false when nothing is stored', () => {
            const storage = { getItem: vi.fn(() => null) };

            expect(getShowResolvedManualIdentityValidations(storage)).toBe(false);
        });

        it('reads stored true value', () => {
            const storage = { getItem: vi.fn(() => 'true') };

            expect(getShowResolvedManualIdentityValidations(storage)).toBe(true);
        });

        it('persists checkbox value', () => {
            const storage = {
                getItem: vi.fn(),
                setItem: vi.fn()
            };

            saveShowResolvedManualIdentityValidations(true, storage);

            expect(storage.setItem).toHaveBeenCalledWith(
                ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY,
                'true'
            );
        });
    });
});
