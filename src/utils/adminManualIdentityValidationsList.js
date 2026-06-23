export const ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY =
    'adminManualIdentityValidationsShowResolved';

function createMemoryStorage() {
    const values = new Map();

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        }
    };
}

function resolveStorage(storage) {
    if (storage) {
        return storage;
    }

    if (typeof localStorage !== 'undefined') {
        return localStorage;
    }

    return createMemoryStorage();
}

export function getShowResolvedManualIdentityValidations(storage) {
    return resolveStorage(storage).getItem(
        ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY
    ) === 'true';
}

export function saveShowResolvedManualIdentityValidations(showResolved, storage) {
    resolveStorage(storage).setItem(
        ADMIN_MANUAL_IDENTITY_VALIDATIONS_SHOW_RESOLVED_KEY,
        showResolved ? 'true' : 'false'
    );
}

const RESOLVED_REVIEW_STATUSES = new Set(['approved', 'approve', 'rejected', 'reject']);

export function isManualIdentityValidationResolved(item) {
    const reviewStatus = item?.['review_status'];

    return RESOLVED_REVIEW_STATUSES.has(reviewStatus);
}

export function filterManualIdentityValidationsList(list, showResolved = false) {
    if (showResolved) {
        return list;
    }

    return list.filter((item) => !isManualIdentityValidationResolved(item));
}

export function sortManualIdentityValidationsList(list, sortKey, sortDir = 'asc') {
    if (!sortKey) {
        return list;
    }

    const direction = sortDir === 'desc' ? -1 : 1;
    const sorted = [...list];

    if (sortKey === 'id') {
        sorted.sort((a, b) => direction * ((a.id ?? 0) - (b.id ?? 0)));
    }

    return sorted;
}
