import { describe, expect, it } from 'vitest';
import { sortSubscriptions } from './sortSubscriptions.js';

describe('sortSubscriptions', () => {
    it('orders passengers before conductores, then date, then name', () => {
        const sorted = sortSubscriptions([
            {
                id: 1,
                is_passenger: 0,
                trip_date: '2026-08-20',
                to_address: 'Zarate'
            },
            {
                id: 2,
                is_passenger: 1,
                trip_date: '2026-08-15',
                to_address: 'Ceibas'
            },
            {
                id: 3,
                is_passenger: 1,
                trip_date: '2026-08-12',
                to_address: 'Buenos Aires'
            },
            {
                id: 4,
                is_passenger: 0,
                trip_date: null,
                from_address: 'Rosario',
                to_address: 'Mar del Plata'
            },
            {
                id: 5,
                is_passenger: 1,
                trip_date: '2026-08-12',
                to_address: 'Avellaneda'
            }
        ]);

        expect(sorted.map((item) => item.id)).toEqual([5, 3, 2, 1, 4]);
    });

    it('returns a new array and handles non-arrays', () => {
        const input = [{ id: 1, is_passenger: 0 }];
        expect(sortSubscriptions(input)).not.toBe(input);
        expect(sortSubscriptions(null)).toEqual([]);
    });
});
