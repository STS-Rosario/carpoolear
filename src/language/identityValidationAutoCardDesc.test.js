import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('identityValidationAutoCardDesc (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale clarifies automatic verification is MP-only',
        (locale) => {
            expect(messages[locale].identityValidationAutoCardDesc).toBe(
                'Sólo si tenés cuenta de Mercado Pago. El sistema contrasta los datos con RENAPER.'
            );
            expect(messages[locale].identityValidationAutoCardDesc).not.toMatch(
                /Validá con tu cuenta/i
            );
        }
    );

    it('en locale clarifies automatic verification is MP-only', () => {
        expect(messages.en.identityValidationAutoCardDesc).toBe(
            'Only if you have a Mercado Pago account. The system checks your data against RENAPER.'
        );
        expect(messages.en.identityValidationAutoCardDesc).not.toMatch(
            /Verify with your Mercado Pago account/i
        );
    });
});
