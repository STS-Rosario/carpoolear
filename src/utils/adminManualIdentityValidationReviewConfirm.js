export function shouldConfirmAlreadyPendingReview(action, reviewStatus) {
    return action === 'pending' && reviewStatus === 'pending';
}

export function shouldConfirmReviewAction(action) {
    return action === 'approve' || action === 'reject';
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

    return null;
}

export function shouldProceedWithReviewAction(action, reviewStatus, confirmAction) {
    if (!shouldConfirmReviewAction(action)) {
        if (!shouldConfirmAlreadyPendingReview(action, reviewStatus)) {
            return true;
        }

        return confirmAction();
    }

    return confirmAction();
}
