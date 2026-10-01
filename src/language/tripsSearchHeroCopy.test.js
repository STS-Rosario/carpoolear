import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trips search hero copy', () => {
    it('uses Compartí tu viaje in the arg tagline', () => {
        expect(messages.arg.compartiAutoTagline).toBe(
            'Compartí tu viaje, ahorrá dinero y cuidá el planeta'
        );
    });

    it('renders the role toggle copy as Busco conductores in arg and en', () => {
        expect(messages.arg.buscoConductor).toBe('Busco conductores');
        expect(messages.en.buscoConductor).toBe('Looking for drivers');
    });
});
