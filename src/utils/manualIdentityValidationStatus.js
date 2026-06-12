export function isManualIdentityValidationRejected(manualStatus) {
    if (!manualStatus || !manualStatus.has_submission || !manualStatus.paid || !manualStatus.submitted_at) {
        return false;
    }
    return manualStatus.review_status === 'rejected';
}

export function isManualRejectedWithChoiceCards(manualStatus, { manualEnabled = true } = {}) {
    if (!manualEnabled) {
        return false;
    }
    return isManualIdentityValidationRejected(manualStatus);
}
