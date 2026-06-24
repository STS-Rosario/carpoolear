import { describe, expect, it } from 'vitest';
import { restoreTripPointDetailsFromTrip } from './tripPointDetailPrefill.js';

describe('restoreTripPointDetailsFromTrip', () => {
    it('copies punto partida and punto llegada from the saved trip into the form trip', () => {
        const formTrip = { punto_partida: '', punto_llegada: '' };
        const savedTrip = {
            punto_partida: 'Terminal de Ómnibus',
            punto_llegada: 'Plaza Principal'
        };

        restoreTripPointDetailsFromTrip(formTrip, savedTrip);

        expect(formTrip).toEqual({
            punto_partida: 'Terminal de Ómnibus',
            punto_llegada: 'Plaza Principal'
        });
    });

    it('defaults missing values to empty strings', () => {
        const formTrip = { punto_partida: 'old', punto_llegada: 'old' };

        restoreTripPointDetailsFromTrip(formTrip, {});

        expect(formTrip).toEqual({
            punto_partida: '',
            punto_llegada: ''
        });
    });
});
