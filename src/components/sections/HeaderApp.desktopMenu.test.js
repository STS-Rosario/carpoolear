import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('HeaderApp desktop menu', () => {
    it('lays out the desktop header in three zones: left, center, and right', () => {
        expect(headerSource).toContain('header_panel-left');
        expect(headerSource).toContain('header_panel-center');
        expect(headerSource).toContain('header_panel-right');
        expect(headerSource).toMatch(
            /header_panel-left[\s\S]*header_panel-center[\s\S]*header_panel-right/
        );
    });

    it('puts logo2 and Doná on the left desktop zone', () => {
        const left = headerSource.match(
            /header_panel-left[\s\S]*?header_panel-center/
        )[0];
        expect(left).toContain('header_logo');
        expect(left).toContain('variant="header-donate"');
        expect(left).toContain("$t('donar')");
        expect(left).toContain('gift_icon');
    });

    it('shows Doná on desktop when donation is allowed', () => {
        const donate = headerSource.match(
            /variant="header-donate"[\s\S]*?gift\.svg/
        )[0];
        expect(donate).toContain('shouldHideDonationOnIOSCapacitor');
        expect(donate).not.toContain('!isNotLargeDesktop');
    });

    it('puts Inicio, Mis viajes and Mensajes with unread badge in the center', () => {
        const center = headerSource.match(
            /header_panel-center[\s\S]*?header_panel-right/
        )[0];
        expect(center).toContain("$t('inicio')");
        expect(center).toContain("$t('misViajes')");
        expect(center).toContain("$t('mensajes')");
        expect(center).toContain("name: 'trips'");
        expect(center).toContain("name: 'my-trips'");
        expect(center).toContain("name: 'conversations-list'");
        expect(center).toContain('header_nav-messages');
        expect(center).toContain('header_nav-my-trips');
        expect(center).toContain('messagesCount');
        expect(center).toContain('myTripsCount');
        expect(center).toContain('v-if="messagesCount > 0"');
        expect(center).toContain('v-if="myTripsCount > 0"');
        expect(headerSource).toContain("messagesCount: 'messagesCount'");
        expect(headerSource).toContain("myTripsCount: 'myTripsCount'");
    });

    it('underlines the nav link for the current page section', () => {
        const center = headerSource.match(
            /header_panel-center[\s\S]*?header_panel-right/
        )[0];
        expect(center).toContain("isDesktopNavActive('trips')");
        expect(center).toContain("isDesktopNavActive('my-trips')");
        expect(center).toContain("isDesktopNavActive('conversations')");
        expect(headerSource).toMatch(
            /isDesktopNavActive\s*\(\s*section\s*\)\s*\{/
        );
    });

    it('removes the focus outline from desktop nav links', () => {
    });

    it('puts Crear viaje, notifications and profile dropdown on the right', () => {
        expect(headerSource).toContain('header_panel-right');
        expect(headerSource).toContain('btn-create-trip');
        expect(headerSource).toContain('variant="header-create"');
        expect(headerSource).toContain("$t('crearViaje')");
        expect(headerSource).toContain('header_notifications');
        expect(headerSource).toContain('icon="bell"');
        expect(headerSource).toContain('<header-menu-dropdown');
        const rightStart = headerSource.indexOf('header_panel-right');
        const rightChunk = headerSource.slice(rightStart, rightStart + 1200);
        expect(rightChunk).not.toContain('variant="header-donate"');
        expect(rightChunk).not.toContain("$t('mensajes')");
    });

    it('removes social links from the desktop header', () => {
        expect(headerSource).not.toContain('header-social-links');
        expect(headerSource).not.toContain('instagram_logo');
        expect(headerSource).not.toContain('facebook_logo');
    });

});
