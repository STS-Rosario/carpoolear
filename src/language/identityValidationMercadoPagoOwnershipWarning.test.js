import { describe, expect, it } from 'vitest';
import messages from './i18n';

const MP_OWNERSHIP_WARNING_ES = {
    identityValidationMercadoPagoOwnershipWarningPrefix:
        'Antes de realizar la verificación, asegurate que el titular de la cuenta logueada en Mercado Pago coincida con el de Carpoolear. El nombre completo debe coincidir en Carpoolear y MP, ',
    identityValidationMercadoPagoOwnershipWarningProfileLink:
        'podés editarlo acá',
    identityValidationMercadoPagoOwnershipWarningSuffix: '.'
};

const MP_OWNERSHIP_WARNING_BY_LOCALE = {
    arg: MP_OWNERSHIP_WARNING_ES,
    chl: MP_OWNERSHIP_WARNING_ES,
    en: {
        identityValidationMercadoPagoOwnershipWarningPrefix:
            'Before verifying, make sure the account holder logged into Mercado Pago matches the Carpoolear account holder. Your full name must match in Carpoolear and MP, you can ',
        identityValidationMercadoPagoOwnershipWarningProfileLink: 'edit it here',
        identityValidationMercadoPagoOwnershipWarningSuffix: '.'
    }
};

describe('identityValidationMercadoPagoOwnershipWarning (i18n)', () => {
    it.each(Object.entries(MP_OWNERSHIP_WARNING_BY_LOCALE))(
        '%s locale explains name must match and links to profile edit',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
