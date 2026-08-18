import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationLearnMorePrefix:
        '¿Querés saber más al respecto? Podés ',
    identityValidationLearnMoreLink:
        'leer más sobre la verificación de cuenta',
    identityValidationLearnMoreSuffix: '.'
};

const ENGLISH_EXPECTED = {
    identityValidationLearnMorePrefix: 'Want to know more? You can ',
    identityValidationLearnMoreLink: 'read more about account verification',
    identityValidationLearnMoreSuffix: '.'
};

describe('identityValidationLearnMore (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale exposes learn-more copy for account verification',
        (locale) => {
            expect(messages[locale].identityValidationLearnMorePrefix).toBe(
                SPANISH_EXPECTED.identityValidationLearnMorePrefix
            );
            expect(messages[locale].identityValidationLearnMoreLink).toBe(
                SPANISH_EXPECTED.identityValidationLearnMoreLink
            );
            expect(messages[locale].identityValidationLearnMoreSuffix).toBe(
                SPANISH_EXPECTED.identityValidationLearnMoreSuffix
            );
        }
    );

    it('en locale exposes learn-more copy for account verification', () => {
        expect(messages.en.identityValidationLearnMorePrefix).toBe(
            ENGLISH_EXPECTED.identityValidationLearnMorePrefix
        );
        expect(messages.en.identityValidationLearnMoreLink).toBe(
            ENGLISH_EXPECTED.identityValidationLearnMoreLink
        );
        expect(messages.en.identityValidationLearnMoreSuffix).toBe(
            ENGLISH_EXPECTED.identityValidationLearnMoreSuffix
        );
    });
});
