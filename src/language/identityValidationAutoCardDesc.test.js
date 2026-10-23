import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('identityValidationAutoCardDesc (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale explains RENAPER via Mercado Pago and fallback to manual',
        (locale) => {
            expect(messages[locale].identityValidationAutoCardDesc).toBe(
                'El sistema verifica tus datos con RENAPER a través de Mercado Pago. Si la verificación falla por datos incorrectos o un inconveniente técnico, contactá a la Mesa de Ayuda de Carpoolear. Si no podemos resolverlo, vas a tener que realizar la verificación manual.'
            );
            expect(messages[locale].identityValidationAutoCardDesc).toMatch(
                /RENAPER/
            );
            expect(messages[locale].identityValidationAutoCardDesc).toMatch(
                /verificación manual/
            );
        }
    );

    it('en locale explains RENAPER via Mercado Pago and fallback to manual', () => {
        expect(messages.en.identityValidationAutoCardDesc).toBe(
            'The system checks your data against RENAPER through Mercado Pago. If the verification fails due to incorrect data or a technical issue, contact the Carpoolear Help Desk. If we cannot resolve it, you will have to complete the manual verification.'
        );
        expect(messages.en.identityValidationAutoCardDesc).toMatch(/RENAPER/);
        expect(messages.en.identityValidationAutoCardDesc).toMatch(
            /manual verification/i
        );
    });
});
