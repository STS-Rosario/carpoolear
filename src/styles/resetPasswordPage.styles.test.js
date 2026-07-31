import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const resetPasswordCssPath = path.resolve(
    __dirname,
    'components/reset-password-page.css'
);
const mainCssPath = path.resolve(__dirname, 'main.css');
const resetPasswordViewPath = path.resolve(
    __dirname,
    '../components/views/ResetPassword.vue'
);

const resetPasswordCss = fs.readFileSync(resetPasswordCssPath, 'utf8');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');
const resetPasswordSource = fs.readFileSync(resetPasswordViewPath, 'utf8');

describe('reset password page styles', () => {
    it('uses dark text for the success message and primary submit spacing', () => {
        expect(resetPasswordCss).toContain('.reset-form__success-message');
        expect(resetPasswordCss).toContain('var(--ds-text-primary)');
        expect(resetPasswordCss).toContain('.reset-form__submit');
    });

    it('relies on shared auth field max width for inputs and buttons', () => {
        const authPageCssPath = path.resolve(__dirname, 'components/app-auth-page.css');
        const authPageCss = fs.readFileSync(authPageCssPath, 'utf8');
        expect(authPageCss).toContain('var(--ds-auth-field-max-width)');
    });

    it('uses a white mobile reset-password background without the blue gradient', () => {
        expect(resetPasswordCss).toMatch(
            /@media \(max-width: 767px\)[\s\S]*\.app-container\.blue\.reset-password[\s\S]*background:\s*#ffffff/
        );
        expect(resetPasswordCss).toContain('background-image: none');
    });

    it('imports reset password page styles from main.css', () => {
        expect(mainCss).toContain('./components/reset-password-page.css');
    });
});

describe('Reset password page redesign integration', () => {
    it('wraps content in the reusable auth page shell', () => {
        expect(resetPasswordSource).toContain('AppAuthPage');
        expect(resetPasswordSource).not.toMatch(
            /<router-link[^>]*v-if="!isMobile"[^>]*:to="\{ name: 'trips' \}"/
        );
        expect(resetPasswordSource).not.toContain('carpoolear_logo');
    });

    it('shows the page title inside the card with AppInput and primary submit', () => {
        expect(resetPasswordSource).toContain('user-form--reset-password');
        expect(resetPasswordSource).toContain('AppPageTitle');
        expect(resetPasswordSource).toContain('AppInput');
        expect(resetPasswordSource).toContain('variant="primary"');
        expect(resetPasswordSource).toContain(":label=\"$t('recuperarContraseña')\"");
        expect(resetPasswordSource).toContain(":label=\"$t('cambiarPassword')\"");
    });
});
