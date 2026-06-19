import { describe, it, expect } from 'vitest';
import {
    isManualIdentityValidationRejected,
    isManualRejectedWithChoiceCards,
    canManualResubmitWithoutPayment,
    getManualValidationResubmitRoute,
    shouldShowManualValidationAlreadySubmitted,
    getManualValidationRestartRoute
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

describe('canManualResubmitWithoutPayment', () => {
    it('returns true when API reports resubmit is allowed', () => {
        expect(
            canManualResubmitWithoutPayment({
                can_resubmit_without_payment: true
            })
        ).toBe(true);
    });

    it('returns false when resubmit is not allowed', () => {
        expect(
            canManualResubmitWithoutPayment({
                can_resubmit_without_payment: false
            })
        ).toBe(false);
    });
});

describe('getManualValidationResubmitRoute', () => {
    it('returns manual upload route with request_id when resubmit is allowed', () => {
        expect(
            getManualValidationResubmitRoute({
                can_resubmit_without_payment: true,
                request_id: 42
            })
        ).toEqual({
            name: 'identity_validation_manual',
            query: { request_id: 42, resubmit: '1' }
        });
    });

    it('returns null when resubmit is not allowed', () => {
        expect(
            getManualValidationResubmitRoute({
                can_resubmit_without_payment: false,
                request_id: 42
            })
        ).toBeNull();
    });
});

describe('shouldShowManualValidationAlreadySubmitted', () => {
    it('returns true when docs are pending admin review', () => {
        expect(
            shouldShowManualValidationAlreadySubmitted({
                submitted_at: '2026-06-19 09:42:00',
                review_status: 'pending',
                can_resubmit_without_payment: false
            })
        ).toBe(true);
    });

    it('returns false when rejected and free resubmit is still available', () => {
        expect(
            shouldShowManualValidationAlreadySubmitted({
                submitted_at: '2026-06-19 09:42:00',
                review_status: 'rejected',
                can_resubmit_without_payment: true
            })
        ).toBe(false);
    });

    it('returns false when rejected and submission attempts are exhausted', () => {
        expect(
            shouldShowManualValidationAlreadySubmitted({
                submitted_at: '2026-06-19 09:42:00',
                review_status: 'rejected',
                can_resubmit_without_payment: false,
                submission_count: 3,
                max_submissions: 3
            })
        ).toBe(false);
    });
});

describe('getManualValidationRestartRoute', () => {
    it('returns manual route with restart query when payment is required after rejection', () => {
        expect(
            getManualValidationRestartRoute({
                submitted_at: '2026-06-19 09:42:00',
                review_status: 'rejected',
                can_resubmit_without_payment: false
            })
        ).toEqual({
            name: 'identity_validation_manual',
            query: { restart: '1' }
        });
    });

    it('returns null when free resubmit is still available', () => {
        expect(
            getManualValidationRestartRoute({
                submitted_at: '2026-06-19 09:42:00',
                review_status: 'rejected',
                can_resubmit_without_payment: true
            })
        ).toBeNull();
    });
});
