import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH = {
    tripContributionExcessModalTitle: 'Posible exceso de contribución',
    tripContributionExcessModalBodyWarning:
        'Detectamos un posible exceso de contribución. Te comentamos que está prohibido pedir una contribución mayor a la máxima estipulada, y de ser así, resultará en una suspensión de la cuenta.',
    tripContributionExcessModalBodyApology:
        'Si no es así, te pedimos disculpas, es un checkeo automático que puede fallar.',
    tripContributionExcessModalBodyThanks: 'Muchas gracias por hacer Carpoolear más justo.',
    tripContributionExcessModalConfirm: 'Entendido'
};

const ENGLISH = {
    tripContributionExcessModalTitle: 'Possible contribution excess',
    tripContributionExcessModalBodyWarning:
        'We detected a possible contribution excess. Please note that asking for a contribution higher than the stipulated maximum is prohibited and, if that is the case, it will result in an account suspension.',
    tripContributionExcessModalBodyApology:
        'If that is not the case, we apologize: this is an automatic check that can fail.',
    tripContributionExcessModalBodyThanks: 'Thank you very much for making Carpoolear fairer.',
    tripContributionExcessModalConfirm: 'Got it'
};

describe('trip creation contribution excess modal copy', () => {
    it.each(['arg', 'chl'])('uses the agreed Spanish copy, one key per paragraph, in %s', (locale) => {
        expect(messages[locale]).toMatchObject(SPANISH);
    });

    it('uses the English copy, one key per paragraph, in en', () => {
        expect(messages.en).toMatchObject(ENGLISH);
    });

    it.each(['arg', 'chl', 'en'])('drops the single-paragraph body key in %s', (locale) => {
        expect(messages[locale].tripContributionExcessModalBody).toBeUndefined();
    });
});
