const STATUS_BY_REQUEST_STATE = {
    0: { className: 'seat-request-status--pending', labelKey: 'solicitudPendiente' },
    1: { className: 'seat-request-status--accepted', labelKey: 'solicitudAceptada' },
    2: { className: 'seat-request-status--rejected', labelKey: 'solicitudRechazada' }
};

function getSeatRequestStatus(requestState) {
    return STATUS_BY_REQUEST_STATE[requestState] || null;
}

export function getSeatRequestStatusClass(requestState) {
    const status = getSeatRequestStatus(requestState);
    return status ? status.className : null;
}

export function getSeatRequestStatusLabelKey(requestState) {
    const status = getSeatRequestStatus(requestState);
    return status ? status.labelKey : null;
}
