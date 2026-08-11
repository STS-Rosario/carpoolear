export const FRIENDS_SOLICITUDES_TAB_INDEX = 1;

export const FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE = {
    name: 'friends_setting',
    query: { tab: 'solicitudes', filter: 'recibidas' }
};

export function applyFriendsSettingDeepLink(query, handlers) {
    const tab = query && query.tab;
    const filter = query && query.filter;

    if (filter === 'recibidas' || filter === 'enviadas') {
        handlers.setRequestsFilter(filter);
    }

    if (tab === 'solicitudes') {
        handlers.activateTab(FRIENDS_SOLICITUDES_TAB_INDEX);
    }
}
