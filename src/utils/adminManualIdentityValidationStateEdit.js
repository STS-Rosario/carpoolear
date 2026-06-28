export const MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS = [
    { value: 'pending', labelKey: 'estadoPendiente' },
    { value: 'approved', labelKey: 'estadoAprobado' },
    { value: 'rejected', labelKey: 'estadoRechazado' }
];

export function hasPhotosSubmitted(item) {
    return !!item?.['submitted_at'];
}

export function hasManualIdentityValidationStateChanges(item, { reviewStatus, paid, photosSubmitted }) {
    if (!item) {
        return false;
    }

    return (
        item.review_status !== reviewStatus ||
        !!item.paid !== !!paid ||
        hasPhotosSubmitted(item) !== !!photosSubmitted
    );
}

export function buildManualIdentityValidationStatePayload(item, { reviewStatus, paid, photosSubmitted }) {
    const payload = {};

    if (item.review_status !== reviewStatus) {
        payload.review_status = reviewStatus;
    }

    if (!!item.paid !== !!paid) {
        payload.paid = !!paid;
    }

    if (hasPhotosSubmitted(item) !== !!photosSubmitted) {
        payload.photos_submitted = !!photosSubmitted;
    }

    return payload;
}
