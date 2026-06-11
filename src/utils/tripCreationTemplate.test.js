import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    listTripCreationTemplates,
    loadTripCreationTemplate,
    saveTripCreationTemplate,
    TRIP_CREATION_TEMPLATES_STORAGE_KEY
} from './tripCreationTemplate.js';

function createStorage() {
    const store = new Map();
    return {
        getItem: vi.fn((key) => store.get(key) ?? null),
        setItem: vi.fn((key, value) => {
            store.set(key, String(value));
        }),
        removeItem: vi.fn((key) => {
            store.delete(key);
        }),
        clear: vi.fn(() => {
            store.clear();
        })
    };
}

describe('tripCreationTemplate', () => {
    let storage;

    beforeEach(() => {
        storage = createStorage();
        vi.stubGlobal('localStorage', storage);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('uses a stable storage key', () => {
        expect(TRIP_CREATION_TEMPLATES_STORAGE_KEY).toBe('TRIP_CREATION_TEMPLATES');
    });

    it('saves and loads a named template for one user', () => {
        const templateData = {
            trip: { is_passenger: 0, description: 'Viaje frecuente' },
            points: [{ name: 'Rosario' }, { name: 'Buenos Aires' }]
        };

        saveTripCreationTemplate(42, 'Rosario a BA', templateData);
        expect(loadTripCreationTemplate(42, 'Rosario a BA')).toEqual(templateData);
    });

    it('lists saved template names for a user', () => {
        saveTripCreationTemplate(7, 'Semanal', { trip: {} });
        saveTripCreationTemplate(7, 'Fin de semana', { trip: {} });

        expect(listTripCreationTemplates(7).map((template) => template.name)).toEqual([
            'Semanal',
            'Fin de semana'
        ]);
    });

    it('isolates templates per user', () => {
        saveTripCreationTemplate(1, 'Viaje A', { trip: { total_seats: 2 } });
        saveTripCreationTemplate(2, 'Viaje B', { trip: { total_seats: 4 } });

        expect(loadTripCreationTemplate(1, 'Viaje A')).toEqual({
            trip: { total_seats: 2 }
        });
        expect(loadTripCreationTemplate(2, 'Viaje B')).toEqual({
            trip: { total_seats: 4 }
        });
        expect(loadTripCreationTemplate(1, 'Viaje B')).toBeNull();
    });

    it('overwrites an existing template with the same name', () => {
        saveTripCreationTemplate(9, 'Ruta', { trip: { total_seats: 2 } });
        saveTripCreationTemplate(9, 'Ruta', { trip: { total_seats: 3 } });

        expect(loadTripCreationTemplate(9, 'Ruta')).toEqual({
            trip: { total_seats: 3 }
        });
    });

    it('ignores invalid user id or empty template name', () => {
        saveTripCreationTemplate(null, 'Ruta', { trip: {} });
        saveTripCreationTemplate(5, '   ', { trip: {} });

        expect(listTripCreationTemplates(5)).toEqual([]);
    });
});
