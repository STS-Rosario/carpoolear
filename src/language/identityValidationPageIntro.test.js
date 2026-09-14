import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationPageIntro:
        'Para una comunidad Carpoolear más segura, tenés que verificar tu cuenta.',
    identityValidationPageSummary:
        'Una persona, una cuenta. Sin perfiles falsos. ',
    identityValidationPageLearnMoreLink: 'Conocé todos los detalles',
    identityValidationPageTwoOptions: 'Tenés dos opciones para hacerlo:'
};

const ENGLISH_EXPECTED = {
    identityValidationPageIntro:
        'For a safer Carpoolear community, you need to verify your account.',
    identityValidationPageSummary: 'One person, one account. No fake profiles. ',
    identityValidationPageLearnMoreLink: 'See all the details',
    identityValidationPageTwoOptions: 'You have two options:'
};

describe('identityValidationPageIntro (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale uses compact option B copy for the verification page intro',
        (locale) => {
            Object.entries(SPANISH_EXPECTED).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('en locale uses compact option B copy for the verification page intro', () => {
        Object.entries(ENGLISH_EXPECTED).forEach(([key, label]) => {
            expect(messages.en[key]).toBe(label);
        });
    });
});
