import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationMpConfirmLead:
        'Antes de avanzar con la verificación, tenés que cumplir con las siguientes condiciones:',
    identityValidationMpConfirmConditionSession:
        'Tener abierta la sesión de tu cuenta de Mercado Pago en el navegador.',
    identityValidationMpConfirmName:
        'El nombre completo y DNI debe coincidir en Carpoolear y Mercado Pago.',
    identityValidationMpConfirmHelpPrefix:
        '¿Necesitás ayuda para poder terminar tu verificación contra Mercado Pago? ',
    identityValidationMpConfirmHelpLink: 'Generá un ticket',
    identityValidationMpConfirmContinue: 'Continuar con la verificación',
    identityValidationMpConfirmEditProfile: 'Editar mis datos de Carpoolear'
};

const ENGLISH_EXPECTED = {
    identityValidationMpConfirmLead:
        'Before moving forward with verification, you must meet the following conditions:',
    identityValidationMpConfirmConditionSession:
        'Be logged into your Mercado Pago account in the browser.',
    identityValidationMpConfirmName:
        'Your full name and DNI must match in Carpoolear and Mercado Pago.',
    identityValidationMpConfirmHelpPrefix:
        'Need help finishing your verification against Mercado Pago? ',
    identityValidationMpConfirmHelpLink: 'Create a ticket',
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
