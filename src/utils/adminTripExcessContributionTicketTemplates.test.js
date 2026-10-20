import { describe, expect, it } from 'vitest';
import i18n from '../i18n';
import {
    EXCESS_CONTRIBUTION_TICKET_TEMPLATES,
    buildExcessContributionTicketTemplateMessage,
    excessContributionTemplatedTicketNewRoute,
    formatExcessContributionTicketTripDate
} from './adminTripExcessContributionTicketTemplates.js';

const ITEM = {
    id: 321,
    user_id: 15,
    user_name: 'Ana Pérez',
    from_town: 'Rosario',
    to_town: 'Córdoba',
    trip_date: '2026-10-01 10:30:00'
};

const EXPLANATION_URL =
    'https://docs.google.com/document/d/1sz_p3LS5AbcADtxxRByYTYAK3DGB73arvMRryF_SvAs/edit';
const MPAGO_URL = 'https://mpago.la/2Fq9F9U';
const SITE_URL = 'http://www.carpoolear.com.ar/';

function t(key, params) {
    return i18n.global.t(key, 'arg', params || {});
}

function message(templateId, overrides = {}, options = {}) {
    return buildExcessContributionTicketTemplateMessage(
        templateId,
        { ...ITEM, ...overrides },
        { agentName: 'Lucía Gómez', ...options }
    );
}

describe('excess contribution ticket templates', () => {
    it('exposes the three offense templates in order', () => {
        expect(EXCESS_CONTRIBUTION_TICKET_TEMPLATES.map((template) => template.id)).toEqual([
            'first',
            'second',
            'third'
        ]);
        expect(EXCESS_CONTRIBUTION_TICKET_TEMPLATES.map((template) => t(template.labelKey))).toEqual([
            '1er falta',
            '2da falta',
            '3er falta'
        ]);
    });

    it('formats the trip date as day/month for the FECHA/MES placeholder', () => {
        expect(formatExcessContributionTicketTripDate('2026-10-01 10:30:00')).toBe('01/10');
        expect(formatExcessContributionTicketTripDate(null)).toBe('FECHA/MES');
    });

    it('fills user, agent and trip placeholders and keeps markdown bold and links', () => {
        const markdown = message('first');

        expect(markdown.startsWith('Hola Ana Pérez')).toBe(true);
        expect(markdown).toContain('Soy Lucía Gómez, te escribo');
        expect(markdown).toContain('viaje del 01/10 , Rosario - Córdoba');
        expect(markdown).toContain('**no respetar la regla de contribución máxima**');
        expect(markdown).toContain('**La máxima contribución**');
        expect(markdown).toContain(`[${MPAGO_URL}](${MPAGO_URL})`);
        expect(markdown).toContain(`[acá](${EXPLANATION_URL})`);
        expect(markdown).toContain(`[www.carpoolear.com.ar](${SITE_URL})`);
        expect(markdown).toContain('Al ser el primer incuplimiento');
    });

    it('keeps placeholders when trip or names are missing so the admin can edit them', () => {
        const markdown = message(
            'first',
            { user_name: '', from_town: '', to_town: '', trip_date: null },
            { agentName: '' }
        );

        expect(markdown).toContain('Hola Nombre de persona');
        expect(markdown).toContain('Soy Nombre Mesa de ayuda del equipo Carpoolear,');
        expect(markdown).toContain('viaje del FECHA/MES , ORIGEN - DESTINO');
    });

    it('uses the second-offense body with the three-month suspension and inline payment link', () => {
        const markdown = message('second');

        expect(markdown).toContain('**Al ser el segundo incumplimiento, implica 3 meses de suspension.**');
        expect(markdown).toContain(
            `abonar el costo de reactivación de cuenta [${MPAGO_URL}](${MPAGO_URL}) adjuntando el comprobante`
        );
        expect(markdown).not.toContain('Al ser el primer incuplimiento');
    });

    it('uses the third-offense body with the lifetime suspension note', () => {
        const markdown = message('third');

        expect(markdown).toContain(
            '**Al ser el tercer incumplimiento, corresponde la suspensión de por vida.**'
        );
        expect(markdown).toContain(
            'NOTA/ ya habías sido notificado en las anteriores suspensiones que si había una tercera ya sería de por vida.'
        );
        expect(markdown).not.toContain(MPAGO_URL);
    });

    it('builds the new-ticket route with category, editable template message and trip', () => {
        expect(
            excessContributionTemplatedTicketNewRoute(ITEM, 'first', t, { agentName: 'Lucía Gómez' })
        ).toEqual({
            name: 'admin-support-ticket-new',
            query: {
                userId: '15',
                userName: 'Ana Pérez',
                type: 'excess_contribution',
                subject: 'Exceso de contribución',
                tripId: '321',
                message: message('first')
            }
        });
    });
});
