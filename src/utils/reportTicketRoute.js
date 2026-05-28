/** Support ticket type for user/trip reports (denuncia). */
export const REPORT_TICKET_TYPE = 'report';

export function buildReportTicketRoute({ subject } = {}) {
    const query = { category: REPORT_TICKET_TYPE };
    if (subject) {
        query.subject = subject;
    }
    return { name: 'ticket-new', query };
}

export function reportTicketSubjectForUser({ id, name }) {
    return `Denuncia usuario #${id} - ${name}`;
}

export function reportTicketSubjectForTrip({ id, user }) {
    return `Denuncia viaje #${id} - conductor ${user.name} (#${user.id})`;
}
