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
    it('uses a white mobile login background and shared login field styles', () => {
        expect(loginCss).toContain('.app-container.blue.login');
        expect(loginCss).toContain('background: #ffffff');
        expect(loginCss).toContain('.user-form--login .login-form__link');
        expect(loginCss).toContain('.user-form--login .login-form__forgot');
        expect(loginCss).toContain('.user-form--login .login-form__remember');
        expect(loginCss).toContain('var(--ds-text-primary)');
        expect(loginCss).toMatch(
            /\.app-container\.blue\.login \.user-form--login \.login-form__remember label[\s\S]*var\(--ds-text-primary\)/
        );
        expect(loginCss).toContain('var(--ds-link-font-weight)');
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
        expect(tokensCss).toContain('--ds-input-label-size: 1rem');
        expect(tokensCss).toContain('--ds-input-label-line-height: 1.125rem');
        expect(tokensCss).toContain('--ds-info-card-font-size: 1rem');
        expect(tokensCss).toContain('--ds-info-card-line-height: 1.125rem');
        expect(tokensCss).toContain('--ds-register-prompt-font-size: 1.125rem');
        expect(tokensCss).toContain('--ds-register-prompt-line-height: 1.25rem');
        expect(loginCss).toContain('var(--ds-register-prompt-font-size)');
        expect(loginCss).toMatch(
            /\.login-form__register-prompt \.login-form__link[\s\S]*var\(--ds-font-weight-bold\)/
        );
        expect(pageTitleCss).toContain('var(--ds-page-title-size)');
        expect(infoCardCss).toContain('var(--ds-info-bg)');
        expect(infoCardCss).toContain('var(--ds-text-primary)');
        expect(infoCardCss).toContain('.blue .app-info-card');
        expect(infoCardCss).toContain('var(--ds-info-card-font-size)');
        expect(infoCardCss).toContain('align-items: center');
        expect(infoCardCss).toContain('var(--ds-info-card-padding-x)');
        expect(infoCardCss).toContain('var(--ds-info-card-padding-y)');
        expect(tokensCss).toContain('--ds-info-card-padding-y: 2rem');
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

    it('wraps login content in the reusable auth page shell', () => {
        expect(loginSource).toContain('AppAuthPage');
        expect(loginSource).not.toMatch(
            /<router-link[^>]*v-if="isDesktop"[^>]*:to="\{ name: 'trips' \}"/
        );
    });

    it('uses the mobile-style forgot and remember fields on desktop', () => {
        expect(loginSource).toContain("$t('olvideContraMobile')");
        expect(loginSource).toContain("$t('recordarMiCuenta')");
        expect(loginSource).not.toContain("$t('recordarme')");
        expect(loginSource).not.toContain("$t('olvideContra')");
        expect(loginSource).not.toContain('visual-trick');
        expect(loginSource).not.toContain('facebook-box');
        expect(loginSource).not.toContain('pass-options');
    });

    it('shows the legacy providers info card in the desktop aside column', () => {
        expect(loginSource).toMatch(
            /v-if="isDesktop"[\s\S]*login-form__aside[\s\S]*AppInfoCard/
        );
        expect(loginSource).toMatch(
            /login-form__aside[\s\S]*openLegacyLoginModal/
        );
    });
});
