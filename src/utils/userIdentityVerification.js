export function isUserIdentityVerified(user) {
    if (!user) {
        return false;
    }
    if (typeof user.identity_validated === 'boolean') {
        return user.identity_validated;
    }
    return Number(user.identity_validated) > 0;
}
