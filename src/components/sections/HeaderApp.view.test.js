import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'HeaderApp.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('HeaderApp mesa de ayuda link', () => {
    it('includes soporte i18n with router-link to tickets for desktop and mobile dropdowns', () => {
        expect(viewSource).toContain("$t('soporte')");
        const ticketRouteMatches = viewSource.match(/name:\s*'tickets'/g);
        expect(ticketRouteMatches).not.toBeNull();
        expect(ticketRouteMatches.length).toBeGreaterThanOrEqual(2);
    });

    it('lists soporte link after perfil in the desktop profile dropdown', () => {
        const marker = '<div class="header_profile" v-if="user">';
        const start = viewSource.indexOf(marker);
        expect(start).toBeGreaterThan(-1);
        const rest = viewSource.slice(start);
        const closeDropdown = '</dropdown>';
        const endRel = rest.indexOf(closeDropdown);
        expect(endRel).toBeGreaterThan(-1);
        const desktopMenu = rest.slice(0, endRel);
        const perfilPos = desktopMenu.indexOf("$t('perfil')");
        const ticketsPos = desktopMenu.indexOf("name: 'tickets'");
        expect(perfilPos).toBeGreaterThan(-1);
        expect(ticketsPos).toBeGreaterThan(perfilPos);
    });

    it('lists soporte link after perfil in the mobile ellipsis dropdown', () => {
        const marker = '<div class="dropdown-right" v-if="showMenu || isMobile">';
        const start = viewSource.indexOf(marker);
        expect(start).toBeGreaterThan(-1);
        const rest = viewSource.slice(start);
        const endRel = rest.indexOf('</dropdown>');
        expect(endRel).toBeGreaterThan(-1);
        const mobileMenu = rest.slice(0, endRel);
        const perfilPos = mobileMenu.indexOf("$t('perfil')");
        const ticketsPos = mobileMenu.indexOf("name: 'tickets'");
        expect(perfilPos).toBeGreaterThan(-1);
        expect(ticketsPos).toBeGreaterThan(perfilPos);
    });
});
