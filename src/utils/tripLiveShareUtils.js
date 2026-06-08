export function buildLiveShareUrl(token) {
    const origin =
        typeof window !== 'undefined' && window.location
            ? window.location.origin
            : '';
    return `${origin}/live/${token}`;
}

export function getUpdateIntervalMs(role) {
    return role === 'viewer' ? 60000 : 45000;
}
