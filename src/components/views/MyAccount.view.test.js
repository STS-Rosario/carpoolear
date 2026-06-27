import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MyAccount.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('MyAccount view', () => {
    it('shows profile summary and account settings menu items', () => {
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
        expect(viewSource).toContain('getMyAccountMenuItems');
        expect(viewSource).toContain('menuItems');
        expect(viewSource).toContain("$t('cerrarSesion')");
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
