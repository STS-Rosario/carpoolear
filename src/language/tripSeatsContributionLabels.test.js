import { describe, expect, it } from 'vitest';
import messages from './i18n';

const TRIP_CONTRIBUTION_IMPORTANT_FIRST_PARAGRAPH =
    'La contribución máxima es gastos de combustible + peaje dividido por la cantidad de asientos del auto. Durante la coordinación previa al viaje, cualquier persona puede indicar que se haga la división con tickets de combustible y peaje en mano.';
const TRIP_CONTRIBUTION_IMPORTANT_SECOND_PARAGRAPH =
    'Al pedir una contribución por encima de la máxima, es posible que el viaje sea considerado con fin de lucro y por lo tanto un transporte ilegal de pasajeros, pudiendo ser invalidado el seguro particular automotor y la cobertura contra terceros asociada. Tengamos un buen viaje cuidándonos entre todos :D';

describe('inclusive trip seating and contribution labels', () => {
    it('uses legacy maximum contribution guidance in trip creation importante notice', () => {
        ['arg', 'chl'].forEach((locale) => {
            expect(messages[locale].tripContributionImportantBody).toContain(
                `<p>${TRIP_CONTRIBUTION_IMPORTANT_FIRST_PARAGRAPH}</p>`
            );
            expect(messages[locale].tripContributionImportantBody).toContain(
                `<p>${TRIP_CONTRIBUTION_IMPORTANT_SECOND_PARAGRAPH}</p>`
            );
            expect(messages[locale].tripContributionImportantBody).not.toMatch(
                /Esta plataforma está destinada/i
            );
            expect(messages[locale].tripContributionImportantBody).not.toMatch(
                /sugerid/i
            );
        });
    });

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

    it('uses legacy maximum contribution guidance in English trip creation importante notice', () => {
        expect(messages.en.tripContributionImportantBody).toContain(
            '<p>The maximum contribution is fuel costs plus tolls divided by the number of seats in the car.'
        );
        expect(messages.en.tripContributionImportantBody).toContain(
            "Let's have a good trip by taking care of each other :D</p>"
        );
        expect(messages.en.tripContributionImportantBody).not.toMatch(
            /This platform is for shared trips/i
        );
        expect(messages.en.tripContributionImportantBody).not.toMatch(
            /suggested/i
        );
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
