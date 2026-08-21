import { describe, expect, it } from 'vitest';
import { getTripValidationErrorFields } from './tripFormValidationFields.js';

function field(state, message = '') {
    return { state, message };
}

function pointError(state, message = '') {
    return { error: field(state, message) };
}

describe('tripFormValidationFields', () => {
    it('returns outbound trip validation error field objects', () => {
        const originError = field(true, 'Origen inválido');
        const ignoredPointError = field(false, 'Ignorado');
        const dateError = field(true, 'Falta fecha');
        const form = {
            points: [{ error: originError }, { error: ignoredPointError }],
            dateError,
            timeError: field(false),
            priceError: field(true, 'Contribución requerida'),
            returnPriceError: field(false),
            commentError: field(true, 'Falta descripción'),
            seatsError: field(false),
            lucrarError: field(true, 'Compromiso requerido'),
            puntoPartidaError: field(true, 'Punto partida requerido'),
            puntoLlegadaError: field(false),
            carSelectionError: field(false),
            showReturnTrip: false
        };

        expect(getTripValidationErrorFields(form)).toEqual([
            originError,
            ignoredPointError,
            dateError,
            form.timeError,
            form.priceError,
            form.returnPriceError,
            form.commentError,
            form.seatsError,
            form.lucrarError,
            form.puntoPartidaError,
            form.puntoLlegadaError,
            form.carSelectionError
        ]);
    });

    it('includes return trip validation fields when enabled', () => {
        const returnPointError = field(true, 'Origen regreso inválido');
        const returnDateError = field(true, 'Falta fecha regreso');
        const form = {
            points: [pointError(false), pointError(false)],
            dateError: field(false),
            timeError: field(false),
            priceError: field(false),
            returnPriceError: field(true, 'Contribución regreso requerida'),
            commentError: field(false),
            seatsError: field(false),
            lucrarError: field(false),
            puntoPartidaError: field(false),
            puntoLlegadaError: field(false),
            carSelectionError: field(false),
            showReturnTrip: true,
            otherTrip: {
                points: [{ error: returnPointError }],
                dateError: returnDateError,
                timeError: field(false),
                commentError: field(false),
                seatsError: field(false),
                puntoPartidaError: field(false),
                puntoLlegadaError: field(false)
            }
        };

        expect(getTripValidationErrorFields(form)).toContain(form.returnPriceError);
        expect(getTripValidationErrorFields(form)).toContain(returnPointError);
        expect(getTripValidationErrorFields(form)).toContain(returnDateError);
    });
});
