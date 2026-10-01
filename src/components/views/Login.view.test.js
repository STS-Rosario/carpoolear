import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../../language/i18n';

const loginSource = fs.readFileSync(path.resolve(__dirname, 'Login.vue'), 'utf8');
const appInputSource = fs.readFileSync(
    path.resolve(__dirname, '../ui/AppInput.vue'),
    'utf8'
);

describe('Login password visibility toggle', () => {
    it('defaults the password input to hidden and toggles its type in AppInput', () => {
        expect(appInputSource).toContain('showPassword: false');
        expect(appInputSource).toMatch(
            /return this\.showPassword \? 'text' : 'password'/
        );
    });

    it('exposes accessible labels for showing and hiding the password', () => {
        expect(appInputSource).toContain(
            ':aria-label="showPassword ? hidePasswordLabel : showPasswordLabel"'
        );
        expect(loginSource).toContain(":show-password-label=\"$t('mostrarContrasena')\"");
    });

    it.each(['arg', 'en'])('defines password visibility labels in %s locale', (locale) => {
        expect(messages[locale].mostrarContrasena).toBeTruthy();
        expect(messages[locale].ocultarContrasena).toBeTruthy();
    });
});

describe('Login contact messages', () => {
    it('uses config admin_email for banned and inactive account copy', () => {
        expect(loginSource).toContain('loginContactMessages.js');
        expect(loginSource).toContain('getLoginBannedMessage');
        expect(loginSource).toContain('getLoginInactiveAccountMessage');
        expect(loginSource).toContain('this.config?.admin_email');
        expect(loginSource).toContain('config.admin_email');
        expect(loginSource).not.toContain("$t('carpoolearMail')");
    });

    it.each(['arg', 'en'])(
        'keeps login contact i18n keys parameterized in %s locale',
        (locale) => {
            expect(messages[locale].usuarioBanneado).toContain('{adminEmail}');
            expect(messages[locale].paraIngresarCuenta).toContain('{adminEmail}');
            expect(messages[locale].usuarioBanneado).not.toContain('@@');
            expect(messages[locale].paraIngresarCuenta).not.toContain('@@');
        }
    );
});
