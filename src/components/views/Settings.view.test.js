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

    it('uses Mis amigos as the friends page heading title key', () => {
        expect(viewSource).toMatch(
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
});
