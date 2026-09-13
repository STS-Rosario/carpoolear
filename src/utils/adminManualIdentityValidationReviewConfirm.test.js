import { describe, it, expect } from 'vitest';
import {
    getReviewActionConfirmMessageKey,
    getSavePrivateNoteConfirmMessageKey,
    getSaveStateConfirmMessageKey,
    shouldConfirmAlreadyPendingReview,
    shouldProceedWithConfirmedAction,
    shouldProceedWithReviewAction
} from './adminManualIdentityValidationReviewConfirm.js';

describe('adminManualIdentityValidationReviewConfirm', () => {
    it('requires confirmation when marking pending an already pending request', () => {
        expect(shouldConfirmAlreadyPendingReview('pending', 'pending')).toBe(true);
    });

    it('does not require already-pending confirmation for pending action on other statuses', () => {
        expect(shouldConfirmAlreadyPendingReview('pending', 'approved')).toBe(false);
        expect(shouldConfirmAlreadyPendingReview('pending', 'rejected')).toBe(false);
    });

    it('returns mark-pending confirmation message key when status is not pending', () => {
        expect(getReviewActionConfirmMessageKey('pending', 'approved')).toBe('confirmarMarcarPendienteManualIdentity');
    });

    it('requires confirmation before marking a request as pending', () => {
        let confirmCalled = false;
        const confirmAction = () => {
            confirmCalled = true;
            return true;
        };

        expect(shouldProceedWithReviewAction('pending', 'approved', confirmAction)).toBe(true);
        expect(confirmCalled).toBe(true);
    });

    it('does not require confirmation for non-pending actions', () => {
        expect(shouldConfirmAlreadyPendingReview('approve', 'pending')).toBe(false);
        expect(shouldConfirmAlreadyPendingReview('reject', 'pending')).toBe(false);
    });

    it('returns approve confirmation message key', () => {
        expect(getReviewActionConfirmMessageKey('approve', 'pending')).toBe('confirmarAprobarManualIdentity');
    });

    it('requires confirmation before approving a request', () => {
        let confirmCalled = false;
        const confirmAction = () => {
            confirmCalled = true;
            return true;
        };

        expect(shouldProceedWithReviewAction('approve', 'pending', confirmAction)).toBe(true);
        expect(confirmCalled).toBe(true);
    });

    it('does not proceed when approve confirmation is cancelled', () => {
        const confirmAction = () => false;

        expect(shouldProceedWithReviewAction('approve', 'pending', confirmAction)).toBe(false);
    });

    it('returns reject confirmation message key', () => {
        expect(getReviewActionConfirmMessageKey('reject', 'pending')).toBe('confirmarRechazarManualIdentity');
    });

    it('requires confirmation before rejecting a request', () => {
        let confirmCalled = false;
        const confirmAction = () => {
            confirmCalled = true;
            return true;
        };

        expect(shouldProceedWithReviewAction('reject', 'pending', confirmAction)).toBe(true);
        expect(confirmCalled).toBe(true);
    });

    it('returns save private note confirmation message key', () => {
        expect(getSavePrivateNoteConfirmMessageKey()).toBe('confirmarGuardarNotaPrivadaManualIdentity');
    });

    it('requires confirmation before saving private admin note', () => {
        let confirmCalled = false;
        const confirmAction = () => {
            confirmCalled = true;
            return true;
        };

        expect(shouldProceedWithConfirmedAction(confirmAction)).toBe(true);
        expect(confirmCalled).toBe(true);
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
