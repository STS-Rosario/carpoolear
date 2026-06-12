import { describe, it, expect } from 'vitest';
import { shouldShowIdentityVerificationSuccessBanner } from './identityValidationSuccessBanner';

describe('shouldShowIdentityVerificationSuccessBanner', () => {
    const verifiedUser = {
        identity_validated: true,
        identity_validated_at: '2026-06-01 10:00:00'
    };

    it('returns false when manual verification was rejected even if user still looks verified', () => {
        expect(
            shouldShowIdentityVerificationSuccessBanner({
                user: verifiedUser,
                manualStatus: {
                    has_submission: true,
                    paid: true,
                    submitted_at: '2026-06-02 12:00:00',
                    review_status: 'rejected',
                    review_note: 'Prueba'
                },
                resultMessage: null
            })
        ).toBe(false);
    });

    it('returns false while manual docs are pending admin review', () => {
        expect(
            shouldShowIdentityVerificationSuccessBanner({
                user: verifiedUser,
                manualStatus: {
                    has_submission: true,
                    paid: true,
                    submitted_at: '2026-06-02 12:00:00',
                    review_status: 'pending'
                },
                resultMessage: null
            })
        ).toBe(false);
    });

    it('returns true for a verified user without blocking manual state', () => {
        expect(
            shouldShowIdentityVerificationSuccessBanner({
                user: verifiedUser,
                manualStatus: {
                    has_submission: false,
                    paid: null,
                    submitted_at: null,
                    review_status: null
                },
                resultMessage: null
            })
        ).toBe(true);
    });

    it('returns true when oauth callback reports success', () => {
        expect(
            shouldShowIdentityVerificationSuccessBanner({
                user: { identity_validated: false, identity_validated_at: null },
                manualStatus: null,
                resultMessage: 'success'
            })
        ).toBe(true);
    });
});
