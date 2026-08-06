import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip characteristics labels', () => {
    it('uses Preferencias del viaje for create/edit preferences section', () => {
        expect(messages.arg.tripDetailConditions).toBe('Características');
        expect(messages.en.tripDetailConditions).toBe('Characteristics');
        expect(messages.arg.preferenciasViaje).toBe('Preferencias del viaje');
        expect(messages.chl.preferenciasViaje).toBe('Preferencias del viaje');
        expect(messages.en.preferenciasViaje).toBe('Trip preferences');
        expect(messages.arg.tripDetailConditions).not.toBe('Condiciones');
        expect(messages.arg.preferenciasViaje).not.toBe('Características');
    });
});
