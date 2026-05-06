export function getAdminUserProfileRoute(userId) {
    return {
        name: 'admin-users-user',
        params: { userId }
    };
}
