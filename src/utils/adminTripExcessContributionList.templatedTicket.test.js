import { describe, expect, it } from 'vitest';
import i18n from '../i18n';
import {
    EXCESS_CONTRIBUTION_SANCTION_DAYS,
    buildExcessContributionTemplatedTicketPayload,
    excessContributionSanctionEndDate
} from './adminTripExcessContributionList';

const BASE = 'https://carpoolear.com.ar/app';
const NOW = new Date(2026, 9, 1, 10, 30);

function item(overrides = {}) {
    return { id: 99, user_id: 15, maximum_seat_price_cents: 1200000, ...overrides };
}

function translate(locale) {
    return (key, params) => i18n.global.t(key, locale, params || {});
}

describe('excessContributionSanctionEndDate', () => {
    it('sanctions for 7 days by default', () => {
        expect(EXCESS_CONTRIBUTION_SANCTION_DAYS).toBe(7);
        expect(excessContributionSanctionEndDate(NOW)).toBe('08/10/2026');
    });

    it('formats today plus the given days as dd/mm/yyyy across month and year boundaries', () => {
        expect(excessContributionSanctionEndDate(new Date(2026, 11, 28), 7)).toBe('04/01/2027');
        expect(excessContributionSanctionEndDate(new Date(2026, 0, 2), 30)).toBe('01/02/2026');
    });
});

describe('buildExcessContributionTemplatedTicketPayload', () => {
    it('builds an excess-contribution ticket for the item user with the i18n subject and interpolated template message', () => {
        const t = (key, params) => (params ? `t:${key}:${JSON.stringify(params)}` : `t:${key}`);

        expect(
            buildExcessContributionTemplatedTicketPayload(item(), t, {
                webAppBaseUrl: `${BASE}/`,
                now: NOW
            })
        ).toEqual({
            user_id: 15,
            type: 'excess_contribution',
            subject: 't:ticketTypeExcessContribution',
            message_markdown: `t:excessContributionTemplatedTicketMessage:${JSON.stringify({
                tripLink: `[${BASE}/trips/99](${BASE}/trips/99)`,
                maxAmount: '$12000',
                bannedUntil: '08/10/2026',
                termsLink: `[${BASE}/terminos](${BASE}/terminos)`
            })}`,
            trip_id: 99
        });
    });

    it('uses a custom sanction length for the banned until date', () => {
        const payload = buildExcessContributionTemplatedTicketPayload(item(), translate('arg'), {
            webAppBaseUrl: BASE,
            now: NOW,
            sanctionDays: 14
        });

        expect(payload.message_markdown).toContain('hasta el día 15/10/2026 ');
    });

    it('renders the Spanish template as markdown paragraphs', () => {
        const payload = buildExcessContributionTemplatedTicketPayload(item(), translate('arg'), {
            webAppBaseUrl: BASE,
            now: NOW
        });

        expect(payload.message_markdown).toBe(
            [
                `Hola, cómo estás? Detectamos un exceso en el monto de contribución por persona en tu viaje [${BASE}/trips/99](${BASE}/trips/99).`,
                'El monto máximo según la Calculadora Carpoolear es $12000 y pediste más. Esto va contra las reglas como es explicado en la plataforma y al crear el viaje, por lo que esta es una notificación de la sanción.',
                'La sanción es hasta el día 08/10/2026 y al finalizar, para poder volver a utilizar tu cuenta, deberás abonar el costo de reactivación de la cuenta. Este costo sirve para pagar el tiempo que le toma al equipo de Carpoolear en investigar y procesar tu sanción.',
                `Te recomendamos leer los términos y condiciones para evitar futuras sanciones: [${BASE}/terminos](${BASE}/terminos).`,
                'Equipo Carpoolear'
            ].join('\n\n')
        );
    });

    it('renders the English template as markdown paragraphs', () => {
        const payload = buildExcessContributionTemplatedTicketPayload(item(), translate('en'), {
            webAppBaseUrl: BASE,
            now: NOW
        });

        expect(payload.message_markdown).toBe(
            [
                `Hi, how are you? We detected an excess in the per-person contribution amount on your trip [${BASE}/trips/99](${BASE}/trips/99).`,
                'The maximum amount according to the Carpoolear Calculator is $12000 and you asked for more. This goes against the rules, as explained on the platform and when creating the trip, so this is a notice of the sanction.',
                'The sanction lasts until 08/10/2026 and, once it ends, to be able to use your account again you will have to pay the account reactivation fee. This fee pays for the time it takes the Carpoolear team to investigate and process your sanction.',
                `We recommend reading the terms and conditions to avoid future sanctions: [${BASE}/terminos](${BASE}/terminos).`,
                'The Carpoolear Team'
            ].join('\n\n')
        );
    });

    it('says the maximum is not available when the trip has no maximum seat price', () => {
        const payload = buildExcessContributionTemplatedTicketPayload(
            item({ maximum_seat_price_cents: null }),
            translate('arg'),
            { webAppBaseUrl: BASE, now: NOW }
        );

        expect(payload.message_markdown).toContain(
            `es ${i18n.global.t('noDisponible', 'arg')} y pediste más.`
        );
    });
});
