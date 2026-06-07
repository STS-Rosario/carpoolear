export function getAdminUserBannedBanner(user, translate) {
    const isBanned = Number(user?.banned) > 0;

    if (isBanned) {
        return {
            label: translate('usuarioSuspendido'),
            modifier: 'danger'
        };
    }

    return {
        label: translate('usuarioActivo'),
        modifier: 'success'
    };
}

export function buildAdminUserPropertyRows() {
    return [];
}
