import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationMpConfirmLead:
        'Antes de realizar la verificación, asegurate que el titular de la cuenta logueada en Mercado Pago coincida con el de Carpoolear.',
    identityValidationMpConfirmName:
        'El nombre completo debe coincidir en Carpoolear y Mercado Pago.',
    identityValidationMpConfirmContinue: 'Continuar con la verificación',
    identityValidationMpConfirmEditProfile: 'Editar mis datos de Carpoolear'
};

const ENGLISH_EXPECTED = {
    identityValidationMpConfirmLead:
        'Before verifying, make sure the account holder logged into Mercado Pago matches the Carpoolear account holder.',
    identityValidationMpConfirmName:
        'Your full name must match in Carpoolear and Mercado Pago.',
    identityValidationMpConfirmContinue: 'Continue with verification',
    identityValidationMpConfirmEditProfile: 'Edit my Carpoolear details'
};

describe('identityValidationMpConfirm (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale exposes Mercado Pago confirmation modal copy',
        (locale) => {
            Object.entries(SPANISH_EXPECTED).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('en locale exposes Mercado Pago confirmation modal copy', () => {
        Object.entries(ENGLISH_EXPECTED).forEach(([key, label]) => {
            expect(messages.en[key]).toBe(label);
        });
    });
});
