import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const buttonCssPath = path.resolve(__dirname, 'components/app-button.css');
const tokensPath = path.resolve(__dirname, 'design-tokens.css');
const buttonCss = fs.readFileSync(buttonCssPath, 'utf8');
const tokensCss = fs.readFileSync(tokensPath, 'utf8');
const headerPath = path.resolve(
    __dirname,
    '../components/sections/HeaderApp.vue'
);
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('header button variants', () => {
    it('defines header create and donate tokens', () => {
        expect(tokensCss).toContain('--ds-header-create-bg:');
        expect(tokensCss).toContain('--ds-header-create-text:');
        expect(tokensCss).toContain('--ds-header-donate-bg:');
        expect(tokensCss).toContain('--ds-header-donate-border:');
    });

    it('styles header create and donate button variants', () => {
        expect(buttonCss).toContain('.app-button--header-create');
        expect(buttonCss).toContain('.app-button--header-donate');
        expect(buttonCss).toMatch(
            /\.app-button--header-create\s*\{[^}]*background:\s*var\(--ds-header-create-bg\)/
        );
        expect(buttonCss).toMatch(
            /\.app-button--header-donate\s*\{[^}]*background:\s*var\(--ds-header-donate-bg\)/
        );
    });
});

describe('HeaderApp header buttons and branding', () => {
    it('uses logo2.svg and AppButton header variants in the desktop header', () => {
        expect(headerSource).toContain('logo2.svg');
        expect(headerSource).toContain('variant="header-donate"');
        expect(headerSource).toContain('variant="header-create"');
        expect(headerSource).not.toContain('background_desktop');
        expect(headerSource).toContain('gift.svg');
    });

    it('shows a simplified mobile header with logo and Doná when the logo is visible', () => {
        expect(headerSource).toContain('mobile-header-bar--branded');
        expect(headerSource).toContain('showBrandedMobileHeader');
        expect(headerSource).toContain("'login'");
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*header_logo/
        );
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*variant="header-donate"/
        );
    });
});
