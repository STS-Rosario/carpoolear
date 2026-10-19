import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip detail driver message label', () => {
    it('uses Mensaje de quien conduce instead of Mensaje del conductor', () => {
        expect(messages.arg.tripDetailDriverMessage).toBe(
            'Mensaje de quien conduce'
        );
        expect(messages.arg.tripDetailDriverMessage).not.toBe(
            'Mensaje del conductor'
        );
    });

    it('uses Mensaje de quien busca viaje for passenger trips', () => {
        expect(messages.arg.tripDetailPassengerMessage).toBe(
            'Mensaje de quien busca viaje'
        );
        expect(messages.en.tripDetailPassengerMessage).toBe(
            'Message from the person looking for a trip'
        );
    });
});
