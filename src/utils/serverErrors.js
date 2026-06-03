export const SERVER_UNAVAILABLE_ERROR = {
    data: { message: 'server_unavailable' },
    status: 0,
    serverUnavailable: true
};

export function isMaintenanceResponse(status, data) {
    return status === 503 && data && data.maintenance === true;
}

export function isServerUnavailableHttpStatus(status) {
    return status === 502 || status === 503 || status === 504;
}

export function createServerUnavailableError() {
    return {
        data: { ...SERVER_UNAVAILABLE_ERROR.data },
        status: SERVER_UNAVAILABLE_ERROR.status,
        serverUnavailable: SERVER_UNAVAILABLE_ERROR.serverUnavailable
    };
}

export function isServerUnavailableApiError(error) {
    return Boolean(
        error &&
            (error.serverUnavailable === true ||
                (error.data &&
                    error.data.message === 'server_unavailable') ||
                error.message === 'server_unavailable')
    );
}
