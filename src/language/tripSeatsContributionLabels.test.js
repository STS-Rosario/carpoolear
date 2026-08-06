import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('inclusive trip seating and contribution labels', () => {
    it('asks how many seats are offered and refers to quien conduce in contribution copy', () => {
        expect(messages.arg.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántos lugares ofrecés en este viaje?'
        );
        expect(messages.chl.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántos lugares ofrecés en este viaje?'
        );
        expect(messages.arg.precioAsiento).toBe(
            'Contribución por persona (incluída quien conduce)'
        );
        expect(messages.arg.precioAsiento).not.toMatch(/incluído el conductor/i);
    });
});
