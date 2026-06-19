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

export function canManualResubmitWithoutPayment(manualStatus) {
    /* eslint-disable camelcase -- manual status API uses snake_case */
    return manualStatus?.can_resubmit_without_payment === true;
    /* eslint-enable camelcase */
}

export function getManualValidationResubmitRoute(manualStatus) {
    /* eslint-disable camelcase -- manual status API uses snake_case */
    if (!canManualResubmitWithoutPayment(manualStatus) || !manualStatus?.request_id) {
        return null;
    }

    return {
        name: 'identity_validation_manual',
        query: {
            request_id: manualStatus.request_id,
            resubmit: '1'
        }
    };
    /* eslint-enable camelcase */
}

export function shouldShowManualValidationPayAgain(manualStatus) {
    /* eslint-disable camelcase -- manual status API uses snake_case */
    if (!manualStatus?.submitted_at) {
        return false;
    }
    if (manualStatus.review_status !== 'rejected') {
        return false;
    }

    return !canManualResubmitWithoutPayment(manualStatus);
    /* eslint-enable camelcase */
}

export function shouldShowManualValidationAlreadySubmitted(manualStatus) {
    /* eslint-disable camelcase -- manual status API uses snake_case */
    if (!manualStatus?.submitted_at) {
        return false;
    }
    if (canManualResubmitWithoutPayment(manualStatus)) {
        return false;
    }
    if (manualStatus.review_status === 'rejected') {
        return false;
    }

    return true;
    /* eslint-enable camelcase */
}

export function getManualValidationRestartRoute(manualStatus) {
    if (!shouldShowManualValidationPayAgain(manualStatus)) {
        return null;
    }

    return {
        name: 'identity_validation_manual',
        query: { restart: '1' }
    };
}
