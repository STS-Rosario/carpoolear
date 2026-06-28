export function shouldConfirmAlreadyPendingReview(action, reviewStatus) {
    return action === 'pending' && reviewStatus === 'pending';
}

export function shouldProceedWithReviewAction(action, reviewStatus, confirmAction) {
    if (!shouldConfirmAlreadyPendingReview(action, reviewStatus)) {
        return true;
    }

    return confirmAction();
}
