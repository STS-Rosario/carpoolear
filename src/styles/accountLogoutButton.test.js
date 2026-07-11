import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const myAccountPath = path.resolve(
    __dirname,
    '../components/views/MyAccount.vue'
);
const navPath = path.resolve(
    __dirname,
    '../components/sections/MyAccountNav.vue'
);
const myAccountSource = fs.readFileSync(myAccountPath, 'utf8');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('account logout outline button', () => {
    it('defines shared outline styles in base.css', () => {
        expect(baseCss).toContain('.account-logout-btn {');
        expect(baseCss).toMatch(
            /\.account-logout-btn\s*\{[^}]*border-radius:\s*12px/
        );
        expect(baseCss).toMatch(
            /\.account-logout-btn:hover\s*\{[^}]*background:\s*#eef4fb/
        );
        expect(baseCss).toMatch(
            /\.account-logout-btn:focus\s*\{[^}]*box-shadow:/
        );
        expect(baseCss).not.toMatch(
            /\.account-logout-btn:hover\s*\{[^}]*background:\s*#00a3e0/
        );
    });

    it('uses the shared class with a left sign-out icon on mobile Mi cuenta', () => {
        expect(myAccountSource).toContain('account-logout-btn');
        expect(myAccountSource).toMatch(
            /class="[^"]*account-logout-btn[^"]*my-account__logout/
        );
        expect(myAccountSource).toMatch(
            /my-account__logout[\s\S]*fa-sign-out/
        );
    });

    it('uses the shared class with a left sign-out icon on desktop Mi cuenta nav', () => {
        expect(navSource).toContain('account-logout-btn');
        expect(navSource).toMatch(
            /class="[^"]*account-logout-btn[^"]*my-account-nav__logout/
        );
        expect(navSource).toMatch(
            /my-account-nav__logout[\s\S]*fa-sign-out/
        );
    });
});
