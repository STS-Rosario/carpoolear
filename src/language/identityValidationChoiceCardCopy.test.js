import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationAutoBadgeFree: 'Gratis',
    identityValidationAutoBadgeInstant: 'Al instante',
    identityValidationManualBadgeTime: 'Hasta 48hs.',
    identityValidationManualCardDesc:
        '¿No tenés Mercado Pago? Subí tu documentación y la revisamos.'
};

const ENGLISH_EXPECTED = {
    identityValidationAutoBadgeFree: 'Free',
    identityValidationAutoBadgeInstant: 'Instant',
    identityValidationManualBadgeTime: 'Up to 48hrs.',
    identityValidationManualCardDesc:
        "Don't have Mercado Pago? Upload your documents and we'll review them."
};

describe('identityValidationChoiceCardCopy (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale exposes compact badges and manual card description',
        (locale) => {
            Object.entries(SPANISH_EXPECTED).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('en locale exposes compact badges and manual card description', () => {
        Object.entries(ENGLISH_EXPECTED).forEach(([key, label]) => {
            expect(messages.en[key]).toBe(label);
        });
    });
});
