import { parseAdminPaginationFromRoute } from './adminPagination.js';

export const ADMIN_DONATION_LEDGER_SORT_COLUMNS = [
    { key: 'paid_at', labelKey: 'fecha' },
    { key: 'user_name', labelKey: 'nombre' },
    { key: 'amount_cents', labelKey: 'monto' },
    { key: 'kind', labelKey: 'tipo' },
    { key: 'status', labelKey: 'estado' },
    { key: 'tier_slug', labelKey: 'plan' },
    { key: 'source', labelKey: 'origen' }
];

export function parseDonationLedgerListFromRoute(query = {}) {
    const pagination = parseAdminPaginationFromRoute(query);
    const sortDir = String(query.direction || '').toLowerCase() === 'asc' ? 'asc' : 'desc';

    return {
        kind: query.kind ? String(query.kind) : '',
        status: query.status ? String(query.status) : '',
        q: query.q ? String(query.q) : '',
        sortKey: query.sort ? String(query.sort) : null,
        sortDir,
        page: pagination.page,
        perPage: pagination.perPage
    };
}

export function buildDonationLedgerListParams({
    kind = '',
    status = '',
    q = '',
    sortKey = null,
    sortDir = 'desc',
    page,
    perPage
} = {}) {
    const params = {};
    if (kind) {
        params.kind = kind;
    }
    if (status) {
        params.status = status;
    }
    if (q) {
        params.q = q;
    }
    if (sortKey) {
        params.sort = sortKey;
        params.direction = sortDir === 'asc' ? 'asc' : 'desc';
    }
    if (page) {
        params.page = page;
    }
    if (perPage) {
        params.per_page = perPage;
    }
    return params;
}

export function getNextDonationLedgerSortState(currentKey, currentDir, column) {
    if (currentKey === column) {
        return {
            sortKey: column,
            sortDir: currentDir === 'asc' ? 'desc' : 'asc'
        };
    }

    return {
        sortKey: column,
        sortDir: column === 'paid_at' || column === 'amount_cents' ? 'desc' : 'asc'
    };
}
