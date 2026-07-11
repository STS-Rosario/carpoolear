import {
    DELETE_ACCOUNT_QUERY,
    identityValidationAvailable
} from './myAccountMenuItems';

const FAQ_URL = 'https://carpoolear.com.ar/plataforma-preguntas-frecuentes';

const LANGUAGE_LABELS = {
    arg: 'Español',
    en: 'English'
};

const ROUTE_SECTION = {
    profile_update: 'perfil',
    profile_cars: 'perfil',
    friends_setting: 'perfil',
    friends_search: 'perfil',
    identity_validation: 'perfil',
    identity_validation_manual: 'perfil',
    my-account: 'perfil',
    tickets: 'ayuda',
    'ticket-new': 'ayuda',
    'ticket-detail': 'ayuda',
    acerca_de: 'ayuda',
    terms: 'ayuda'
};

const ROUTE_ACTIVE_ITEM_ID = {
    profile_update: 'edit-profile',
    profile_cars: 'cars',
    friends_setting: 'friends',
    friends_search: 'friends',
    identity_validation: 'identity-validation',
    identity_validation_manual: 'identity-validation',
    tickets: 'support',
    'ticket-new': 'support',
    'ticket-detail': 'support',
    acerca_de: 'about',
    terms: 'legal'
};

function buildDesktopSections(config, locale) {
    const profile = [
        {
            id: 'resumen',
            labelKey: 'resumen',
            icon: 'fa-th-large',
            route: { name: 'my-account' },
            hidden: true
        },
        {
            id: 'edit-profile',
            labelKey: 'editarPerfil',
            icon: 'fa-user',
            route: { name: 'profile_update' }
        },
        {
            id: 'friends',
            labelKey: 'misAmigos',
            icon: 'fa-users',
            route: { name: 'friends_setting' }
        },
        {
            id: 'cars',
            labelKey: 'misAutos',
            icon: 'fa-car',
            route: { name: 'profile_cars' }
        },
        {
            id: 'ratings',
            labelKey: 'calificaciones',
            icon: 'fa-star',
            placeholder: true,
            hidden: true
        }
    ];

    if (identityValidationAvailable(config)) {
        profile.push({
            id: 'identity-validation',
            labelKey: 'validarIdentidad',
            icon: 'fa-shield',
            route: { name: 'identity_validation' }
        });
    }

    const configuracion = [
        {
            id: 'notifications',
            labelKey: 'configuracionNotificaciones',
            icon: 'fa-bell-o',
            route: { name: 'profile_update' }
        },
        {
            id: 'privacy',
            labelKey: 'configuracionPrivacidad',
            icon: 'fa-lock',
            placeholder: true,
            hidden: true
        },
        {
            id: 'password',
            labelKey: 'cambiarPassword',
            icon: 'fa-key',
            route: { name: 'profile_update' }
        },
        {
            id: 'language',
            labelKey: 'idioma',
            icon: 'fa-globe',
            localeSwitcher: true,
            value: LANGUAGE_LABELS[locale] || LANGUAGE_LABELS.arg
        }
    ];

    const ayuda = [
        {
            id: 'faq',
            labelKey: 'preguntasFrecuentes',
            icon: 'fa-question-circle',
            href: FAQ_URL
        },
        {
            id: 'support',
            labelKey: 'soporte',
            icon: 'fa-headphones',
            route: { name: 'tickets' }
        },
        {
            id: 'about',
            labelKey: 'acercaDe',
            icon: 'fa-info-circle',
            route: { name: 'acerca_de' }
        },
        {
            id: 'legal',
            labelKey: 'legales',
            icon: 'fa-file-text-o',
            route: { name: 'terms' }
        }
    ];

    return [
        {
            id: 'perfil',
            labelKey: 'perfil',
            items: profile.filter((item) => !item.hidden)
        },
        {
            id: 'configuracion',
            labelKey: 'configuracion',
            items: configuracion.filter((item) => !item.hidden)
        },
        { id: 'ayuda', labelKey: 'ayuda', items: ayuda }
    ];
}

export function getMyAccountDesktopSections(config, locale = 'arg') {
    return buildDesktopSections(config, locale);
}

export function getMyAccountDesktopExpandedSection(routeName) {
    return ROUTE_SECTION[routeName] || 'perfil';
}

export function isMyAccountDesktopItemActive(item, routeName) {
    if (!item || !routeName) {
        return false;
    }
    if (Object.prototype.hasOwnProperty.call(ROUTE_ACTIVE_ITEM_ID, routeName)) {
        return item.id === ROUTE_ACTIVE_ITEM_ID[routeName];
    }
    return false;
}

export const DESKTOP_DELETE_ACCOUNT_ROUTE = {
    name: 'profile_update',
    query: DELETE_ACCOUNT_QUERY
};

export const DESKTOP_DEFAULT_ACCOUNT_ROUTE = { name: 'profile_update' };
