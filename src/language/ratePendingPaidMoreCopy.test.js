import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_QUESTION = '¿Pagaste más de {amount}?';
const SPANISH_LEGEND =
    'Esta información sólo la verá el equipo de Carpoolear, no será pública. Queremos hacer un Carpoolear más justo, y eso significa que sólo se dividan los gastos, que es el valor de la contribución por persona en el detalle del viaje. Si tuviste que pagar más, avisanos para poder avisarle a la persona que creó el viaje que sólo se pueden dividir gastos.';
const SPANISH_REQUIRED = 'Respondé si pagaste más de la contribución.';

const ENGLISH_QUESTION = 'Did you pay more than {amount}?';
const ENGLISH_LEGEND =
    'Only the Carpoolear team will see this; it will not be public. We want a fairer Carpoolear, and that means only splitting costs, which is the per-person contribution on the trip details. If you had to pay more, tell us so we can let the person who created the trip know that only costs can be split.';
const ENGLISH_REQUIRED = 'Please answer whether you paid more than the contribution.';

describe('rate pending paid-more copy', () => {
    it.each(['arg', 'chl'])('uses the agreed Spanish copy in %s', (locale) => {
        expect(messages[locale].ratePendingPaidMoreThanContribution).toBe(SPANISH_QUESTION);
        expect(messages[locale].ratePendingPaidMoreLegend).toBe(SPANISH_LEGEND);
        expect(messages[locale].ratePendingPaidMoreRequired).toBe(SPANISH_REQUIRED);
    });

    it('uses the English copy in en', () => {
        expect(messages.en.ratePendingPaidMoreThanContribution).toBe(ENGLISH_QUESTION);
        expect(messages.en.ratePendingPaidMoreLegend).toBe(ENGLISH_LEGEND);
        expect(messages.en.ratePendingPaidMoreRequired).toBe(ENGLISH_REQUIRED);
    });
});
