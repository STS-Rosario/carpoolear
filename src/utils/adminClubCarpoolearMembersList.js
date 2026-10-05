import { parseAdminPaginationFromRoute } from './adminPagination.js';

export const ADMIN_CLUB_MEMBERS_SORT_COLUMNS = [
    { key: 'user_name', labelKey: 'nombre' },
    { key: 'joined_at', labelKey: 'fechaIngreso' },
    { key: 'last_paid_at', labelKey: 'fechaUltimoPago' },
    { key: 'tier_slug', labelKey: 'plan' },
    { key: 'total_donated_cents', labelKey: 'totalDonado' },
    { key: 'left_at', labelKey: 'fechaDeBaja' }
];

export function parseClubMembersListFromRoute(query = {}) {
    const pagination = parseAdminPaginationFromRoute(query);
    const status = query.status === 'former' ? 'former' : 'current';
    const sortDir = String(query.direction || '').toLowerCase() === 'asc' ? 'asc' : 'desc';

    return {
        status,
        q: query.q ? String(query.q) : '',
        tier: query.tier ? String(query.tier) : '',
        sortKey: query.sort ? String(query.sort) : null,
        sortDir,
        page: pagination.page,
        perPage: pagination.perPage
    };
}

export function buildClubMembersListParams({
    status = 'current',
    q = '',
    tier = '',
    sortKey = null,
    sortDir = 'desc',
    page,
    perPage
} = {}) {
    const params = {
        status: status === 'former' ? 'former' : 'current'
    };
    if (q) {
        params.q = q;
    }
    if (tier) {
        params.tier = tier;
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

export function getNextClubMembersSortState(currentKey, currentDir, column) {
    if (currentKey === column) {
        return {
            sortKey: column,
            sortDir: currentDir === 'asc' ? 'desc' : 'asc'
        };
    }

    return {
        sortKey: column,
        sortDir: column === 'total_donated_cents' || column === 'last_paid_at' ? 'desc' : 'asc'
    };
}
