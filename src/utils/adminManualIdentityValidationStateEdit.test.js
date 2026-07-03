import { describe, it, expect } from 'vitest';
import {
    MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS,
    buildManualIdentityValidationStatePayload,
    hasManualIdentityValidationStateChanges,
    hasPhotosSubmitted
} from './adminManualIdentityValidationStateEdit.js';

describe('adminManualIdentityValidationStateEdit', () => {
    it('exposes review status options for admin select', () => {
        expect(MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS).toEqual([
            { value: 'awaiting_photos', labelKey: 'estadoEsperandoFotos' },
            { value: 'pending', labelKey: 'estadoPendiente' },
            { value: 'approved', labelKey: 'estadoAprobado' },
            { value: 'rejected', labelKey: 'estadoRechazado' }
        ]);
    });

    it('builds payload only for changed fields', () => {
        const item = { review_status: 'pending', paid: false, submitted_at: null };

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'approved',
                paid: false,
                photosSubmitted: false
            })
        ).toEqual({ review_status: 'approved' });

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'pending',
                paid: true,
                photosSubmitted: false
            })
        ).toEqual({ paid: true });
    });

    it('detects when admin edited review status or paid flag', () => {
        const item = { review_status: 'pending', paid: true, submitted_at: '2026-01-01T10:00:00' };

        expect(
            hasManualIdentityValidationStateChanges(item, {
                reviewStatus: 'pending',
                paid: true,
                photosSubmitted: true
            })
        ).toBe(false);

        expect(
            hasManualIdentityValidationStateChanges(item, {
                reviewStatus: 'rejected',
                paid: true,
                photosSubmitted: true
            })
        ).toBe(true);
    });

    it('builds payload for photos submitted changes', () => {
        const item = { review_status: 'pending', paid: true, submitted_at: '2026-01-01T10:00:00' };

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'pending',
                paid: true,
                photosSubmitted: false
            })
        ).toEqual({ photos_submitted: false });

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'pending',
                paid: true,
                photosSubmitted: true
            })
        ).toEqual({});
    });

    it('treats missing submitted_at as photos not submitted', () => {
        const item = { review_status: 'pending', paid: true, submitted_at: null };

        expect(hasPhotosSubmitted(item)).toBe(false);

        expect(
            buildManualIdentityValidationStatePayload(item, {
                reviewStatus: 'pending',
                paid: true,
                photosSubmitted: true
            })
        ).toEqual({ photos_submitted: true });
    });
});
