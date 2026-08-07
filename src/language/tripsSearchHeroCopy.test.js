import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trips search hero copy', () => {
    it('uses Compartí tu viaje in the arg tagline', () => {
        expect(messages.arg.compartiAutoTagline).toBe(
            'Compartí tu viaje, ahorrá dinero y cuidá el planeta'
        );
    });
});
