import { describe, it, expect } from 'vitest';
import { swapSearchLocations } from './swapSearchLocations.js';

describe('swapSearchLocations', () => {
    it('swaps origin and destination town objects', () => {
        const origin = {
            name: 'Rosario',
            location: { lat: -32.95, lng: -60.67 },
            radio: 10,
            country: 'AR',
            id: 1
        };
        const destination = {
            name: 'Buenos Aires',
            location: { lat: -34.6, lng: -58.38 },
            radio: 15,
            country: 'AR',
            id: 2
        };

        expect(swapSearchLocations(origin, destination)).toEqual({
            origin: destination,
            destination: origin
        });
    });

    it('returns cloned objects so later mutations do not cross fields', () => {
        const origin = { name: 'Rosario', location: null, radio: 0, country: 'AR' };
        const destination = {
            name: 'Buenos Aires',
            location: null,
            radio: 0,
            country: 'AR'
        };

        const swapped = swapSearchLocations(origin, destination);
        swapped.origin.name = 'Changed';

        expect(origin.name).toBe('Rosario');
        expect(destination.name).toBe('Buenos Aires');
    });
});
