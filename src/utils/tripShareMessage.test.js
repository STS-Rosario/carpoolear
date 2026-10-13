import { describe, expect, it } from 'vitest';
import {
    buildTripShareMessage,
    formatTripShareDay,
    formatTripShareTime
} from './tripShareMessage.js';

describe('tripShareMessage', () => {
    const trip = {
        from_town: 'Rosario',
        to_town: 'Buenos Aires',
        trip_date: '2026-06-15 14:00:00'
    };

    it('formats day and time from trip_date for sharing', () => {
        expect(formatTripShareDay(trip.trip_date, 'es')).toBe('lunes 15 de junio');
        expect(formatTripShareTime(trip.trip_date)).toBe('14:00');
    });

    it('builds the Spanish share message with day, time, origin and destination', () => {
        const message = buildTripShareMessage({
            trip,
            locale: 'es',
            translate: (key, params) => {
                expect(key).toBe('tripShareMessage');
                expect(params).not.toHaveProperty('url');
                expect(params.origin).toBe('Rosario');
                expect(params.destination).toBe('Buenos Aires');
                return `Te comparto mi viaje en Carpoolear para el ${params.day} a las ${params.time}hs de ${params.origin} a ${params.destination}`;
            }
        });

        expect(message).toBe(
            'Te comparto mi viaje en Carpoolear para el lunes 15 de junio a las 14:00hs de Rosario a Buenos Aires'
        );
    });
});
