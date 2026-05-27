import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from './i18n';

/** Mirrors Login.vue modal body: prefix + provider + suffix. */
function loginSocialDeprecationMessage(locale, modalType) {
    const m = messages[locale];
    const provider = modalType === 'facebook' ? m.facebook : m.apple;
    return `${m.ingresoRegistroYaNoFunciona} ${provider} ${m.ingresoRegistroYaNoFuncionaMas}`;
}

const loginViewPath = path.resolve(
    __dirname,
    '../components/views/Login.vue'
);
const loginViewSource = fs.readFileSync(loginViewPath, 'utf8');

describe('Login social deprecation message (i18n)', () => {
    it('arg + facebook interpolates to the full Spanish sentence', () => {
        expect(loginSocialDeprecationMessage('arg', 'facebook')).toBe(
            'El ingreso/registro via Facebook ya no funciona más.'
        );
    });

    it.each(['arg', 'chl'])(
        '%s locale has facebook/apple and suffix keys for the modal',
        (locale) => {
            const m = messages[locale];
            expect(m.ingresoRegistroYaNoFuncionaMas).toBe(
                'ya no funciona más.'
            );
            expect(m.facebook).toBe('Facebook');
            expect(m.apple).toBe('Apple');
        }
    );
});

describe('Login.vue social deprecation copy', () => {
    it('uses ingresoRegistroYaNoFuncionaMas after the provider name', () => {
        expect(loginViewSource).toContain("$t('ingresoRegistroYaNoFunciona')");
        expect(loginViewSource).toContain(
            "$t('ingresoRegistroYaNoFuncionaMas')"
        );
        expect(loginViewSource).not.toMatch(
            /\$t\('apple'\)\s*\}\}\s*\./
        );
    });
});
