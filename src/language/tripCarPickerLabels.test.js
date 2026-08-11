import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('car picker placeholder labels', () => {
    it('asks to choose a car instead of a plate', () => {
        expect(messages.arg.elegiPatente).toBe('Elegí un auto');
        expect(messages.chl.elegiPatente).toBe('Elegí un auto');
        expect(messages.en.elegiPatente).toBe('Choose a car');
        expect(messages.arg.elegiPatente).not.toMatch(/patente/i);
    });
});
