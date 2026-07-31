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
    it('uses AppInput for the password field with a toggle button', () => {
        expect(loginSource).toContain('password');
        expect(loginSource).toContain(':show-password-label="$t(\'mostrarContrasena\')"');
        expect(loginSource).toContain(':hide-password-label="$t(\'ocultarContrasena\')"');
        expect(appInputSource).toContain('app-input__toggle');
        expect(appInputSource).toContain('togglePasswordVisibility');
    });

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
