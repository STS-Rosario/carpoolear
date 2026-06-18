import { describe, expect, it } from 'vitest';
import {
    getDisplayableManualReviewNote,
    getManualReviewNoteLabelKey,
    shouldDisplayManualReviewNote
} from './manualIdentityValidationReviewNote.js';

describe('manualIdentityValidationReviewNote', () => {
    it('returns empty display text when note is missing or blank', () => {
        expect(getDisplayableManualReviewNote({ has_submission: true, review_note: null })).toBe('');
        expect(getDisplayableManualReviewNote({ has_submission: true, review_note: '   ' })).toBe('');
    });

    it('returns trimmed note when submission exists', () => {
        expect(
            getDisplayableManualReviewNote({
                has_submission: true,
                review_note: '  Documentación correcta.  '
            })
        ).toBe('Documentación correcta.');
    });

    it('returns empty text for rejected note outside rejection context', () => {
        expect(
            getDisplayableManualReviewNote(
                {
                    has_submission: true,
                    review_status: 'rejected',
                    review_note: 'Prueba'
                },
                { reviewStatus: 'approved' }
            )
        ).toBe('');
    });

    it('returns rejected note only in rejection context', () => {
        expect(
            getDisplayableManualReviewNote(
                {
                    has_submission: true,
                    review_status: 'rejected',
                    review_note: 'Prueba'
                },
                { reviewStatus: 'rejected' }
            )
        ).toBe('Prueba');
    });

    it('returns approved note only in success context', () => {
        expect(
            getDisplayableManualReviewNote(
                {
                    has_submission: true,
                    review_status: 'approved',
                    review_note: 'Todo correcto'
                },
                { reviewStatus: 'approved' }
            )
        ).toBe('Todo correcto');
    });

    it('does not display note without a submission', () => {
        expect(shouldDisplayManualReviewNote({ has_submission: false, review_note: 'Hola' })).toBe(false);
        expect(shouldDisplayManualReviewNote({ has_submission: true, review_note: 'Hola' })).toBe(true);
    });

    it('maps review status to label keys', () => {
        expect(getManualReviewNoteLabelKey('approved')).toBe(
            'identityValidationAdminReviewNoteLabelApproved'
        );
        expect(getManualReviewNoteLabelKey('rejected')).toBe(
            'identityValidationRejectionReasonLabel'
        );
        expect(getManualReviewNoteLabelKey('pending')).toBe(
            'identityValidationAdminReviewNoteLabelPending'
        );
    });
});
