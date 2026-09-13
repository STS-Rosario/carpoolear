export function shouldConfirmAlreadyPendingReview(action, reviewStatus) {
    return action === 'pending' && reviewStatus === 'pending';
}

export function shouldConfirmReviewAction(action) {
    return action === 'approve' || action === 'reject' || action === 'pending';
}

export function getReviewActionConfirmMessageKey(action, reviewStatus) {
    if (action === 'approve') {
        return 'confirmarAprobarManualIdentity';
    }

    if (action === 'reject') {
        return 'confirmarRechazarManualIdentity';
    }

    if (shouldConfirmAlreadyPendingReview(action, reviewStatus)) {
        return 'confirmMarcarPendienteYaPendiente';
    }

    if (action === 'pending') {
        return 'confirmarMarcarPendienteManualIdentity';
    }

    return null;
}

export function shouldProceedWithReviewAction(action, reviewStatus, confirmAction) {
    if (!shouldConfirmReviewAction(action)) {
        return true;
    }

    return confirmAction();
}
