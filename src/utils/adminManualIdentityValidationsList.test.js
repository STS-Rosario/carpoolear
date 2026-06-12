import { describe, expect, it, vi } from 'vitest';
import {
    ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY,
    filterManualIdentityValidationsList,
    getShowResolvedManualIdentityValidations,
    isManualIdentityValidationResolved,
    saveShowResolvedManualIdentityValidations
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
