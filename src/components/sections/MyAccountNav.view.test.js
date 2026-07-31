import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const navPath = path.resolve(__dirname, 'MyAccountNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('MyAccountNav desktop sidebar', () => {
    it('shows Mi cuenta title and grouped collapsible sections', () => {
        expect(navSource).toContain("$t('miCuenta')");
        expect(navSource).toContain('my-account-nav__title');
        expect(navSource).toContain('getMyAccountDesktopSections');
        expect(navSource).toContain('getMyAccountDesktopExpandedSection');
        expect(navSource).toContain('my-account-nav__section');
        expect(navSource).toContain('my-account-nav__section-toggle');
        expect(navSource).toContain('isSectionExpanded');
    });

    it('highlights the active item and shows only the expanded section items', () => {
        expect(navSource).toContain('isMyAccountDesktopItemActive');
        expect(navSource).toContain('my-account-nav__item--active');
        expect(navSource).toContain('v-show="isSectionExpanded(section.id)"');
    });

    it('renders locale switcher, logout and delete account actions', () => {
        expect(navSource).toContain('localeSwitcher');
        expect(navSource).toContain("setLocale('arg')");
        expect(navSource).toContain('my-account-nav__locale-switch');
        expect(navSource).not.toContain('my-account-nav__item-value');
        expect(navSource).toContain('DESKTOP_DELETE_ACCOUNT_ROUTE');
        expect(navSource).toContain('my-account-nav__delete');
        expect(navSource).toContain('my-account-nav__logout');
        expect(navSource).not.toContain('my-account-nav__item--logout');
    });

    it('tightens collapsed section spacing before the footer actions', () => {
        expect(navSource).toContain('my-account-nav__section--collapsed');
        expect(navSource).toMatch(
            /\.my-account-nav__section--collapsed\s+\.my-account-nav__section-toggle\s*\{[^}]*padding-bottom:\s*0\.45rem/
        );
    });

    it('styles logout as a secondary button with a left sign-out icon', () => {
        expect(navSource).toContain('AppButton');
        expect(navSource).toContain('variant="secondary"');
        expect(navSource).toMatch(
            /my-account-nav__logout[\s\S]*icon-left="fa fa-sign-out"/
        );
        expect(navSource).not.toMatch(
            /\.my-account-nav__logout\s*\{[^}]*border-radius:\s*999px/
        );
        expect(navSource).toMatch(
            /\.my-account-nav__delete\s*\{[^}]*margin-top:\s*2rem/
        );
    });

    it('removes the old flat profile header from the sidebar', () => {
        expect(navSource).not.toContain('my-account-nav__profile');
        expect(navSource).not.toContain('getMyAccountMenuItems');
    });
});
