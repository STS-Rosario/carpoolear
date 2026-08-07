import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('resultadosCercanosDescripcion i18n', () => {
    it.each(['arg', 'chl'])(
        '%s locale explains nearby results are ±3 days from the chosen date',
        (locale) => {
            expect(messages[locale].resultadosCercanosDescripcion).toBe(
                'Viajes cercanos a la fecha que elegiste (+- 3 días), revisá bien la fecha del viaje'
            );
        }
    );

    it('en locale explains nearby results are ±3 days from the chosen date', () => {
        expect(messages.en.resultadosCercanosDescripcion).toBe(
            'Nearby trips around the date you chose (± 3 days), double-check the trip date'
        );
    });
});
