import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'Settings.vue');
const layoutPath = path.join(__dirname, '../layouts/AccountSettingsLayout.vue');
const navPath = path.join(__dirname, '../sections/MyAccountNav.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('Settings navigation', () => {
    it('uses the shared account settings layout with desktop nav', () => {
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(layoutSource).toContain('MyAccountNav');
        expect(layoutSource).toContain('effectiveShowNav');
    });

    it('renders grouped desktop sidebar navigation', () => {
        expect(navSource).toContain('my-account-nav__title');
        expect(navSource).toContain('getMyAccountDesktopSections');
        expect(navSource).toContain('my-account-nav__section-toggle');
    });

    it('renders logout as a secondary button with a left sign-out icon', () => {
        expect(navSource).toContain('AppButton');
        expect(navSource).toContain('variant="secondary"');
        expect(navSource).toContain('my-account-nav__logout');
        expect(navSource).toMatch(/my-account-nav__logout[\s\S]*icon-left="fa fa-sign-out"/);
        expect(navSource).not.toContain('my-account-nav__item--logout');
    });

    it('does not render a layout page title for Mis amigos so the in-card heading is used', () => {
        expect(viewSource).not.toMatch(
            /friends_setting['"]?\s*\)\s*return\s*['"]misAmigos['"]/
        );
        const routesSource = fs.readFileSync(
            path.join(__dirname, '../../router/routes.js'),
            'utf8'
        );
        expect(routesSource).toMatch(
            /name:\s*'friends_setting'[\s\S]*?titleKey:\s*'misAmigos'/
        );
    });

    it('does not render a layout page title for Verificación de cuenta so the in-card heading is used', () => {
        expect(viewSource).not.toMatch(
            /identity_validation['"]?\s*\)\s*return\s*['"]validarIdentidad['"]/
        );
    });

    it('does not render a layout page title for Cambiar contraseña so the in-card heading is used', () => {
        expect(viewSource).not.toMatch(
            /profile_password['"]?\s*\)\s*return\s*['"]cambiarPassword['"]/
        );
    });

    it('does not render a layout page title for Autos so the in-card heading is used', () => {
        expect(viewSource).not.toMatch(
            /profile_cars['"]?\s*\)\s*return\s*['"]autos['"]/
        );
    });
});
