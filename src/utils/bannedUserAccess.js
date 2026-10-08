export const BANNED_USER_HOME_ROUTE = { name: 'tickets' };

export const BANNED_USER_ALLOWED_ROUTES = ['tickets', 'ticket-detail'];

export function isUserBanned(user) {
    return Boolean(user && Number(user.banned) === 1);
}

export function isBannedUserAllowedRoute(routeName) {
    return BANNED_USER_ALLOWED_ROUTES.includes(routeName);
}

export function bannedUserRedirectLocation(user, routeName) {
    if (!isUserBanned(user)) {
        return null;
    }

    if (isBannedUserAllowedRoute(routeName)) {
        return null;
    }

    return BANNED_USER_HOME_ROUTE;
}
