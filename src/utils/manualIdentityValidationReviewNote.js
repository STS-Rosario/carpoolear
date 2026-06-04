export function getDisplayableManualReviewNote(manualStatus) {
    if (!shouldDisplayManualReviewNote(manualStatus)) {
        return '';
    }

    return String(manualStatus.review_note).trim();
}

export function shouldDisplayManualReviewNote(manualStatus) {
    if (!manualStatus || !manualStatus.has_submission) {
        return false;
    }

    const note = manualStatus.review_note;
    return typeof note === 'string' && note.trim().length > 0;
}

export function getManualReviewNoteLabelKey(reviewStatus) {
    if (reviewStatus === 'approved') {
        return 'identityValidationAdminReviewNoteLabelApproved';
    }
    if (reviewStatus === 'rejected') {
        return 'identityValidationRejectionReasonLabel';
    }

    return 'identityValidationAdminReviewNoteLabelPending';
}
