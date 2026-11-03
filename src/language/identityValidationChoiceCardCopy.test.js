import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationAutoBadgeFree: 'Gratis',
    identityValidationAutoBadgeInstant: 'Sin demora',
    identityValidationManualBadgeTime: 'Hasta 48hs.',
    identityValidationManualCardDesc: 'Subí tu documentación y la revisamos.'
};

const ENGLISH_EXPECTED = {
    identityValidationAutoBadgeFree: 'Free',
    identityValidationAutoBadgeInstant: 'No delay',
    identityValidationManualBadgeTime: 'Up to 48hrs.',
    identityValidationManualCardDesc:
        "Upload your documents and we'll review them."
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
