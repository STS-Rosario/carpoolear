import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../../language/i18n';

const loginSource = fs.readFileSync(path.resolve(__dirname, 'Login.vue'), 'utf8');

describe('Login password visibility toggle', () => {
    it('wraps the password field with a toggle button', () => {
        expect(loginSource).toContain('class="password-field"');
        expect(loginSource).toContain('id="btn_toggle_password"');
        expect(loginSource).toContain('@click="togglePasswordVisibility"');
    });

    it('defaults the password input to hidden and toggles its type', () => {
        expect(loginSource).toContain('showPassword: false');
        expect(loginSource).toMatch(
            /:type="showPassword \? 'text' : 'password'"/
        );
    });

    it('exposes accessible labels for showing and hiding the password', () => {
        expect(loginSource).toContain(":aria-label=\"showPassword ? $t('ocultarContrasena') : $t('mostrarContrasena')\"");
    });

    it.each(['arg', 'en'])('defines password visibility labels in %s locale', (locale) => {
        expect(messages[locale].mostrarContrasena).toBeTruthy();
        expect(messages[locale].ocultarContrasena).toBeTruthy();
    });
});
