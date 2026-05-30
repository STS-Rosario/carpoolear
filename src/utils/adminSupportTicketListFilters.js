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
    return params;
}

export function parseAdminSupportTicketListFiltersFromRoute(query = {}) {
    const needsReplyRaw = query.needs_reply != null ? String(query.needs_reply).toLowerCase() : '';
    return {
        type: query.type ? String(query.type) : '',
        priority: query.priority ? String(query.priority) : '',
        needsReply: TRUTHY_QUERY_VALUES.has(needsReplyRaw)
    };
}

export function filtersAreActive(filters = {}) {
    return Boolean(filters.type || filters.priority || filters.needsReply);
}
