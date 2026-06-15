export function shouldShowPurgedPhotosMessage(item) {
    return Boolean(item && !item.has_images && item.images_purged_at);
}
