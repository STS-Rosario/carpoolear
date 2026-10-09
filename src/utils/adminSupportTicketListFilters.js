import { parseAdminPaginationFromRoute } from './adminPagination';

const TRUTHY_QUERY_VALUES = new Set(['1', 'true', 'yes']);

export const ADMIN_SUPPORT_TICKET_SORT_COLUMNS = [
    { key: 'subject', labelKey: 'asuntoTicket' },
    { key: 'priority', labelKey: 'prioridad' },
    { key: 'created_at', labelKey: 'creado' },
    { key: 'updated_at', labelKey: 'actualizado' },
    { key: 'status', labelKey: 'estado' },
    { key: 'assigned_to', labelKey: 'asignadoA' },
    { key: 'type', labelKey: 'categoriaTicket' }
];

const ADMIN_SUPPORT_TICKET_SORT_KEYS = new Set(
    ADMIN_SUPPORT_TICKET_SORT_COLUMNS.map((column) => column.key)
);

const DESC_FIRST_SUPPORT_TICKET_SORT_COLUMNS = new Set(['created_at', 'updated_at', 'priority']);

function parseSupportTicketSortFromRoute(query = {}) {
    const sortRaw = query.sort != null ? String(query.sort) : '';
    const sortKey = sortRaw && ADMIN_SUPPORT_TICKET_SORT_KEYS.has(sortRaw) ? sortRaw : null;
    if (!sortKey) {
        return { sortKey: null, sortDir: 'desc' };
    }
    const directionRaw = String(query.direction || '').toLowerCase();
    const sortDir = directionRaw === 'asc' ? 'asc' : 'desc';

    return { sortKey, sortDir };
}

export function getNextAdminSupportTicketSortState(currentKey, currentDir, column) {
    if (currentKey === column) {
        return {
            sortKey: column,
            sortDir: currentDir === 'asc' ? 'desc' : 'asc'
        };
    }

    return {
        sortKey: column,
        sortDir: DESC_FIRST_SUPPORT_TICKET_SORT_COLUMNS.has(column) ? 'desc' : 'asc'
    };
}

export function buildAdminSupportTicketListParams(filters = {}) {
    const params = {};
    if (filters.type) {
        params.type = filters.type;
    }
    if (filters.priority) {
        params.priority = filters.priority;
    }
    if (filters.needsReply) {
        params.needs_reply = '1';
    }
    if (filters.open) {
        params.open = '1';
    }
    if (filters.createdByAdmin) {
        params.created_by_admin = '1';
    }
    if (filters.userId) {
        params.user_id = String(filters.userId);
    }
    if (filters.page) {
        params.page = filters.page;
    }
    if (filters.perPage) {
        params.per_page = filters.perPage;
    }
    if (filters.sortKey) {
        params.sort = filters.sortKey;
        params.direction = filters.sortDir === 'asc' ? 'asc' : 'desc';
    }
    return params;
}

export function parseAdminSupportTicketListFiltersFromRoute(query = {}) {
    const needsReplyRaw = query.needs_reply != null ? String(query.needs_reply).toLowerCase() : '';
    const openRaw = query.open != null ? String(query.open).toLowerCase() : '';
    const createdByAdminRaw =
        query.created_by_admin != null ? String(query.created_by_admin).toLowerCase() : '';
    const userIdRaw = query.user_id != null ? parseInt(String(query.user_id), 10) : NaN;
    const pagination = parseAdminPaginationFromRoute(query);
    const { sortKey, sortDir } = parseSupportTicketSortFromRoute(query);
    return {
        type: query.type ? String(query.type) : '',
        priority: query.priority ? String(query.priority) : '',
        needsReply: TRUTHY_QUERY_VALUES.has(needsReplyRaw),
        open: TRUTHY_QUERY_VALUES.has(openRaw),
        createdByAdmin: TRUTHY_QUERY_VALUES.has(createdByAdminRaw),
        userId: Number.isNaN(userIdRaw) || userIdRaw <= 0 ? null : userIdRaw,
        page: pagination.page,
        perPage: pagination.perPage,
        sortKey,
        sortDir
    };
}

export function filtersAreActive(filters = {}) {
    return Boolean(
        filters.type ||
            filters.priority ||
            filters.needsReply ||
            filters.open ||
            filters.createdByAdmin ||
            filters.userId
    );
}
