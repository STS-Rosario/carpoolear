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
        donar: 'Aportar',
        inicio: 'Inicio',
        miCuenta: 'Mi cuenta',
        editarPerfilPublico: 'Editar perfil público',
        misAutos: 'Mis autos',
        configuracionNotificaciones: 'Configuración de notificaciones',
        configuracionPrivacidad: 'Configuración de privacidad',
        configuracion: 'Configuración',
        ayuda: 'Ayuda',
        idioma: 'Idioma',
        preguntasFrecuentes: 'Preguntas frecuentes',
        divisionDeGastos: 'División de gastos',
        menu: 'Menú',
        modoDebug: 'Modo debug',
        legales: 'Legales'
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
        donar: 'Contribute',
        inicio: 'Home',
        miCuenta: 'My account',
        editarPerfilPublico: 'Edit public profile',
        misAutos: 'My cars',
        configuracionNotificaciones: 'Notification settings',
        configuracionPrivacidad: 'Privacy settings',
        configuracion: 'Settings',
        ayuda: 'Help',
        idioma: 'Language',
        preguntasFrecuentes: 'Frequently asked questions',
        divisionDeGastos: 'Trip cost sharing',
        menu: 'Menu',
        modoDebug: 'Debug mode',
        legales: 'Legal'
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
