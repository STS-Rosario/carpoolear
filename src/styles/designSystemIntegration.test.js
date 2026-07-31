import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const mainCssPath = path.resolve(__dirname, 'main.css');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const updateProfilePath = path.resolve(
    __dirname,
    '../components/sections/UpdateProfile.vue'
);
const myAccountNavPath = path.resolve(
    __dirname,
    '../components/sections/MyAccountNav.vue'
);
const myAccountPath = path.resolve(__dirname, '../components/views/MyAccount.vue');
const updateProfileSource = fs.readFileSync(updateProfilePath, 'utf8');
const myAccountNavSource = fs.readFileSync(myAccountNavPath, 'utf8');
const myAccountSource = fs.readFileSync(myAccountPath, 'utf8');

describe('design system integration', () => {
    it('imports design tokens and button styles from main.css', () => {
        expect(mainCss).toContain("design-tokens.css");
        expect(mainCss).toContain('components/app-button.css');
    });

    it('uses primary AppButton for Guardar cambios in profile edit', () => {
        expect(updateProfileSource).toContain('AppButton');
        expect(updateProfileSource).toContain('variant="primary"');
        expect(updateProfileSource).toContain("$t('guardarCambios')");
        expect(updateProfileSource).not.toContain('btn btn-primary btn-donar-header');
    });

    it('uses secondary AppButton for Cerrar sesión in account navigation', () => {
        expect(myAccountNavSource).toContain('AppButton');
        expect(myAccountNavSource).toContain('variant="secondary"');
        expect(myAccountNavSource).toContain("$t('cerrarSesion')");
        expect(myAccountNavSource).not.toContain('account-logout-btn');

        expect(myAccountSource).toContain('AppButton');
        expect(myAccountSource).toContain('variant="secondary"');
        expect(myAccountSource).toContain("$t('cerrarSesion')");
        expect(myAccountSource).not.toContain('account-logout-btn');
    });
});
