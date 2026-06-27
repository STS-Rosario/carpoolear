export const DELETE_ACCOUNT_QUERY = { action: 'delete-account' };

export function identityValidationAvailable(config) {
    const c = config;
    return (
        c &&
        c.identity_validation_enabled === true &&
        (c.identity_validation_mercado_pago_enabled === true ||
            c.identity_validation_manual_enabled === true)
    );
}

export function getMyAccountMenuItems(config) {
    const items = [
        {
            id: 'edit-profile',
            labelKey: 'editarPerfilPublico',
            icon: 'fa-user-circle-o',
            route: { name: 'profile_update' }
        },
        {
            id: 'cars',
            labelKey: 'misAutos',
            icon: 'fa-car',
            route: { name: 'profile_cars' }
        },
        {
            id: 'friends',
            labelKey: 'misAmigos',
            icon: 'fa-id-card-o',
            route: { name: 'friends_setting' }
        }
    ];

    if (identityValidationAvailable(config)) {
        items.push({
            id: 'identity-validation',
            labelKey: 'validarIdentidad',
            icon: 'fa-shield',
            route: { name: 'identity_validation' }
        });
    }

    items.push(
        // {
        //     id: 'notifications',
        //     labelKey: 'configuracionNotificaciones',
        //     icon: 'fa-bell-o',
        //     route: { name: 'profile_update' }
        // },
        // {
        //     id: 'privacy',
        //     labelKey: 'configuracionPrivacidad',
        //     icon: 'fa-user-secret',
        //     route: { name: 'profile_update' }
        // },
        // {
        //     id: 'password',
        //     labelKey: 'cambiarPassword',
        //     icon: 'fa-key',
        //     route: { name: 'profile_update' }
        // },
        {
            id: 'delete-account',
            labelKey: 'eliminarCuenta',
            icon: 'fa-trash-o',
            route: { name: 'profile_update', query: DELETE_ACCOUNT_QUERY }
        }
    );

    return items;
}

const ROUTE_ACTIVE_ITEM_ID = {
    profile_update: 'edit-profile',
    profile_cars: 'cars',
    friends_setting: 'friends',
    friends_search: 'friends',
    identity_validation: 'identity-validation',
    identity_validation_manual: 'identity-validation'
};

export function isMyAccountMenuItemActive(item, routeName) {
    if (Object.prototype.hasOwnProperty.call(ROUTE_ACTIVE_ITEM_ID, routeName)) {
        return item.id === ROUTE_ACTIVE_ITEM_ID[routeName];
    }
    return false;
}
