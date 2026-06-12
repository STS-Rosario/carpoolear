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
