export const ADMIN_USER_PROFILE_ROUTE_NAME = 'admin-users-user';

export function getAdminUserProfileRoute(userId) {
    return {
        name: ADMIN_USER_PROFILE_ROUTE_NAME,
        params: { userId: String(userId) }
    };
}
