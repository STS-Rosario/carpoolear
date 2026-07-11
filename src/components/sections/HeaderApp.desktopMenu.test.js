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

    it('puts logo and Doná on the left desktop zone', () => {
        const left = headerSource.match(
            /header_panel-left[\s\S]*?header_panel-center/
        )[0];
        expect(left).toContain('app_logo');
        expect(left).toContain('btn-donar-header');
        expect(left).toContain("$t('donar')");
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
        expect(center).toContain('messagesCount');
        expect(headerSource).toContain("messagesCount: 'messagesCount'");
    });

    it('puts Crear viaje, notifications and profile dropdown on the right', () => {
        const right = headerSource.match(
            /header_panel-right[\s\S]*?<\/div>\s*<div class="cf">/
        )[0];
        expect(right).toContain('btn-create-trip');
        expect(right).toContain("$t('crearViaje')");
        expect(right).toContain('header_notifications');
        expect(right).toContain('icon="bell"');
        expect(right).toContain('<header-menu-dropdown');
        expect(right).not.toContain('btn-donar-header');
        expect(right).not.toContain("$t('inicio')");
        expect(right).not.toContain("$t('mensajes')");
    });

    it('removes social links from the desktop header', () => {
        expect(headerSource).not.toContain('header-social-links');
        expect(headerSource).not.toContain('instagram_logo');
        expect(headerSource).not.toContain('facebook_logo');
    });
});
