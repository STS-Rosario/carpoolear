import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const menuDropdownPath = path.resolve(__dirname, 'HeaderMenuDropdown.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');
const menuDropdownSource = fs.readFileSync(menuDropdownPath, 'utf8');

describe('HeaderApp desktop menu', () => {
    it('removes Viajes link from desktop header', () => {
        expect(headerSource).not.toContain('trips-link');
        expect(headerSource).not.toMatch(
            /header_panel-right[\s\S]*\$t\('viajes'\)/
        );
    });

    it('shows menu icon dropdown after crear viaje on desktop', () => {
        expect(headerSource).toMatch(
            /btn-create-trip[\s\S]*<header-menu-dropdown \/>/
        );
        expect(menuDropdownSource).toContain('icon="menu"');
        expect(menuDropdownSource).toContain('size="26"');
        expect(menuDropdownSource).toContain("header-menu-dropdown__label");
        expect(menuDropdownSource).toContain("$t('menu')");
    });

    it('profile link shows avatar left of name without dropdown', () => {
        expect(headerSource).toContain('header_profile_link');
        expect(headerSource).toContain('header_profile_name');
        expect(headerSource).not.toMatch(
            /header_profile[\s\S]*dropdown type="info"/
        );
    });

    it('dropdown mirrors mobile menu items', () => {
        expect(menuDropdownSource).toContain("$t('notificaciones')");
        expect(menuDropdownSource).toContain("$t('mensajes')");
        expect(menuDropdownSource).toContain("$t('misViajes')");
        expect(menuDropdownSource).toContain("$t('miCuenta')");
        expect(menuDropdownSource).toContain("$t('footerPreguntasFrecuentes')");
        expect(menuDropdownSource).toContain("$t('soporte')");
        expect(menuDropdownSource).toContain("$t('modoDebug')");
        expect(menuDropdownSource).toContain("$t('acercaDe')");
        expect(menuDropdownSource).toContain("$t('legales')");
        expect(menuDropdownSource).toContain("$t('cerrarSesion')");
        expect(menuDropdownSource).toContain("setLocale('arg')");
        expect(menuDropdownSource).toContain("setLocale('en')");
        expect(menuDropdownSource).toContain('header-menu-dropdown__locale-inner');
        expect(menuDropdownSource).toMatch(
            /right:\s*0[\s\S]*left:\s*auto/
        );
    });
});
