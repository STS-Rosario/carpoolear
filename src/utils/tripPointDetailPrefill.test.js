import { describe, expect, it } from 'vitest';
import {
    restoreTripPointDetailsFromTrip,
    syncReturnTripPointDetailsFromOutbound
} from './tripPointDetailPrefill.js';

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

describe('syncReturnTripPointDetailsFromOutbound', () => {
    it('inverts punto partida and punto llegada on the return trip', () => {
        const outboundTrip = {
            punto_partida: 'Terminal de Ómnibus',
            punto_llegada: 'Plaza Principal'
        };
        const returnTrip = {
            punto_partida: '',
            punto_llegada: ''
        };

        syncReturnTripPointDetailsFromOutbound(outboundTrip, returnTrip);

        expect(returnTrip).toEqual({
            punto_partida: 'Plaza Principal',
            punto_llegada: 'Terminal de Ómnibus'
        });
    });

    it('defaults missing outbound values to empty strings on the return trip', () => {
        const returnTrip = {
            punto_partida: 'old',
            punto_llegada: 'old'
        };

        syncReturnTripPointDetailsFromOutbound({}, returnTrip);

        expect(returnTrip).toEqual({
            punto_partida: '',
            punto_llegada: ''
        });
    });
});
