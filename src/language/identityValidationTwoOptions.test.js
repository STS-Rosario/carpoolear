import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_EXPECTED = {
    identityValidationTwoOptions:
        'Existen {twoOptions} para verificar tu cuenta: {automatic} o {manual}.',
    identityValidationTwoOptionsCount: 'dos opciones',
    identityValidationTwoOptionsAutomatic: 'verificación automática',
    identityValidationTwoOptionsManual: 'verificación manual'
};

const ENGLISH_EXPECTED = {
    identityValidationTwoOptions:
        'There are {twoOptions} to verify your account: {automatic} or {manual}.',
    identityValidationTwoOptionsCount: 'two options',
    identityValidationTwoOptionsAutomatic: 'automatic verification',
    identityValidationTwoOptionsManual: 'manual verification'
};

describe('identityValidationTwoOptions (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale describes automatic and manual verification options',
        (locale) => {
            Object.entries(SPANISH_EXPECTED).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('en locale describes automatic and manual verification options', () => {
        Object.entries(ENGLISH_EXPECTED).forEach(([key, label]) => {
            expect(messages.en[key]).toBe(label);
        });
    });
});
