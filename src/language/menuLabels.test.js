import { describe, expect, it } from 'vitest';
import messages from './i18n';

/** Header and settings navigation labels (title case, not CSS-uppercased). */
const MENU_LABELS = {
    arg: {
        misViajes: 'Mis Viajes',
        mensajes: 'Mensajes',
        perfil: 'Perfil',
        soporte: 'Mesa de ayuda',
        ultimosCambios: 'Últimos Cambios',
        administracion: 'Administración',
        cerrarSesion: 'Cerrar sesión',
        acercaDe: 'Acerca de',
        tyc: 'Términos y Condiciones',
        viajes: 'Viajes',
        crearViaje: 'Crear Viaje',
        donar: 'Donar',
        inicio: 'Inicio'
    },
    en: {
        misViajes: 'My Trips',
        mensajes: 'Messages',
        perfil: 'Profile',
        soporte: 'Help desk',
        ultimosCambios: 'Latest Changes',
        administracion: 'Administration',
        cerrarSesion: 'Log out',
        acercaDe: 'About',
        tyc: 'Terms and Conditions',
        viajes: 'Trips',
        crearViaje: 'Create Trip',
        donar: 'Donate',
        inicio: 'Home'
    }
};

describe('menu labels (i18n)', () => {
    it.each(Object.entries(MENU_LABELS))(
        '%s locale uses title case for header and settings menu items',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
