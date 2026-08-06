import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip characteristics labels', () => {
    it('uses Características instead of Condiciones for trip detail and create/edit', () => {
        expect(messages.arg.tripDetailConditions).toBe('Características');
        expect(messages.en.tripDetailConditions).toBe('Characteristics');
        expect(messages.arg.preferenciasViaje).toBe('Características');
        expect(messages.chl.preferenciasViaje).toBe('Características');
        expect(messages.en.preferenciasViaje).toBe('Characteristics');
        expect(messages.arg.tripDetailConditions).not.toBe('Condiciones');
        expect(messages.arg.preferenciasViaje).not.toBe('Preferencias del viaje');
    });
});
