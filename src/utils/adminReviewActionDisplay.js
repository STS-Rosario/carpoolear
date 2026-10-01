export function getReviewActionAdminLabelKey(reviewStatus) {
    if (reviewStatus === 'approved' || reviewStatus === 'approve') return 'aprobadoPor';
    if (reviewStatus === 'rejected' || reviewStatus === 'reject') return 'rechazadoPor';
    if (reviewStatus === 'pending') return 'marcadoPendientePor';
    return 'revisadoPor';
}

export function shouldShowReviewAdminAction(item) {
    return Boolean(item && item.reviewed_at);
}
