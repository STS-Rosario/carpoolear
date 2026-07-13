import { describe, expect, it } from 'vitest';
import messages from './i18n';

const BOTH_MISMATCH_WARNING_ES = {
    identityValidationRejectionSupportWarningBothMismatchParagraph1:
        'Parece que no coincide tu nombre ni DNI, revisá si usaste una cuenta de Mercado Pago del mismo titular que la de Carpoolear.',
    identityValidationRejectionSupportWarningBothMismatchParagraph2Lead:
        'Si necesitás modificar tu nombre y/o DNI de tu cuenta Carpoolear podes hacerlo editando tu perfil. Si tenés cuenta duplicada en Carpoolear, ',
    identityValidationRejectionSupportWarningBothMismatchParagraph2Tail:
        ' así te ayudamos a normalizar tu cuenta y puedas terminar el proceso de verificación.',
    identityValidationMismatchSupportTicketCta: 'creá un ticket de Mesa de Ayuda'
};

const BOTH_MISMATCH_WARNING_BY_LOCALE = {
    arg: BOTH_MISMATCH_WARNING_ES,
    chl: BOTH_MISMATCH_WARNING_ES,
    en: {
        identityValidationRejectionSupportWarningBothMismatchParagraph1:
            'It looks like neither your name nor DNI matches. Check that you used a Mercado Pago account belonging to the same holder as your Carpoolear account.',
        identityValidationRejectionSupportWarningBothMismatchParagraph2Lead:
            'If you need to update your name and/or DNI on your Carpoolear account, you can do so by editing your profile. If you have a duplicate Carpoolear account, ',
        identityValidationRejectionSupportWarningBothMismatchParagraph2Tail:
            ' so we can help you consolidate your account and complete the verification process.',
        identityValidationMismatchSupportTicketCta: 'create a Help Desk ticket'
    }
};

describe('identityValidationRejectionSupportWarningBothMismatch (i18n)', () => {
    it.each(Object.entries(BOTH_MISMATCH_WARNING_BY_LOCALE))(
        '%s locale uses two-paragraph MP rejection warning copy',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
