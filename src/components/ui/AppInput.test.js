import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppInput.vue');
const loginPath = path.resolve(__dirname, '../views/Login.vue');
const registerPath = path.resolve(__dirname, '../views/Register.vue');
const source = fs.readFileSync(componentPath, 'utf8');
const loginSource = fs.readFileSync(loginPath, 'utf8');
const registerSource = fs.readFileSync(registerPath, 'utf8');

describe('AppInput', () => {
    it('supports label, hint, error, disabled, and password props', () => {
        expect(source).toContain('label:');
        expect(source).toContain('hint:');
        expect(source).toContain('error:');
        expect(source).toContain('disabled:');
        expect(source).toContain('password:');
        expect(source).toContain('app-input__hint');
        expect(source).toContain('app-input--error');
    });

    it('forwards focus to the inner control for parent refs', () => {
        expect(source).toContain('focus()');
        expect(source).toContain('ref="inputEl"');
    });
});

describe('auth forms AppInput integration', () => {
    it('uses AppInput on Login without changing the submit form structure', () => {
        expect(loginSource).toContain('user-form--inputs');
        expect(loginSource).toContain('AppInput');
        expect(loginSource).toContain('ref="txt_user"');
        expect(loginSource).toContain('@submit.prevent="submitLogin"');
        expect(loginSource).toContain('id="btn_login"');
    });

    it('uses AppInput on Register email and password fields', () => {
        expect(registerSource).toContain('user-form--inputs');
        expect(registerSource).toContain('AppInput');
        expect(registerSource).toContain(':error="emailError.message"');
        expect(registerSource).toContain('v-model="name"');
    });
});
