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
});
