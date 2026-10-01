import { describe, expect, it } from 'vitest';
import messages from './i18n';

const TITLE_ES = 'Posible exceso de contribución';
const BODY_ES =
    'Detectamos un posible exceso de contribución. Te comentamos que está prohibido pedir una contribución mayor a la máxima estipulada, y de ser así, resultará en una suspensión de la cuenta. Si no es así, te pedimos disculpas, es un checkeo automático que puede fallar. Muchas gracias por hacer Carpoolear más justo.';

describe('trip creation contribution excess modal copy', () => {
    it.each(['arg', 'chl'])('uses the agreed Spanish copy in %s', (locale) => {
        expect(messages[locale].tripContributionExcessModalTitle).toBe(TITLE_ES);
        expect(messages[locale].tripContributionExcessModalBody).toBe(BODY_ES);
        expect(messages[locale].tripContributionExcessModalConfirm).toBe('Entendido');
    });

    it('uses the English copy in en', () => {
        expect(messages.en.tripContributionExcessModalTitle).toBe(
            'Possible contribution excess'
        );
        expect(messages.en.tripContributionExcessModalBody).toBe(
            'We detected a possible contribution excess. Please note that asking for a contribution higher than the stipulated maximum is prohibited and, if that is the case, it will result in an account suspension. If that is not the case, we apologize: this is an automatic check that can fail. Thank you very much for making Carpoolear fairer.'
        );
        expect(messages.en.tripContributionExcessModalConfirm).toBe('Got it');
    });
});
