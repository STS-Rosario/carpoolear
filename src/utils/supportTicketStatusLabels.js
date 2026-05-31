/** i18n keys for SupportTicket.status values */
export const TICKET_STATUS_LABEL_KEYS = {
    Open: 'estadoPendiente',
    'Esperando respuesta': 'esperaUsuarioResponda',
    'En revision': 'estadoPendienteRevision',
    'Necesita revisión': 'estadoNecesitaRevision',
    Resuelto: 'estadoResuelto',
    Cerrado: 'estadoCerrado'
};

/** i18n keys for user-facing ticket list/detail (waiting on user copy). */
export const USER_TICKET_STATUS_LABEL_KEYS = {
    ...TICKET_STATUS_LABEL_KEYS,
    'Esperando respuesta': 'ticketEstadoEsperandoTuRespuesta'
};

/** Completed ticket statuses that should not use admin attention styling. */
export const SOLVED_TICKET_STATUSES = new Set(['Resuelto', 'Cerrado']);

export const SOLVED_TICKET_NEUTRAL_CLASS = 'label label-default';

export const TICKET_STATUS_CLASS_MAP = {
    Cerrado: SOLVED_TICKET_NEUTRAL_CLASS,
    Resuelto: SOLVED_TICKET_NEUTRAL_CLASS,
    'Esperando respuesta': 'label label-warning',
    'En revision': 'label label-info',
    'Necesita revisión': 'label label-danger'
};
