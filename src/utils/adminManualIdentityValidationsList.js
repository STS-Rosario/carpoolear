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

function compareNumbers(a, b, direction) {
    return direction * (a - b);
}

function compareNullableValues(a, b, direction, comparePresent) {
    if (a == null && b == null) {
        return 0;
    }

    if (a == null) {
        return 1;
    }

    if (b == null) {
        return -1;
    }

    return direction * comparePresent(a, b);
}

function compareStrings(a, b, direction) {
    return direction * String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
}

function compareDates(a, b, direction) {
    return compareNullableValues(
        a,
        b,
        direction,
        (left, right) => new Date(left).getTime() - new Date(right).getTime()
    );
}

function getManualIdentityValidationWaitingTimeMs(item, now = Date.now()) {
    if (!item?.submitted_at) {
        return null;
    }

    const submitted = new Date(item.submitted_at).getTime();
    const end = item.manual_validation_started_at
        ? new Date(item.manual_validation_started_at).getTime()
        : now;

    return Math.max(0, end - submitted);
}

const REVIEW_STATUS_SORT_ORDER = {
    unpaid: 0,
    pending: 1,
    approved: 2,
    approve: 2,
    rejected: 3,
    reject: 3
};

function getReviewStatusSortRank(item) {
    if (!item?.paid) {
        return REVIEW_STATUS_SORT_ORDER.unpaid;
    }

    const status = item.review_status;

    if (status == null || status === '') {
        return REVIEW_STATUS_SORT_ORDER.pending;
    }

    return REVIEW_STATUS_SORT_ORDER[status] ?? REVIEW_STATUS_SORT_ORDER.pending;
}

const SORT_COMPARATORS = {
    id: (a, b, direction) => compareNumbers(a.id ?? 0, b.id ?? 0, direction),
    user_name: (a, b, direction) => compareNullableValues(
        a.user_name,
        b.user_name,
        direction,
        (left, right) => compareStrings(left, right, 1)
    ),
    paid_at: (a, b, direction) => compareDates(a.paid_at, b.paid_at, direction),
    submitted_at: (a, b, direction) => compareDates(a.submitted_at, b.submitted_at, direction),
    waiting_time: (a, b, direction, now) => compareNullableValues(
        getManualIdentityValidationWaitingTimeMs(a, now),
        getManualIdentityValidationWaitingTimeMs(b, now),
        direction,
        (left, right) => compareNumbers(left, right, 1)
    ),
    paid: (a, b, direction) => compareNumbers(Number(Boolean(a.paid)), Number(Boolean(b.paid)), direction),
    review_status: (a, b, direction) => compareNumbers(
        getReviewStatusSortRank(a),
        getReviewStatusSortRank(b),
        direction
    )
};

export function sortManualIdentityValidationsList(list, sortKey, sortDir = 'asc', now = Date.now()) {
    if (!sortKey) {
        return list;
    }

    const compare = SORT_COMPARATORS[sortKey];

    if (!compare) {
        return list;
    }

    const direction = sortDir === 'desc' ? -1 : 1;

    return [...list].sort((a, b) => compare(a, b, direction, now) || compareNumbers(a.id ?? 0, b.id ?? 0, 1));
}
