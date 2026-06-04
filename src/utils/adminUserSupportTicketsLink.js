export function adminUserSupportTicketsRoute(userId) {
    const query = {};
    if (userId) {
        query.user_id = String(userId);
    }
    return {
        name: 'admin-support-tickets',
        query
    };
}

export function shouldShowAdminUserSupportTicketsWarning(count) {
    return typeof count === 'number' && count > 0;
}
