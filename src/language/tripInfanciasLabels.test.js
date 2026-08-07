import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('trip kids preference labels', () => {
    it('uses infancias instead of niños in Spanish locales', () => {
        expect(messages.arg.aceptaNinos).toBe('Acepta infancias');
        expect(messages.arg.noninos).toBe('No infancias');
        expect(messages.arg.preferenciaPermitidoNinos).toBe('Permitido infancias');
        expect(messages.chl.aceptaNinos).toBe('Acepta infancias');
        expect(messages.chl.noninos).toBe('No infancias');
        expect(messages.chl.preferenciaPermitidoNinos).toBe(
            'Permitido infancias'
        );
        expect(messages.arg.aceptaNinos).not.toMatch(/niños/i);
        expect(messages.arg.noninos).not.toMatch(/niños/i);
        expect(messages.arg.preferenciaPermitidoNinos).not.toMatch(/niños/i);
    });
});
