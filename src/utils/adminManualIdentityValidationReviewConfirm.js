export function shouldConfirmAlreadyPendingReview(action, reviewStatus) {
    return action === 'pending' && reviewStatus === 'pending';
}
