const EXPLANATION_LINK =
    '[acá](https://docs.google.com/document/d/1sz_p3LS5AbcADtxxRByYTYAK3DGB73arvMRryF_SvAs/edit)';
const MPAGO_LINK = '[https://mpago.la/2Fq9F9U](https://mpago.la/2Fq9F9U)';
const SITE_LINK = '[www.carpoolear.com.ar](http://www.carpoolear.com.ar/)';

const DEFAULT_USER_NAME = 'Nombre de persona';
const DEFAULT_AGENT_NAME = 'Nombre Mesa de ayuda del equipo Carpoolear';
const DEFAULT_TRIP_DATE = 'FECHA/MES';
const DEFAULT_ORIGIN = 'ORIGEN';
const DEFAULT_DESTINATION = 'DESTINO';

const SHARED_INTRO = [
    'Hola {userName}',
    'Soy {agentName}, te escribo para notificarte que se te suspende de la plataforma Carpoolear por **no respetar la regla de contribución máxima**.',
    'Se recibió una denuncia por el viaje del {tripDate} , {origin} - {destination}, donde indicas monto de contribución por fuera del máximo que te permite la calculadora para dicho tramo y la cantidad de asientos totales del auto para el viaje (5 o 4, según este habilitado o no el asiento del medio atrás) . Cuando cargas ese monto en el campo de contribución te sale el mensaje de advertencia en el incumplimiento de la regla y te hace modificar ese monto para que estés dentro de las reglas.',
    '**La máxima contribución** que se puede pedir a una persona es gastos de combustible y peaje divididos por la cantidad de asientos totales del auto para el viaje (5 o 4, según este habilitado o no el asiento del medio atrás)',
    'La regla de contribución máxima está presente en los términos y condiciones, al momento de cargar un viaje, y en tope de la calculadora al completar el campo de contribución ... por lo que ninguna persona que quiera formar parte de la comunidad puede aducir ignorancia al respecto.'
].join('\n\n');

const SHARED_CLOSING = [
    'Cualquier duda, nos preguntas.',
    'Tene en cuenta que el tiempo de respuesta de la mesa de ayuda de Carpoolear es dentro de las 48hs hábiles',
    `Para más información respecto comunidad Carpoolear, podés encontrar abundante información de qué se trata en nuestro sitio web ${SITE_LINK}`,
    'Saludos'
].join('\n\n');

const FIRST_BODY = [
    SHARED_INTRO,
    '**Al ser el primer incuplimiento, entendemos que quizás no hayas entendido la regla o hayas cometido algún error al sacar el monto de contribución...**',
    'Es por eso que que sólo basta que nos confirmes que vas a participar bajo las reglas de Carpoolear y abonar el costo de reactivación de cuenta',
    'Para poder reactivarla se tiene que adjuntar el comprobante de pago de reactivación de cuenta',
    MPAGO_LINK,
    'Un segundo incumplimiento, implica 3 meses de suspensión.',
    'En caso de un tercer incumplimiento, ya corresponde suspensión de por vida.',
    `Si querés saber por qué una regla de contribución máxima, podés leer la explicación ${EXPLANATION_LINK}`,
    SHARED_CLOSING
].join('\n\n');

const SECOND_BODY = [
    SHARED_INTRO,
    '**Al ser el segundo incumplimiento, implica 3 meses de suspension.**',
    `Cumplido ese plazo, nos tenes que escribir para confirmar que vas a participar bajo las reglas de Carpoolear y abonar el costo de reactivación de cuenta ${MPAGO_LINK} adjuntando el comprobante. Lo podes pagar ahora o al pasar los 3 meses, su costo depende del valor del combustible.`,
    'En caso de un tercer incumplimiento, ya corresponde suspensión de por vida.',
    `Si querés saber por qué una regla de contribución máxima, podés leer la explicación ${EXPLANATION_LINK}`,
    SHARED_CLOSING
].join('\n\n');

const THIRD_BODY = [
    SHARED_INTRO,
    '**Al ser el tercer incumplimiento, corresponde la suspensión de por vida.**',
    'NOTA/ ya habías sido notificado en las anteriores suspensiones que si había una tercera ya sería de por vida.',
    SHARED_CLOSING
].join('\n\n');

export const EXCESS_CONTRIBUTION_TICKET_TEMPLATES = [
    {
        id: 'first',
        labelKey: 'excessContributionTicketTemplateFirst',
        markdown: FIRST_BODY
    },
    {
        id: 'second',
        labelKey: 'excessContributionTicketTemplateSecond',
        markdown: SECOND_BODY
    },
    {
        id: 'third',
        labelKey: 'excessContributionTicketTemplateThird',
        markdown: THIRD_BODY
    }
];

function templateById(templateId) {
    return EXCESS_CONTRIBUTION_TICKET_TEMPLATES.find((template) => template.id === templateId);
}

function filledOrDefault(value, fallback) {
    const text = value == null ? '' : String(value).trim();
    return text || fallback;
}

export function formatExcessContributionTicketTripDate(tripDate) {
    const match = String(tripDate || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
        return DEFAULT_TRIP_DATE;
    }
    return `${match[3]}/${match[2]}`;
}

export function buildExcessContributionTicketTemplateMessage(templateId, item, options = {}) {
    const template = templateById(templateId);
    if (!template) {
        return '';
    }
    const vars = {
        userName: filledOrDefault(item && item.user_name, DEFAULT_USER_NAME),
        agentName: filledOrDefault(options.agentName, DEFAULT_AGENT_NAME),
        tripDate: formatExcessContributionTicketTripDate(item && item.trip_date),
        origin: filledOrDefault(item && item.from_town, DEFAULT_ORIGIN),
        destination: filledOrDefault(item && item.to_town, DEFAULT_DESTINATION)
    };

    return template.markdown
        .replaceAll('{userName}', vars.userName)
        .replaceAll('{agentName}', vars.agentName)
        .replaceAll('{tripDate}', vars.tripDate)
        .replaceAll('{origin}', vars.origin)
        .replaceAll('{destination}', vars.destination);
}

export function excessContributionTemplatedTicketNewRoute(item, templateId, t, options = {}) {
    return {
        name: 'admin-support-ticket-new',
        query: {
            userId: String(item.user_id),
            userName: String(item.user_name || ''),
            type: 'excess_contribution',
            subject: t('ticketTypeExcessContribution'),
            tripId: String(item.id),
            message: buildExcessContributionTicketTemplateMessage(templateId, item, options)
        }
    };
}
