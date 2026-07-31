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
    it('defines header create, outline, and donate tokens', () => {
        expect(tokensCss).toContain('--ds-header-create-bg:');
        expect(tokensCss).toContain('--ds-header-create-text:');
        expect(tokensCss).toContain('--ds-header-outline-border:');
        expect(tokensCss).toContain('--ds-header-outline-text:');
        expect(tokensCss).toContain('--ds-header-donate-bg:');
        expect(tokensCss).toContain('--ds-header-donate-border:');
    });

    it('defines desktop header vertical padding token', () => {
        expect(tokensCss).toContain('--ds-header-desktop-padding-y: 1rem');
    });

    it('styles header create, outline, and donate button variants', () => {
        expect(buttonCss).toContain('.app-button--header-create');
        expect(buttonCss).toContain('.app-button--header-outline');
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
        expect(headerSource).toContain('variant="header-outline"');
        expect(headerSource).not.toContain('background_desktop');
        expect(headerSource).not.toContain("{{ $t('ingresar') }}");
        expect(headerSource).toContain('gift.svg');
    });

    it('shows signed-out desktop auth buttons matching header create and outline styles', () => {
        expect(headerSource).toMatch(
            /v-if="!logged"[\s\S]*variant="header-create"[\s\S]*\$t\('iniciarSesion'\)/
        );
        expect(headerSource).toMatch(
            /v-if="!logged"[\s\S]*variant="header-outline"[\s\S]*\$t\('RegistrarNuevoUsuario'\)/
        );
        expect(headerSource).toMatch(
            /variant="header-outline"[\s\S]*:to="\{ name: 'register' \}"/
        );
    });

    it('adds vertical padding to the desktop header content row', () => {
        expect(headerSource).toMatch(
            /\.header_content\s*\{[^}]*padding-top:\s*var\(--ds-header-desktop-padding-y\)/
        );
        expect(headerSource).toMatch(
            /\.header_content\s*\{[^}]*padding-bottom:\s*var\(--ds-header-desktop-padding-y\)/
        );
    });

    it('shows a simplified mobile header with logo and Doná when the logo is visible', () => {
        const headerMobileCss = fs.readFileSync(
            path.resolve(__dirname, 'components/header-mobile.css'),
            'utf8'
        );
        expect(headerSource).toContain('mobile-header-bar--branded');
        expect(headerSource).toContain('showBrandedMobileHeader');
        expect(headerSource).toContain("'login'");
        expect(headerMobileCss).toContain(
            '.mobile-header-bar--branded.visible-xs'
        );
        expect(headerMobileCss).toMatch(
            /\.mobile-header-bar--branded\.visible-xs\s*\{[^}]*display:\s*flex !important/
        );
        expect(headerMobileCss).toContain('var(--ds-header-mobile-padding-x)');
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*header_logo/
        );
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*v-if="!logged"[\s\S]*variant="header-create"/
        );
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*variant="header-donate"/
        );
    });
});
