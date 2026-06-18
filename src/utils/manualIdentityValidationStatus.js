import { isUserIdentityVerified } from './userIdentityVerification.js';

export function isManualIdentityValidationRejected(manualStatus, user = null) {
    if (isUserIdentityVerified(user)) {
        return false;
    }
    if (!manualStatus || !manualStatus.has_submission || !manualStatus.paid || !manualStatus.submitted_at) {
        return false;
    }
    return manualStatus.review_status === 'rejected';
}

export function isManualRejectedWithChoiceCards(
    manualStatus,
    { manualEnabled = true, user = null } = {}
) {
    if (!manualEnabled) {
        return false;
    }
    return isManualIdentityValidationRejected(manualStatus, user);
}
