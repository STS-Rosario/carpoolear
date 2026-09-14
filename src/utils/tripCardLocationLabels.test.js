import { describe, expect, it } from 'vitest';
import { getTripCardLocationLabels } from './tripCardLocationLabels.js';

describe('getTripCardLocationLabels', () => {
    const trip = {
        from_town: 'Rosario, Santa Fe',
        to_town: 'Buenos Aires, CABA',
        punto_partida: 'Terminal de Ómnibus',
        punto_llegada: 'Plaza Principal'
    };

    it('hides punto partida and llegada for guest viewers on /trips', () => {
        const labels = getTripCardLocationLabels(trip, null);

        expect(labels.fromCity).toBe('Rosario');
        expect(labels.toCity).toBe('Buenos Aires');
        expect(labels.fromPoint).toBe('');
        expect(labels.toPoint).toBe('');
    });

    it('shows punto partida and llegada for logged-in viewers', () => {
        const labels = getTripCardLocationLabels(trip, { id: 1 });

        expect(labels.fromPoint).toBe('Terminal de Ómnibus');
        expect(labels.toPoint).toBe('Plaza Principal');
    });
});
