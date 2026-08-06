export function adminUserSupportTicketsRoute(userId, options = {}) {
    const query = {};
    if (userId) {
        query.user_id = String(userId);
    }
    if (options.type) {
        query.type = String(options.type);
    }
    if (options.open) {
        query.open = '1';
    }
    return {
        name: 'admin-support-tickets',
        query
    };
}

export function shouldShowAdminUserSupportTicketsWarning(count) {
    return typeof count === 'number' && count > 0;
}
