import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('admin exceso de contribución list column labels', () => {
    it.each(['arg', 'chl'])('uses compact Spanish headers with full-text tooltips for %s', (locale) => {
        expect(messages[locale].contribucionMaximaColumnaCorta).toBe('Cont. Máxima');
        expect(messages[locale].contribucionMaximaColumna).toBe('Contribución máxima');
        expect(messages[locale].contribucionPromedioCorta).toBe('Cont. Promedio');
        expect(messages[locale].contribucionPromedio).toBe('Contribución promedio');
        expect(messages[locale].contribucionSolicitadaCorta).toBe('Cont. Solicitada');
        expect(messages[locale].contribucionSolicitada).toBe('Contribución solicitada');
        expect(messages[locale].contribucionSospechadaCorta).toBe('Cont. Sospechada');
        expect(messages[locale].contribucionSospechada).toBe('Contribución sospechada');
        expect(messages[locale].ticketColumnaCorta).toBe('Ticket');
        expect(messages[locale].ticketSoporte).toBe('Ticket de soporte');
        expect(messages[locale].estado).toBe('Estado');
        expect(messages[locale].acciones).toBe('Acciones');
    });

    it('uses compact English headers with full-text tooltips', () => {
        expect(messages.en.contribucionMaximaColumnaCorta).toBe('Max. cont.');
        expect(messages.en.contribucionMaximaColumna).toBe('Maximum contribution');
        expect(messages.en.contribucionPromedioCorta).toBe('Avg. cont.');
        expect(messages.en.contribucionPromedio).toBe('Average contribution');
        expect(messages.en.contribucionSolicitadaCorta).toBe('Req. cont.');
        expect(messages.en.contribucionSolicitada).toBe('Requested contribution');
        expect(messages.en.contribucionSospechadaCorta).toBe('Susp. cont.');
        expect(messages.en.contribucionSospechada).toBe('Suspected contribution');
        expect(messages.en.ticketColumnaCorta).toBe('Ticket');
        expect(messages.en.ticketSoporte).toBe('Support ticket');
        expect(messages.en.estado).toBe('Status');
        expect(messages.en.acciones).toBe('Actions');
    });
});
