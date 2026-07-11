import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const menuDropdownPath = path.resolve(__dirname, 'HeaderMenuDropdown.vue');
const menuDropdownSource = fs.readFileSync(menuDropdownPath, 'utf8');

describe('HeaderMenuDropdown profile menu', () => {
    it('uses a profile avatar trigger instead of the Menu icon label', () => {
        expect(menuDropdownSource).toContain('header-menu-dropdown__profile');
        expect(menuDropdownSource).toContain('header_profile_image');
        expect(menuDropdownSource).toContain('v-imgSrc:profile');
        expect(menuDropdownSource).toContain('fa-chevron-down');
        expect(menuDropdownSource).not.toContain("$t('menu')");
        expect(menuDropdownSource).not.toContain('icon="menu"');
    });

    it('shows profile summary with public profile link at the top', () => {
        expect(menuDropdownSource).toContain('header-menu-dropdown__user');
        expect(menuDropdownSource).toContain('user.name');
        expect(menuDropdownSource).toContain("$t('verPerfilPublico')");
        expect(menuDropdownSource).toMatch(
            /name:\s*'profile'[\s\S]*id:\s*'me'/
        );
        expect(menuDropdownSource).toContain('header-menu-dropdown__online');
        expect(menuDropdownSource).toMatch(
            /header-menu-dropdown__avatar-wrap[\s\S]*header-menu-dropdown__user-info[\s\S]*user\.name[\s\S]*verPerfilPublico/
        );
    });

    it('spaces the profile header and seats the online dot on the avatar edge', () => {
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__user-row\s*\{[^}]*padding:\s*1\.1rem\s+1\.25rem\s+0\.95rem/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__user-row\s*\{[^}]*gap:\s*0\.85rem/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__avatar\s*\{[^}]*width:\s*48px/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__online\s*\{[^}]*right:\s*-2px/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__online\s*\{[^}]*bottom:\s*-1px/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__online\s*\{[^}]*border:\s*2px\s+solid\s+#fff/
        );
        expect(menuDropdownSource).toMatch(
            /\.header-menu-dropdown__avatar-wrap\s*\{[^}]*overflow:\s*visible/
        );
    });

    it('lists Mi cuenta, Configuración, Ayuda and red Cerrar sesión', () => {
        expect(menuDropdownSource).toContain("$t('miCuenta')");
        expect(menuDropdownSource).toContain("$t('configuracion')");
        expect(menuDropdownSource).toContain("$t('ayuda')");
        expect(menuDropdownSource).toContain("$t('cerrarSesion')");
        expect(menuDropdownSource).toContain("name: 'my-account'");
        expect(menuDropdownSource).toContain("name: 'profile_update'");
        expect(menuDropdownSource).toContain("name: 'tickets'");
        expect(menuDropdownSource).toContain('fa-user');
        expect(menuDropdownSource).toContain('fa-cog');
        expect(menuDropdownSource).toContain('fa-headphones');
        expect(menuDropdownSource).toContain('fa-sign-out');
        expect(menuDropdownSource).toContain('header-menu-dropdown__item--logout');
    });

    it('removes the previous full Menu mirror items from the dropdown', () => {
        expect(menuDropdownSource).not.toContain("$t('notificaciones')");
        expect(menuDropdownSource).not.toContain("$t('mensajes')");
        expect(menuDropdownSource).not.toContain("$t('misViajes')");
        expect(menuDropdownSource).not.toContain("$t('footerPreguntasFrecuentes')");
        expect(menuDropdownSource).not.toContain("$t('modoDebug')");
        expect(menuDropdownSource).not.toContain('header-menu-dropdown__locale');
        expect(menuDropdownSource).not.toContain('icon="bell"');
        expect(menuDropdownSource).not.toContain('icon="message"');
    });
});
