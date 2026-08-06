import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('inclusive trip seating and contribution labels', () => {
    it('asks how many people travel and refers to quien conduce in contribution copy', () => {
        expect(messages.arg.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántas personas viajan?'
        );
        expect(messages.chl.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántas personas viajan?'
        );
        expect(messages.arg.precioAsiento).toBe(
            'Contribución por persona (incluída quien conduce)'
        );
        expect(messages.arg.tripCreationStepSeatsQuestion).not.toBe(
            '¿Cuántos viajan?'
        );
        expect(messages.arg.precioAsiento).not.toMatch(/incluído el conductor/i);
    });
});
