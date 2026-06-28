export const MANUAL_IDENTITY_VALIDATION_REVIEW_STATUS_OPTIONS = [
    { value: 'pending', labelKey: 'estadoPendiente' },
    { value: 'approved', labelKey: 'estadoAprobado' },
    { value: 'rejected', labelKey: 'estadoRechazado' }
];

export function hasManualIdentityValidationStateChanges(item, { reviewStatus, paid }) {
    if (!item) {
        return false;
    }

    return item.review_status !== reviewStatus || !!item.paid !== !!paid;
}

export function buildManualIdentityValidationStatePayload(item, { reviewStatus, paid }) {
    const payload = {};

    if (item.review_status !== reviewStatus) {
        payload.review_status = reviewStatus;
    }

    if (!!item.paid !== !!paid) {
        payload.paid = !!paid;
    }

    return payload;
}
