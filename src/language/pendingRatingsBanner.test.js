import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('pendingRatingsBanner i18n', () => {
    it('arg locale has the required Spanish banner text', () => {
        expect(messages.arg.pendingRatingsBanner).toBe(
            'Tenés viajes para calificar, hacelo para poder continuar usando Carpoolear. Click acá para hacerlo.'
        );
    });

    it.each(['arg', 'chl'])(
        '%s locale defines pendingRatingsBanner',
        (locale) => {
            expect(messages[locale].pendingRatingsBanner).toBeTruthy();
        }
    );

    it('en locale defines pendingRatingsBanner', () => {
        expect(messages.en.pendingRatingsBanner).toBeTruthy();
    });
});
