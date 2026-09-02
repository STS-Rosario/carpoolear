import { isManualIdentityValidationRejected, isManualIdentityValidationTerminalStatus } from './manualIdentityValidationStatus.js';

function isManualDocsPendingAdminReview(manualStatus) {
    if (!manualStatus || !manualStatus.has_submission || !manualStatus.paid || !manualStatus.submitted_at) {
        return false;
    }
    return !isManualIdentityValidationTerminalStatus(manualStatus.review_status);
}

export function shouldShowIdentityVerificationSuccessBanner({
    user,
    manualStatus,
    resultMessage
}) {
    if (isManualDocsPendingAdminReview(manualStatus)) {
        return false;
    }
    if (isManualIdentityValidationRejected(manualStatus, user)) {
        return false;
    }
    if (resultMessage === 'success') {
        return true;
    }
    if (user && user.identity_validated && user.identity_validated_at) {
        return true;
    }
    return false;
}
