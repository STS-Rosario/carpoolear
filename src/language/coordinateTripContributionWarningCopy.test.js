import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_CONDITIONAL = {
    coordinateTripContributionWarningDriver:
        'Recuerde no superar la contribución del viaje{amountPart} ya que el seguro automotor podría no cubrirlo en caso de accidentes y está contra las reglas de uso de Carpoolear, por lo que podrá ser suspendido',
    coordinateTripContributionWarningPassengerPrefix:
        'Recuerde que el conductor deberá pedir la contribución establecida{amountPart}, ya que si se pide más el seguro automotor podría no cubrirlos en caso de accidentes, y está contra las reglas de uso de Carpoolear. Si lo hace, ',
    recuerdeReglaContribucionMaximaExcedida:
        'Recuerde que exceder la contribución máxima está fuera de las reglas de Carpoolear, el seguro automotor podría no cubrirlo en caso de accidente, y será suspendido de la plataforma'
};

const ENGLISH_CONDITIONAL = {
    coordinateTripContributionWarningDriver:
        'Remember not to exceed the trip contribution{amountPart}, since auto insurance might not cover it in case of accidents and it is against Carpoolear usage rules, so you may be suspended',
    coordinateTripContributionWarningPassengerPrefix:
        'Remember that the driver must request the established contribution{amountPart}, because if more is requested auto insurance might not cover you in case of accidents, and it is against Carpoolear usage rules. If it happens, ',
    recuerdeReglaContribucionMaximaExcedida:
        'Remember that exceeding the maximum contribution is against Carpoolear rules, auto insurance might not cover it in case of an accident, and you will be suspended from the platform'
};

function messageForLocale(locale, key) {
    return messages[locale][key] ?? messages.arg[key];
}

describe('coordinate trip contribution insurance warning copy', () => {
    it.each(['arg', 'chl'])('uses conditional Spanish insurance wording in %s', (locale) => {
        Object.entries(SPANISH_CONDITIONAL).forEach(([key, expected]) => {
            expect(messageForLocale(locale, key)).toBe(expected);
        });
    });

    it('uses conditional English insurance wording in en', () => {
        expect(messages.en).toMatchObject(ENGLISH_CONDITIONAL);
    });

    it.each(['arg', 'chl', 'en'])('does not use definitive insurance denial in %s', (locale) => {
        const keys = [
            'coordinateTripContributionWarningDriver',
            'coordinateTripContributionWarningPassengerPrefix',
            'recuerdeReglaContribucionMaximaExcedida'
        ];
        keys.forEach((key) => {
            const text = messageForLocale(locale, key);
            expect(text).not.toMatch(/no lo cubrirá|no los cubrirá|will not cover/i);
        });
    });
});
