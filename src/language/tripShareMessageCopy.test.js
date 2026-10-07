import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('tripShareMessage copy (i18n)', () => {
    it('Spanish locales include “a las” and “hs” around the time placeholder', () => {
        expect(messages.arg.tripShareMessage).toBe(
            'Te comparto mi viaje en Carpoolear para el {day} a las {time}hs a {destination}'
        );
        expect(messages.chl.tripShareMessage).toBe(
            'Te comparto mi viaje en Apalan-car para el {day} a las {time}hs a {destination}'
        );
    });

    it('English locale keeps an explicit preposition before the time', () => {
        expect(messages.en.tripShareMessage).toBe(
            "I'm sharing my Carpoolear trip on {day} at {time} to {destination}"
        );
    });
});
