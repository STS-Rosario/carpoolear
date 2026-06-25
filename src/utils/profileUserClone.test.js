import { describe, expect, it } from 'vitest';
import { cloneProfileUser } from './profileUserClone.js';

describe('cloneProfileUser', () => {
    it('returns a deep copy that does not mutate the auth store user', () => {
        const source = {
            name: 'Ana',
            nro_doc: '30111222',
            description: 'Viajo seguido',
            mobile_phone: '+5493415551234',
            meta: { trips: 2 }
        };

        const draft = cloneProfileUser(source);
        draft.nro_doc = '99999999';
        draft.description = 'Cambio sin guardar';
        draft.meta.trips = 99;

        expect(source.nro_doc).toBe('30111222');
        expect(source.description).toBe('Viajo seguido');
        expect(source.meta.trips).toBe(2);
        expect(draft).not.toBe(source);
    });

    it('returns null when user is missing', () => {
        expect(cloneProfileUser(null)).toBe(null);
        expect(cloneProfileUser(undefined)).toBe(null);
    });
});
