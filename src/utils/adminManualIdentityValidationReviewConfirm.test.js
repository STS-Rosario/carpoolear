import { describe, it, expect } from 'vitest';
import { shouldConfirmAlreadyPendingReview } from './adminManualIdentityValidationReviewConfirm.js';

describe('adminManualIdentityValidationReviewConfirm', () => {
    it('requires confirmation when marking pending an already pending request', () => {
        expect(shouldConfirmAlreadyPendingReview('pending', 'pending')).toBe(true);
    });

    it('does not require confirmation for pending action on other statuses', () => {
        expect(shouldConfirmAlreadyPendingReview('pending', 'approved')).toBe(false);
        expect(shouldConfirmAlreadyPendingReview('pending', 'rejected')).toBe(false);
    });

    it('does not require confirmation for non-pending actions', () => {
        expect(shouldConfirmAlreadyPendingReview('approve', 'pending')).toBe(false);
        expect(shouldConfirmAlreadyPendingReview('reject', 'pending')).toBe(false);
    });
});
