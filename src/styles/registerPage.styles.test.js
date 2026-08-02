import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const registerCssPath = path.resolve(__dirname, 'components/register-page.css');
const mainCssPath = path.resolve(__dirname, 'main.css');
const registerViewPath = path.resolve(__dirname, '../components/views/Register.vue');

const registerCss = fs.readFileSync(registerCssPath, 'utf8');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const registerSource = fs.readFileSync(registerViewPath, 'utf8');

describe('register page styles', () => {
    it('uses sentence case for terms label and dark blue link', () => {
        expect(registerCss).toContain('.user-form--register .register-form__terms-label');
        expect(registerCss).toContain('text-transform: none');
        expect(registerCss).toContain('.user-form--register .register-form__terms-link');
        expect(registerCss).toContain('var(--ds-link)');
        expect(registerCss).toContain('text-decoration: underline');
        expect(registerCss).toMatch(
            /\.user-form--register \.register-form__terms-row input\[type='checkbox'\][\s\S]*margin:\s*0\.2rem 0 0 5px/
        );
    });

    it('uses a white mobile register background without the blue gradient', () => {
        expect(registerCss).toMatch(
            /@media \(max-width: 767px\)[\s\S]*\.app-container\.blue\.register[\s\S]*background:\s*#ffffff/
        );
        expect(registerCss).toContain('background-image: none');
    });

    it('imports register page styles from main.css', () => {
        expect(mainCss).toContain("./components/register-page.css");
    });
});

describe('Register page redesign integration', () => {
    it('wraps register content in the reusable auth page shell', () => {
        expect(registerSource).toContain('AppAuthPage');
        expect(registerSource).not.toMatch(
            /<router-link[^>]*v-if="!isMobile"[^>]*:to="\{ name: 'trips' \}"/
        );
        expect(registerSource).not.toContain('carpoolear_logo');
    });

    it('shows the page title inside the card and uses a primary submit button', () => {
        expect(registerSource).toContain('user-form--register');
        expect(registerSource).toContain('AppPageTitle');
        expect(registerSource).toContain('register-form__terms-label');
        expect(registerSource).toContain('register-form__terms-link');
        expect(registerSource).toContain('variant="primary"');
        expect(registerSource).toContain(":label=\"$t('registrarme')\"");
        expect(registerSource).toContain('class="register-form__submit g-recaptcha"');
    });

    it('uses primary AppButton for email entry and keeps Facebook brand styling', () => {
        expect(registerSource).toMatch(
            /<AppButton[\s\S]*?id="btn_show_register"[\s\S]*?variant="primary"[\s\S]*?onShowRegister[\s\S]*?ingresaEmail/
        );
        expect(registerSource).toMatch(
            /btn_show_register[\s\S]*?iconLeft|btn_show_register[\s\S]*?fa-envelope/
        );
        expect(registerSource).not.toMatch(
            /class="btn btn-primary btn-shadowed-black btn-with-icon btn-email"/
        );
        expect(registerSource).toMatch(
            /class="[^"]*btn-facebook[^"]*btn-with-icon[^"]*"/
        );
        expect(registerSource).toMatch(
            /facebookLogin[\s\S]*?Facebook|btn-facebook[\s\S]*?facebookLogin/
        );
        expect(registerSource).not.toMatch(
            /class="btn btn-primary btn-search btn-facebook btn-with-icon"/
        );
    });
});
