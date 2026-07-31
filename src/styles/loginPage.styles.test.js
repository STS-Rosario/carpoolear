import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const loginCssPath = path.resolve(__dirname, 'components/login-page.css');
const pageTitleCssPath = path.resolve(__dirname, 'components/app-page-title.css');
const infoCardCssPath = path.resolve(__dirname, 'components/app-info-card.css');
const tokensPath = path.resolve(__dirname, 'design-tokens.css');
const mainCssPath = path.resolve(__dirname, 'main.css');
const loginViewPath = path.resolve(__dirname, '../components/views/Login.vue');

const loginCss = fs.readFileSync(loginCssPath, 'utf8');
const pageTitleCss = fs.readFileSync(pageTitleCssPath, 'utf8');
const infoCardCss = fs.readFileSync(infoCardCssPath, 'utf8');
const tokensCss = fs.readFileSync(tokensPath, 'utf8');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const loginSource = fs.readFileSync(loginViewPath, 'utf8');

describe('login page styles', () => {
    it('uses a white mobile login background and dark blue links', () => {
        expect(loginCss).toContain('.app-container.blue.login');
        expect(loginCss).toContain('background: #ffffff');
        expect(loginCss).toContain('.login-form__link');
        expect(loginCss).toContain('color: var(--ds-link)');
        expect(loginCss).toContain('text-decoration: underline');
        expect(loginCss).toContain('padding-left: 5px');
    });

    it('imports login page styles from main.css', () => {
        expect(mainCss).toContain("./components/login-page.css");
        expect(mainCss).toContain("./components/app-page-title.css");
        expect(mainCss).toContain("./components/app-info-card.css");
    });

    it('defines page title and login typography tokens', () => {
        expect(tokensCss).toContain('--ds-page-title-size:');
        expect(tokensCss).toContain('--ds-font-size-base: 1rem');
        expect(tokensCss).toContain('--ds-input-label-line-height: 1rem');
        expect(tokensCss).toContain('--ds-info-card-font-size: 1rem');
        expect(tokensCss).toContain('--ds-info-card-line-height: 1.125rem');
        expect(tokensCss).toContain('--ds-info-card-icon-size:');
        expect(pageTitleCss).toContain('var(--ds-page-title-size)');
        expect(infoCardCss).toContain('var(--ds-info-bg)');
        expect(infoCardCss).toContain('var(--ds-text-primary)');
        expect(infoCardCss).toContain('.blue .app-info-card');
        expect(infoCardCss).toContain('var(--ds-info-card-font-size)');
        expect(infoCardCss).toContain('align-items: center');
        expect(infoCardCss).toContain('var(--ds-info-card-padding-x)');
        expect(infoCardCss).toContain('.app-info-card__body');
        expect(infoCardCss).toMatch(/\.app-info-card__body\s*\{[^}]*gap:\s*0/);
    });
});

describe('Login mobile redesign integration', () => {
    it('uses page title, primary submit, info card, and legacy modal trigger', () => {
        expect(loginSource).toContain('user-form--login-mobile');
        expect(loginSource).toContain('AppPageTitle');
        expect(loginSource).toContain('AppInfoCard');
        expect(loginSource).toContain('variant="primary"');
        expect(loginSource).toContain(":label=\"$t('iniciarSesion')\"");
        expect(loginSource).toContain('openLegacyLoginModal');
        expect(loginSource).toContain('v-html="$t(\'loginLegacyProvidersQuestion\')"');
    });
});
