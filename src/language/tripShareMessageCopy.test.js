import { describe, expect, it } from 'vitest';
import messages from './i18n';
import { buildTripShareMessage } from '../utils/tripShareMessage.js';

function translateArg(key, params) {
    const template = messages.arg[key];
    return Object.entries(params).reduce(
        (text, [name, value]) => text.replace(`{${name}}`, value),
        template
    );
}

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

    it('buildTripShareMessage applies Spanish tripShareMessage placeholders', () => {
        const message = buildTripShareMessage({
            trip: {
                to_town: 'San Carlos de Bariloche',
                trip_date: '2026-10-08 12:00:00'
            },
            locale: 'es',
            translate: translateArg
        });

        expect(message).toBe(
            'Te comparto mi viaje en Carpoolear para el jueves 8 de octubre a las 12:00hs a San Carlos de Bariloche'
        );
    });
});
