export function isManualIdentityValidationResolved(item) {
    const status = item?.review_status;
    return status === 'approved' || status === 'rejected';
}

export function filterManualIdentityValidationsList(list, showResolved = false) {
    if (showResolved) {
        return list;
    }

    return list.filter((item) => !isManualIdentityValidationResolved(item));
}
