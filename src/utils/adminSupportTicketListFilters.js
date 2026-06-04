const TRUTHY_QUERY_VALUES = new Set(['1', 'true', 'yes']);

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
    if (filters.userId) {
        params.user_id = String(filters.userId);
    }
    return params;
}

export function parseAdminSupportTicketListFiltersFromRoute(query = {}) {
    const needsReplyRaw = query.needs_reply != null ? String(query.needs_reply).toLowerCase() : '';
    const userIdRaw = query.user_id != null ? parseInt(String(query.user_id), 10) : NaN;
    return {
        type: query.type ? String(query.type) : '',
        priority: query.priority ? String(query.priority) : '',
        needsReply: TRUTHY_QUERY_VALUES.has(needsReplyRaw),
        userId: Number.isNaN(userIdRaw) || userIdRaw <= 0 ? null : userIdRaw
    };
}

export function filtersAreActive(filters = {}) {
    return Boolean(filters.type || filters.priority || filters.needsReply || filters.userId);
}
