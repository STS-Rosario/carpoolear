import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('identityValidationTwoOptions (i18n)', () => {
    it.each(['arg', 'chl'])(
        '%s locale keeps two-options copy on the compact intro key',
        (locale) => {
            expect(messages[locale].identityValidationPageTwoOptions).toBe(
                'Tenés dos opciones para hacerlo:'
            );
        }
    );

    it('en locale keeps two-options copy on the compact intro key', () => {
        expect(messages.en.identityValidationPageTwoOptions).toBe(
            'You have two options:'
        );
    });
});
