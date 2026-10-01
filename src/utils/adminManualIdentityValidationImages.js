export function shouldShowPurgedPhotosMessage(item) {
    return Boolean(item && !item.has_images && item.images_purged_at);
}

export function isApprovedWithImagesPending(item) {
    if (!item) {
        return false;
    }

    const status = item.review_status;
    const approved = status === 'approved' || status === 'approve';

    return approved && item.has_images === true;
}
