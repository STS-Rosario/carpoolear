export function cloneProfileUser(user) {
    if (!user || typeof user !== 'object') {
        return null;
    }

    return JSON.parse(JSON.stringify(user));
}
