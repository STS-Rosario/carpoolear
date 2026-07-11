import {
    DELETE_ACCOUNT_QUERY,
    identityValidationAvailable
} from './myAccountMenuItems';

const FAQ_URL = 'https://carpoolear.com.ar/plataforma-preguntas-frecuentes';

/**
 * Builds the grouped mobile "Mi cuenta" navigation sections.
 *
 * Items are one of:
 *   - internal route:  { route: { name, ... } }
 *   - external link:   { href }
 *   - placeholder:     { placeholder: true }  (rendered, non-clickable)
 *   - locale switcher: { localeSwitcher: true }
 *   - hidden:          { hidden: true } (kept in source, filtered out)
 *
 * `delete-account` is intentionally excluded from the sections; it is rendered
 * as a separate action below the list on the mobile screen.
 */
export function getMyAccountMobileSections(config) {
    const profile = [
        {
            id: 'edit-profile',
            labelKey: 'editarPerfilPublico',
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
            localeSwitcher: true
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
            icon: 'fa-life-ring',
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

export const MOBILE_DELETE_ACCOUNT_ROUTE = {
    name: 'profile_update',
    query: DELETE_ACCOUNT_QUERY
};
