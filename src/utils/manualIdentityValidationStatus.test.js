import { describe, it, expect } from 'vitest';
import {
    isManualIdentityValidationRejected,
    isManualRejectedWithChoiceCards
} from './manualIdentityValidationStatus';

describe('isManualIdentityValidationRejected', () => {
    it('returns true when paid submission was rejected', () => {
        expect(
            isManualIdentityValidationRejected({
                has_submission: true,
                paid: true,
                submitted_at: '2026-06-02 12:00:00',
                review_status: 'rejected'
            })
        ).toBe(true);
    });

    it('returns false when user is already verified even if manual submission was rejected', () => {
        expect(
            isManualIdentityValidationRejected(
                {
                    has_submission: true,
                    paid: true,
                    submitted_at: '2026-06-02 12:00:00',
                    review_status: 'rejected'
                },
                {
                    identity_validated: true,
                    identity_validated_at: '2026-06-03 10:00:00'
                }
            )
        ).toBe(false);
    });

    it('returns false when review is still pending', () => {
        expect(
            isManualIdentityValidationRejected({
                has_submission: true,
                paid: true,
                submitted_at: '2026-06-02 12:00:00',
                review_status: 'pending'
            })
        ).toBe(false);
    });
});

describe('isManualRejectedWithChoiceCards', () => {
    it('returns false when manual verification is disabled', () => {
        expect(
            isManualRejectedWithChoiceCards(
                {
                    has_submission: true,
                    paid: true,
                    submitted_at: '2026-06-02 12:00:00',
                    review_status: 'rejected'
                },
                { manualEnabled: false }
            )
        ).toBe(false);
    });

    it('returns false when user is already verified even if manual submission was rejected', () => {
        expect(
            isManualRejectedWithChoiceCards(
                {
                    has_submission: true,
                    paid: true,
                    submitted_at: '2026-06-02 12:00:00',
                    review_status: 'rejected'
                },
                {
                    manualEnabled: true,
                    user: {
                        identity_validated: true,
                        identity_validated_at: '2026-06-03 10:00:00'
                    }
                }
            )
        ).toBe(false);
    });
});
