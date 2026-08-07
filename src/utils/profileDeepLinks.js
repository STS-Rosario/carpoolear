export const PROFILE_TAB_INDEX = {
    viajes: 0,
    perfil: 1,
    calificaciones: 2
};

export const PROFILE_DEFAULT_TAB = 'perfil';

export function buildProfileTabRoute({ id = 'me', tab = PROFILE_DEFAULT_TAB } = {}) {
    return {
        name: 'profile',
        params: { id },
        query: { tab }
    };
}

export function resolveProfileTabIndex({ query, activeTab, hash } = {}) {
    const namedTab = query && query.tab;
    if (namedTab && Object.prototype.hasOwnProperty.call(PROFILE_TAB_INDEX, namedTab)) {
        return PROFILE_TAB_INDEX[namedTab];
    }

    if (activeTab !== undefined && activeTab !== null && activeTab !== '') {
        const fromProp = parseInt(activeTab, 10);
        if (!Number.isNaN(fromProp)) {
            return fromProp;
        }
    }

    if (hash) {
        const fromHash = parseInt(String(hash).replace('#', ''), 10);
        if (!Number.isNaN(fromHash)) {
            return fromHash;
        }
    }

    return PROFILE_TAB_INDEX[PROFILE_DEFAULT_TAB];
}
