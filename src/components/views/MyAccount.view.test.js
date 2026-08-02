import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MyAccount.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('MyAccount view', () => {
    it('shows profile summary with ratings stats and trips count', () => {
        expect(viewSource).toContain('my-account__title');
        expect(viewSource).toContain("$t('miCuenta')");
        expect(viewSource).toContain("$t('verPerfilPublico')");
        expect(viewSource).toContain('my-account__profile-link');
        expect(viewSource).toContain('my-account__name');
        expect(viewSource).toMatch(
            /my-account__profile-link[\s\S]*name:\s*'profile'[\s\S]*id:\s*'me'/
        );
        expect(viewSource).toMatch(
            /my-account__name[\s\S]*name:\s*'profile'[\s\S]*id:\s*'me'/
        );
        expect(viewSource).toContain('userRatingsFromProfile');
        expect(viewSource).toContain('my-account__stats');
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain(':ratings="ratings"');
        expect(viewSource).not.toContain('fa-smile-o');
        expect(viewSource).not.toContain('fa-meh-o');
        expect(viewSource).not.toContain('fa-frown-o');
        expect(viewSource).toContain("$t('viajes')");
    });

    it('renders grouped navigation sections from the mobile sections util', () => {
        expect(viewSource).toContain('getMyAccountMobileSections');
        expect(viewSource).toContain('mobileSections');
        expect(viewSource).toContain('my-account__section');
        expect(viewSource).toContain('my-account__section-title');
        expect(viewSource).toContain('$t(section.labelKey)');
    });

    it('passes isAdmin into mobile sections so Administración can appear', () => {
        expect(viewSource).toMatch(
            /getMyAccountMobileSections\(\s*this\.config\s*,\s*\{\s*isAdmin:/
        );
        expect(viewSource).toContain('user.is_admin');
    });

    it('keeps the logout button and a separate delete account action', () => {
        expect(viewSource).toContain('variant="secondary"');
        expect(viewSource).toContain('my-account__logout');
        expect(viewSource).toMatch(/my-account__logout[\s\S]*icon-left="fa fa-sign-out"/);
        expect(viewSource).toContain('my-account__delete');
        expect(viewSource).toContain("$t('cerrarSesion')");
        expect(viewSource).toContain('MOBILE_DELETE_ACCOUNT_ROUTE');
        expect(viewSource).toContain("$t('eliminarCuenta')");
    });

    it('renders the previous Español/English locale switcher for Idioma', () => {
        expect(viewSource).toContain('my-account__locale');
        expect(viewSource).toContain("setLocale('arg')");
        expect(viewSource).toContain("setLocale('en')");
        expect(viewSource).toContain('persistLocaleChoice');
        expect(viewSource).toContain('syncLocaleToBackend');
        expect(viewSource).toContain('localeSwitcher');
    });

    it('centers the layout for desktop widths', () => {
        expect(viewSource).toMatch(/max-width:\s*480px[\s\S]*margin:\s*0 auto/);
    });
});

describe('my account route', () => {
    it('registers /mi-cuenta for authenticated users', () => {
        expect(routesSource).toContain("path: '/mi-cuenta'");
        expect(routesSource).toContain("name: 'my-account'");
        expect(routesSource).toContain('MyAccount');
        expect(routesSource).toMatch(
            /my-account[\s\S]*active_id:\s*'profile'/
        );
    });
});
