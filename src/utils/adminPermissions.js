export const ADMIN_PERMISSIONS = {
    DashboardView: 'admin.dashboard.view',
    GraphsView: 'admin.graphs.view',
    UsersSearch: 'admin.users.search',
    UsersEdit: 'admin.users.edit',
    UsersImpersonate: 'admin.users.impersonate',
    UsersMigrate: 'admin.users.migrate',
    UsersDeleteRequests: 'admin.users.delete_requests',
    IdentityManualReview: 'admin.identity.manual.review',
    IdentityMpReview: 'admin.identity.mp.review',
    TripsView: 'admin.trips.view',
    SupportTickets: 'admin.support.tickets',
    AuditView: 'admin.audit.view',
    UsersSuspend: 'admin.users.suspend',
    UsersSetActive: 'admin.users.set_active',
    UsersVerify: 'admin.users.verify',
    UsersUnverify: 'admin.users.unverify',
    UsersDelete: 'admin.users.delete',
    UsersAnonymize: 'admin.users.anonymize',
    UsersBanAndAnonymize: 'admin.users.ban_and_anonymize',
    UsersDriverVerified: 'admin.users.driver_verified',
    UsersBannedList: 'admin.users.banned_list',
    IdentityManualPurge: 'admin.identity.manual.purge',
    IdentityStats: 'admin.identity.stats',
    TripsHide: 'admin.trips.hide',
    TripsExcessContribution: 'admin.trips.excess_contribution',
    RatingsEdit: 'admin.ratings.edit',
    ReferencesEdit: 'admin.references.edit',
    MaintenanceManage: 'admin.maintenance.manage',
    ChangelogsManage: 'admin.changelogs.manage',
    CarCatalog: 'admin.cars.catalog',
    PulseView: 'admin.pulse.view',
    BadgesManage: 'admin.badges.manage',
    CampaignsManage: 'admin.campaigns.manage'
};

export const ADMIN_NAV_ITEMS = [
    { name: 'admin-dashboard', labelKey: 'adminNavTablero', permission: ADMIN_PERMISSIONS.DashboardView },
    { name: 'admin-page', labelKey: 'adminNavGraficos', permission: ADMIN_PERMISSIONS.GraphsView },
    { name: 'admin-maintenance', labelKey: 'adminNavMaintenance', permission: ADMIN_PERMISSIONS.MaintenanceManage },
    { name: 'admin-users', labelKey: 'adminNavUsuarios', permission: ADMIN_PERMISSIONS.UsersSearch },
    { name: 'admin-user-migrations', labelKey: 'migrarUsuarios', permission: ADMIN_PERMISSIONS.UsersMigrate },
    { name: 'admin-users-delete-list', labelKey: 'pedidosDeEliminacionDeCuenta', permission: ADMIN_PERMISSIONS.UsersDeleteRequests },
    { name: 'admin-trips', labelKey: 'adminNavViajes', permission: ADMIN_PERMISSIONS.TripsView },
    { name: 'admin-exceso-contribucion', labelKey: 'adminNavExcesoContribucion', permission: ADMIN_PERMISSIONS.TripsExcessContribution },
    { name: 'admin-banned-users', labelKey: 'usuariosBloqueados', permission: ADMIN_PERMISSIONS.UsersBannedList },
    { name: 'admin-manual-identity-validations', labelKey: 'validacionesManuales', permission: ADMIN_PERMISSIONS.IdentityManualReview },
    { name: 'admin-mp-rejected-validations', labelKey: 'rechazosMercadoPago', permission: ADMIN_PERMISSIONS.IdentityMpReview },
    { name: 'admin-support-tickets', labelKey: 'soporte', permission: ADMIN_PERMISSIONS.SupportTickets },
    { name: 'admin-action-logs', labelKey: 'adminNavActionLogs', permission: ADMIN_PERMISSIONS.AuditView },
    { name: 'admin-changelogs', labelKey: 'adminNavChangelog', permission: ADMIN_PERMISSIONS.ChangelogsManage },
    { name: 'admin-car-brands', labelKey: 'adminNavCarCatalog', permission: ADMIN_PERMISSIONS.CarCatalog },
    { name: 'admin-car-colors', labelKey: 'adminCarColors', permission: ADMIN_PERMISSIONS.CarCatalog }
];

export function can(user, permission) {
    if (!user || !user.is_admin) {
        return false;
    }
    const permissions = Array.isArray(user.admin_permissions)
        ? user.admin_permissions
        : [];
    return permissions.includes(permission);
}

export function visibleAdminNavItems(user) {
    return ADMIN_NAV_ITEMS.filter((item) => can(user, item.permission));
}
