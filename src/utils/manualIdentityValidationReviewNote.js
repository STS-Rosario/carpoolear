export function getDisplayableManualReviewNote(manualStatus, options = {}) {
    if (!shouldDisplayManualReviewNote(manualStatus)) {
        return '';
    }

    const requiredReviewStatus = options.reviewStatus;
    if (requiredReviewStatus && manualStatus.review_status !== requiredReviewStatus) {
        return '';
    }

    return String(manualStatus.review_note).trim();
}

export function getDisplayableManualApprovalReviewNote(manualStatus) {
    return getDisplayableManualReviewNote(manualStatus, { reviewStatus: 'approved' });
}

export function getDisplayableManualRejectionReviewNote(manualStatus) {
    return getDisplayableManualReviewNote(manualStatus, { reviewStatus: 'rejected' });
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
