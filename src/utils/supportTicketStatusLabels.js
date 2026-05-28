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

export const TICKET_STATUS_CLASS_MAP = {
    Cerrado: 'label label-default',
    Resuelto: 'label label-success',
    'Esperando respuesta': 'label label-warning',
    'En revision': 'label label-info',
    'Necesita revisión': 'label label-danger'
};
