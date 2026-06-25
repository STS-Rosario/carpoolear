import { describe, expect, it } from 'vitest';
import {
    TRIP_FORM_ERROR_SELECTORS,
    collectActiveValidationMessages,
    findFirstTripFormErrorElement,
    formatTripValidationDialogMessage
} from './tripFormValidationFeedback.js';

describe('tripFormValidationFeedback', () => {
    it('collects unique active validation messages from field errors', () => {
        const messages = collectActiveValidationMessages([
            { state: true, message: 'Falta fecha' },
            { state: false, message: 'Ignorado' },
            { state: true, message: 'Falta fecha' },
            { state: true, message: 'Horario no válido' }
        ]);

        expect(messages).toEqual(['Falta fecha', 'Horario no válido']);
    });

    it('lists active validation messages in the generic trip dialog copy', () => {
        expect(
            formatTripValidationDialogMessage('Algunos datos ingresados no son válidos.', [
                'Falta fecha',
                'Horario no válido'
            ])
        ).toBe(
            'Algunos datos ingresados no son válidos.\n• Falta fecha\n• Horario no válido'
        );
    });

    it('falls back to the generic message when no field errors are active', () => {
        expect(
            formatTripValidationDialogMessage('Algunos datos ingresados no son válidos.', [])
        ).toBe('Algunos datos ingresados no son válidos.');
    });

    it('prioritizes trip-error markers when scrolling to the first invalid field', () => {
        const root = {
            querySelectorAll(selector) {
                if (selector === '.trip-error') {
                    return [{ textContent: 'Origen inválido' }];
                }
                if (selector === '.has-error') {
                    return [{ textContent: 'Fecha' }];
                }
                return [];
            }
        };

        expect(findFirstTripFormErrorElement(root)).toEqual({
            textContent: 'Origen inválido'
        });
        expect(TRIP_FORM_ERROR_SELECTORS[0]).toBe('.trip-error');
    });
});
