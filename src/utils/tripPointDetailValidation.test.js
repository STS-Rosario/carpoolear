import { describe, expect, it } from 'vitest';
import {
    shouldShowTripPointDetailInputs,
    validateTripPointDetails,
    applyTripPointDetailValidation
} from './tripPointDetailValidation.js';

describe('tripPointDetailValidation', () => {
    describe('shouldShowTripPointDetailInputs', () => {
        it('returns false when origin or destination is missing', () => {
            expect(
                shouldShowTripPointDetailInputs([
                    { json: { name: 'Rosario' } },
                    { json: null }
                ])
            ).toBe(false);
        });

        it('returns true when origin and destination are selected', () => {
            expect(
                shouldShowTripPointDetailInputs([
                    { json: { name: 'Rosario' } },
                    { json: { name: 'Cordoba' } }
                ])
            ).toBe(true);
        });
    });

    describe('validateTripPointDetails', () => {
        const t = (key) => key;

        it('returns errors when punto partida or llegada are empty', () => {
            expect(
                validateTripPointDetails({
                    puntoPartida: '',
                    puntoLlegada: '   ',
                    t
                })
            ).toEqual({
                puntoPartida: 'puntoPartidaRequerido',
                puntoLlegada: 'puntoLlegadaRequerido'
            });
        });

        it('returns no errors when both fields have text', () => {
            expect(
                validateTripPointDetails({
                    puntoPartida: 'Terminal',
                    puntoLlegada: 'Barrio Norte',
                    t
                })
            ).toEqual({});
        });
    });

    describe('applyTripPointDetailValidation', () => {
        const t = (key) => key;

        it('sets error state on detail error objects and reports validation failure', () => {
            const puntoPartidaError = { state: false, message: '' };
            const puntoLlegadaError = { state: false, message: '' };

            const hasError = applyTripPointDetailValidation({
                puntoPartida: '',
                puntoLlegada: 'Centro',
                t,
                puntoPartidaError,
                puntoLlegadaError
            });

            expect(hasError).toBe(true);
            expect(puntoPartidaError).toEqual({
                state: true,
                message: 'puntoPartidaRequerido'
            });
            expect(puntoLlegadaError).toEqual({
                state: false,
                message: ''
            });
        });
    });
});
