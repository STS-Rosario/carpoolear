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

    it('renders logout as a nav item with a sign-out icon', () => {
        expect(navSource).toContain('my-account-nav__item--logout');
        expect(navSource).toContain('fa-sign-out');
        expect(navSource).not.toContain('my-account-nav__logout');
    });
});
