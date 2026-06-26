import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, '../views/MobileMenu.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');

describe('MobileMenu view', () => {
    it('exists as a full-screen menu without user avatar or name', () => {
        const source = fs.readFileSync(viewPath, 'utf8');
        expect(source).toContain('mobile-menu');
        expect(source).toContain("$t('menu')");
        expect(source).not.toContain('v-imgSrc');
        expect(source).not.toContain('user.name');
        expect(source).not.toContain('user.image');
    });

    it('lists primary navigation items with badges', () => {
        const source = fs.readFileSync(viewPath, 'utf8');
        expect(source).toContain("$t('notificaciones')");
        expect(source).toContain("$t('mensajes')");
        expect(source).toContain("$t('misViajes')");
        expect(source).toContain("$t('miCuenta')");
        expect(source).toContain('notificationsCount');
        expect(source).toContain('messagesCount');
        expect(source).toContain('myTripsBadgeCount');
        expect(source).toContain('icon="my-trips"');
        expect(source).toContain('icon="account"');
        expect(source).toContain("name: 'my-account'");
        expect(source).toContain("svg[fill='none']");
    });

    it('includes support, about, legal, debug, locale, and logout actions', () => {
        const source = fs.readFileSync(viewPath, 'utf8');
        expect(source).toContain("$t('footerPreguntasFrecuentes')");
        expect(source).toContain("$t('soporte')");
        expect(source).toContain("$t('modoDebug')");
        expect(source).toContain("$t('acercaDe')");
        expect(source).toContain("$t('legales')");
        expect(source).toContain("$t('cerrarSesion')");
        expect(source).toContain("setLocale('arg')");
        expect(source).toContain("setLocale('en')");
    });

    it('closes via the actionbars store so it returns to the previous screen', () => {
        const source = fs.readFileSync(viewPath, 'utf8');
        expect(source).toContain('closeMobileMenu');
        expect(source).toContain('@click="closeMenu"');
    });
});

describe('mobile menu route', () => {
    it('registers a full-screen mobile menu route', () => {
        const routesSource = fs.readFileSync(routesPath, 'utf8');
        expect(routesSource).toContain("name: 'mobile-menu'");
        expect(routesSource).toContain('MobileMenu');
        expect(routesSource).toMatch(/active_id:\s*'menu'/);
    });
});
