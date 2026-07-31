import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const buttonCssPath = path.resolve(__dirname, 'components/app-button.css');
const buttonCss = fs.readFileSync(buttonCssPath, 'utf8');
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

describe('account logout secondary button', () => {
    it('defines secondary button styles from design tokens', () => {
        expect(buttonCss).toContain('.app-button--secondary');
        expect(buttonCss).toMatch(
            /\.app-button--secondary\s*\{[^}]*border-color:\s*var\(--ds-action-border\)/
        );
        expect(buttonCss).toMatch(
            /\.app-button--secondary:hover:not\(:disabled\):not\(\[aria-disabled='true'\]\)\s*\{[^}]*background:\s*var\(--ds-action-bg\)/
        );
    });

    it('uses secondary AppButton with a left sign-out icon on mobile Mi cuenta', () => {
        expect(myAccountSource).toContain('AppButton');
        expect(myAccountSource).toContain('variant="secondary"');
        expect(myAccountSource).toMatch(
            /class="[^"]*my-account__logout/
        );
        expect(myAccountSource).toMatch(
            /my-account__logout[\s\S]*icon-left="fa fa-sign-out"/
        );
    });

    it('uses secondary AppButton with a left sign-out icon on desktop Mi cuenta nav', () => {
        expect(navSource).toContain('AppButton');
        expect(navSource).toContain('variant="secondary"');
        expect(navSource).toMatch(
            /class="[^"]*my-account-nav__logout/
        );
        expect(navSource).toMatch(
            /my-account-nav__logout[\s\S]*icon-left="fa fa-sign-out"/
        );
    });
});
