import { describe, it, expect } from 'vitest';
import {
    shouldConfirmAlreadyPendingReview,
    shouldProceedWithReviewAction
} from './adminManualIdentityValidationReviewConfirm.js';

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

    it('proceeds without confirm when review action does not need it', () => {
        const confirmAction = () => {
            throw new Error('confirm should not run');
        };

        expect(shouldProceedWithReviewAction('approve', 'pending', confirmAction)).toBe(true);
    });

    it('uses confirm when marking pending an already pending request', () => {
        let confirmCalled = false;
        const confirmAction = () => {
            confirmCalled = true;
            return false;
        };

        expect(shouldProceedWithReviewAction('pending', 'pending', confirmAction)).toBe(false);
        expect(confirmCalled).toBe(true);
    });
});
