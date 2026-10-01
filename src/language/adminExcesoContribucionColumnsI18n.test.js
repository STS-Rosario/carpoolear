import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('admin exceso de contribución LLM check column labels', () => {
    it.each(['arg', 'chl'])('labels the new columns in Spanish for %s', (locale) => {
        expect(messages[locale].contribucionSospechada).toBe('Contribución sospechada');
        expect(messages[locale].telefonoEnDescripcion).toBe('Teléfono en descripción');
    });

    it('labels the new columns in English', () => {
        expect(messages.en.contribucionSospechada).toBe('Suspected contribution');
        expect(messages.en.telefonoEnDescripcion).toBe('Phone in description');
    });
});
