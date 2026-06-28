import { describe, it, expect } from 'vitest';
import {
    MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS,
    buildManualIdentityValidationStatePayload,
    hasManualIdentityValidationStateChanges
} from './adminManualIdentityValidationStateEdit.js';

describe('adminManualIdentityValidationStateEdit', () => {
    it('exposes review status options for admin select', () => {
        expect(MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS).toEqual([
            { value: 'pending', labelKey: 'estadoPendiente' },
            { value: 'approved', labelKey: 'estadoAprobado' },
            { value: 'rejected', labelKey: 'estadoRechazado' }
        ]);
    });

    it('builds payload only for changed fields', () => {
        const item = { review_status: 'pending', paid: false };

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'approved',
                paid: false
            })
        ).toEqual({ review_status: 'approved' });

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'pending',
                paid: true
            })
        ).toEqual({ paid: true });
    });

    it('detects when admin edited review status or paid flag', () => {
        const item = { review_status: 'pending', paid: true };

        expect(
            hasManualIdentityValidationStateChanges(item, {
                reviewStatus: 'pending',
                paid: true
            })
        ).toBe(false);

        expect(
            hasManualIdentityValidationStateChanges(item, {
                reviewStatus: 'rejected',
                paid: true
            })
        ).toBe(true);
    });
});
