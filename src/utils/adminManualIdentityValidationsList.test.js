import { describe, expect, it } from 'vitest';
import {
    filterManualIdentityValidationsList,
    isManualIdentityValidationResolved
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
});
