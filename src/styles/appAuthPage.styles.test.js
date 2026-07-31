import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const authPageCssPath = path.resolve(__dirname, 'components/app-auth-page.css');
const tokensPath = path.resolve(__dirname, 'design-tokens.css');
const mainCssPath = path.resolve(__dirname, 'main.css');

const authPageCss = fs.readFileSync(authPageCssPath, 'utf8');
const tokensCss = fs.readFileSync(tokensPath, 'utf8');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');

describe('app auth page styles', () => {
    it('defines auth page background and card tokens', () => {
        expect(tokensCss).toContain('--ds-auth-page-bg: #F4F3F1');
        expect(tokensCss).toContain('--ds-auth-card-bg: #FFFFFF');
        expect(tokensCss).toContain('--ds-auth-card-radius: 20px');
        expect(tokensCss).toContain('--ds-auth-card-shadow:');
        expect(tokensCss).toContain('--ds-auth-card-max-width: 1200px');
        expect(tokensCss).toContain('--ds-auth-column-gap:');
    });

    it('imports auth page styles after base.css so login overrides win', () => {
        const baseIndex = mainCss.indexOf("./base.css");
        const authIndex = mainCss.indexOf("./components/app-auth-page.css");
        expect(baseIndex).toBeGreaterThan(-1);
        expect(authIndex).toBeGreaterThan(baseIndex);
    });

    it('styles the auth page shell and card on desktop', () => {
        expect(authPageCss).toContain('.app-auth-page__card');
        expect(authPageCss).toMatch(
            /\.app-auth-page__card\s*\{[^}]*background:\s*var\(--ds-auth-card-bg\)/
        );
        expect(authPageCss).toMatch(
            /\.app-auth-page__card\s*\{[^}]*border-radius:\s*var\(--ds-auth-card-radius\)/
        );
        expect(authPageCss).toMatch(
            /\.app-auth-page__card\s*\{[^}]*box-shadow:\s*var\(--ds-auth-card-shadow\)/
        );
        expect(authPageCss).toContain('var(--ds-auth-page-bg)');
        expect(authPageCss).not.toMatch(
            /\.app-auth-page \.login-box\s*\{[^}]*width:\s*100%/
        );
        expect(authPageCss).toMatch(
            /\.app-container\.blue\.login \.app-auth-page \.user-form \.form\s*\{[^}]*box-shadow:\s*none/
        );
        expect(authPageCss).toMatch(
            /\.app-auth-page \.login-box\s*\{[^}]*border-right:/
        );
        expect(authPageCss).toMatch(
            /\.login-form__aside\s*\{[^}]*justify-content:\s*center/
        );
        expect(authPageCss).toContain('var(--ds-auth-column-gap)');
        expect(authPageCss).toMatch(
            /\.app-auth-page \.app-page-title[\s\S]*margin-left:\s*0/
        );
    });

    it('imports auth page styles from main.css', () => {
        expect(mainCss).toContain('./components/app-auth-page.css');
    });
});
