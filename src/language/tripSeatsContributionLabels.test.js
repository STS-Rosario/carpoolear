import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('inclusive trip seating and contribution labels', () => {
    it('uses promedio wording for trip creation contribution accordion in Spanish locales', () => {
        ['arg', 'chl'].forEach((locale) => {
            expect(messages[locale].tripContributionSuggested).toBe(
                'Contribución promedio: $ {amount}'
            );
            expect(messages[locale].tripContributionHowCalculated).toBe(
                '¿Cómo se calcula la contribución promedio?'
            );
            expect(messages[locale].tripContributionSuggested).not.toMatch(
                /sugerida/i
            );
            expect(messages[locale].tripContributionHowCalculated).not.toMatch(
                /sugerida/i
            );
        });
    });

    it('uses average wording for trip creation contribution accordion in English', () => {
        expect(messages.en.tripContributionSuggested).toBe(
            'Average contribution: $ {amount}'
        );
        expect(messages.en.tripContributionHowCalculated).toBe(
            'How is the average contribution calculated?'
        );
        expect(messages.en.tripContributionSuggested).not.toMatch(/suggested/i);
        expect(messages.en.tripContributionHowCalculated).not.toMatch(
            /suggested/i
        );
    });

    it('asks how many seats are offered and refers to quien conduce in contribution copy', () => {
        expect(messages.arg.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántos lugares ofrecés en este viaje?'
        );
        expect(messages.chl.tripCreationStepSeatsQuestion).toBe(
            '¿Cuántos lugares ofrecés en este viaje?'
        );
        expect(messages.arg.precioAsiento).toBe(
            'Contribución por persona (incluída quien conduce)'
        );
        expect(messages.arg.precioAsiento).not.toMatch(/incluído el conductor/i);
    });
});
