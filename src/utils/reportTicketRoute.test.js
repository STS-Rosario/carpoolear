import { describe, it, expect } from 'vitest';
import {
    REPORT_TICKET_TYPE,
    buildReportTicketRoute,
    reportTicketSubjectForUser,
    reportTicketSubjectForTrip
} from './reportTicketRoute';

describe('reportTicketRoute', () => {
    it('uses report as the denuncia ticket category', () => {
        expect(REPORT_TICKET_TYPE).toBe('report');
    });

    it('builds ticket-new route with report category and optional subject', () => {
        expect(buildReportTicketRoute()).toEqual({
            name: 'ticket-new',
            query: { category: 'report' }
        });
        expect(
            buildReportTicketRoute({ subject: 'Denuncia usuario #12 - Ana' })
        ).toEqual({
            name: 'ticket-new',
            query: {
                category: 'report',
                subject: 'Denuncia usuario #12 - Ana'
            }
        });
    });

    it('builds subject lines for user and trip reports', () => {
        expect(reportTicketSubjectForUser({ id: 5, name: 'Juan' })).toBe(
            'Denuncia usuario #5 - Juan'
        );
        expect(
            reportTicketSubjectForTrip({
                id: 99,
                user: { id: 5, name: 'Juan' }
            })
        ).toBe('Denuncia viaje #99 - conductor Juan (#5)');
    });
});
