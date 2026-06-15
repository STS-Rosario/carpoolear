import { describe, expect, it } from 'vitest';
import messages from './i18n';

/** Header and settings navigation labels (sentence case, not CSS-uppercased). */
const MENU_LABELS = {
    arg: {
        misViajes: 'Mis viajes',
        mensajes: 'Mensajes',
        perfil: 'Perfil',
        soporte: 'Mesa de ayuda',
        ultimosCambios: 'Últimos cambios',
        administracion: 'Administración',
        cerrarSesion: 'Cerrar sesión',
        acercaDe: 'Acerca de',
        tyc: 'Términos y Condiciones',
        viajes: 'Viajes',
        crearViaje: 'Crear viaje',
        donar: 'Donar',
        inicio: 'Inicio'
    },
    en: {
        misViajes: 'My trips',
        mensajes: 'Messages',
        perfil: 'Profile',
        soporte: 'Help desk',
        ultimosCambios: 'Latest changes',
        administracion: 'Administration',
        cerrarSesion: 'Log out',
        acercaDe: 'About',
        tyc: 'Terms and Conditions',
        viajes: 'Trips',
        crearViaje: 'Create trip',
        donar: 'Donate',
        inicio: 'Home'
    }
};

describe('menu labels (i18n)', () => {
    it.each(Object.entries(MENU_LABELS))(
        '%s locale uses sentence case for header and settings menu items',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
