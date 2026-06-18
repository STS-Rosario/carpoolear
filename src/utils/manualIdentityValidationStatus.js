function isUserIdentityVerified(user) {
    if (!user) {
        return false;
    }
    if (typeof user.identity_validated === 'boolean') {
        return user.identity_validated;
    }
    return Number(user.identity_validated) > 0;
}

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
