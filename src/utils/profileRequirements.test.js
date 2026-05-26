import { describe, expect, it } from 'vitest';
import {
    hasRequiredProfileFields,
    hasDriverPlate,
    firstCarWithPlate,
    requiresDriverPlate
} from './profileRequirements';

describe('profile required fields', () => {
    const completeUser = {
        image: 'profile.jpg',
        description: 'Viajo seguido entre ciudades.',
        nro_doc: '30111222',
        mobile_phone: '+5493415551234'
    };

    it('requires image, description, document, and phone for restricted actions', () => {
        expect(hasRequiredProfileFields(completeUser)).toBe(true);

        expect(hasRequiredProfileFields({ ...completeUser, image: '' })).toBe(false);
        expect(hasRequiredProfileFields({ ...completeUser, description: '' })).toBe(false);
        expect(hasRequiredProfileFields({ ...completeUser, nro_doc: '' })).toBe(false);
        expect(hasRequiredProfileFields({ ...completeUser, mobile_phone: '' })).toBe(false);
    });

    it('requires a saved plate only when creating a driver trip', () => {
        expect(requiresDriverPlate({ is_passenger: 0 })).toBe(true);
        expect(requiresDriverPlate({ is_passenger: '0' })).toBe(true);
        expect(requiresDriverPlate({ is_passenger: 1 })).toBe(false);
        expect(requiresDriverPlate({ is_passenger: '1' })).toBe(false);
    });

    it('treats a non-empty car plate as present', () => {
        expect(hasDriverPlate([{ patente: 'ABC123' }])).toBe(true);
        expect(hasDriverPlate([{ patente: '   ' }])).toBe(false);
        expect(hasDriverPlate([])).toBe(false);
        expect(hasDriverPlate(null)).toBe(false);
    });

    it('returns the first car that has a plate', () => {
        const first = { id: 1, patente: '' };
        const second = { id: 2, patente: 'ABC123' };

        expect(firstCarWithPlate([first, second])).toBe(second);
        expect(firstCarWithPlate([first])).toBe(null);
    });
});
