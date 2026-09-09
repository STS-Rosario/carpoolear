import { isManualIdentityValidationRejected, isManualIdentityValidationTerminalStatus } from './manualIdentityValidationStatus.js';
import {
    MISMATCH_RESULT_BOTH,
    MISMATCH_RESULT_DNI,
    MISMATCH_RESULT_NAME
} from './identityValidationMismatchDetails.js';

function isManualDocsPendingAdminReview(manualStatus) {
    if (!manualStatus || !manualStatus.has_submission || !manualStatus.paid || !manualStatus.submitted_at) {
        return false;
    }
    return !isManualIdentityValidationTerminalStatus(manualStatus.review_status);
}

function isMercadoPagoMismatchResult(resultMessage) {
    return (
        resultMessage === MISMATCH_RESULT_BOTH ||
        resultMessage === MISMATCH_RESULT_NAME ||
        resultMessage === MISMATCH_RESULT_DNI
    );
}

export function shouldShowIdentityVerificationSuccessBanner({
    user,
    manualStatus,
    resultMessage
}) {
    if (isMercadoPagoMismatchResult(resultMessage)) {
        return false;
    }
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
