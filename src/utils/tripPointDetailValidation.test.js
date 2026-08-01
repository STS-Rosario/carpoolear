import { describe, expect, it } from 'vitest';
import {
    shouldShowTripPointDetailInputs,
    shouldShowPuntoPartidaInput,
    shouldShowPuntoLlegadaInput,
    validateTripPointDetails,
    applyTripPointDetailValidation,
    tripPointDetailContainsNumber
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

    describe('shouldShowPuntoPartidaInput', () => {
        it('returns true when origin city is selected', () => {
            expect(
                shouldShowPuntoPartidaInput([
                    { json: { name: 'Rosario' } },
                    { json: null }
                ])
            ).toBe(true);
        });

        it('returns false when origin city is missing', () => {
            expect(
                shouldShowPuntoPartidaInput([
                    { json: null },
                    { json: { name: 'Cordoba' } }
                ])
            ).toBe(false);
        });
    });

    describe('shouldShowPuntoLlegadaInput', () => {
        it('returns true when destination city is selected', () => {
            expect(
                shouldShowPuntoLlegadaInput([
                    { json: { name: 'Rosario' } },
                    { json: { name: 'Cordoba' } }
                ])
            ).toBe(true);
        });

        it('returns false when destination city is missing', () => {
            expect(
                shouldShowPuntoLlegadaInput([
                    { json: { name: 'Rosario' } },
                    { json: null }
                ])
            ).toBe(false);
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

    describe('tripPointDetailContainsNumber', () => {
        it('returns true when the value contains a digit', () => {
            expect(tripPointDetailContainsNumber('Calle 123')).toBe(true);
            expect(tripPointDetailContainsNumber('Av. 9 de Julio')).toBe(true);
        });

        it('returns false when the value has no digits', () => {
            expect(tripPointDetailContainsNumber('Terminal de Ómnibus')).toBe(
                false
            );
            expect(tripPointDetailContainsNumber('')).toBe(false);
            expect(tripPointDetailContainsNumber('   ')).toBe(false);
        });
    });
});
