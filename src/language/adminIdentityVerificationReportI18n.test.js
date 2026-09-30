import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('admin identity verification report nav i18n', () => {
    it('arg locale labels the admin nav entry in Spanish', () => {
        expect(messages.arg.adminNavReporteVerificaciones).toBe('Reporte de verificaciones');
    });

    it.each(['chl', 'en'])('%s locale defines the nav entry label', (locale) => {
        expect(messages[locale].adminNavReporteVerificaciones).toBeTruthy();
    });
});
