import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('excess contribution ticket template copy', () => {
    it.each(['arg', 'chl'])('labels the three templates in Spanish for %s', (locale) => {
        expect(messages[locale].excessContributionTicketTemplateFirst).toBe('1er falta');
        expect(messages[locale].excessContributionTicketTemplateSecond).toBe('2da falta');
        expect(messages[locale].excessContributionTicketTemplateThird).toBe('3er falta');
        expect(messages[locale].crearTicket).toBe('Crear ticket');
        expect(messages[locale].plantillasModalTitulo).toBe('Elegir plantilla');
    });

    it('labels the three templates in English', () => {
        expect(messages.en.excessContributionTemplatedTicketButton).toBe('Create templated ticket');
        expect(messages.en.excessContributionTicketTemplateFirst).toBe('1st offense');
        expect(messages.en.excessContributionTicketTemplateSecond).toBe('2nd offense');
        expect(messages.en.excessContributionTicketTemplateThird).toBe('3rd offense');
    });
});
