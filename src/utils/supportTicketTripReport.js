function normalizeWebAppBaseUrl(webAppBaseUrl) {
    return String(webAppBaseUrl || '').replace(/\/$/, '');
}

const TRIP_REPORT_MESSAGE_SEPARATOR = '====';

function buildTripReportSupportTicketContext({
    tripId,
    tripUrl,
    driverName,
    driverProfileUrl
}) {
    const lines = [`Viaje ID: ${tripId}`];

    if (tripUrl) {
        lines.push(`Viaje: ${tripUrl}`);
    }

    const normalizedDriverName =
        driverName == null ? '' : String(driverName).trim();
    if (normalizedDriverName) {
        lines.push(`Conductor: ${normalizedDriverName}`);
    }

    if (driverProfileUrl) {
        lines.push(`Perfil conductor: ${driverProfileUrl}`);
    }

    return lines.join('\n');
}

export function buildTripReportSupportTicketMessage({
    tripId,
    tripUrl,
    driverName,
    driverProfileUrl
}) {
    const context = buildTripReportSupportTicketContext({
        tripId,
        tripUrl,
        driverName,
        driverProfileUrl
    });

    return `\n${TRIP_REPORT_MESSAGE_SEPARATOR}\n\n${context}`;
}

export function buildTripReportSupportTicketRoute({ trip, webAppBaseUrl }) {
    const tripId = trip && trip.id;
    const driver = trip && trip.user;
    const baseUrl = normalizeWebAppBaseUrl(webAppBaseUrl);
    const tripUrl = baseUrl ? `${baseUrl}/trips/${tripId}` : '';
    const driverProfileUrl =
        baseUrl && driver && driver.id ? `${baseUrl}/profile/${driver.id}` : '';

    return {
        name: 'ticket-new',
        query: {
            category: 'report',
            message: buildTripReportSupportTicketMessage({
                tripId,
                tripUrl,
                driverName: driver && driver.name,
                driverProfileUrl
            })
        }
    };
}

export function resolveWebAppBaseUrl(env = import.meta.env) {
    if (env && env.VITE_WEB_URL) {
        return normalizeWebAppBaseUrl(env.VITE_WEB_URL);
    }

    if (typeof window !== 'undefined' && window.location) {
        const routeBase = env && env.VITE_ROUTE_BASE ? String(env.VITE_ROUTE_BASE) : '/';
        const normalizedRouteBase = routeBase.startsWith('/')
            ? routeBase
            : `/${routeBase}`;
        return normalizeWebAppBaseUrl(
            `${window.location.origin}${normalizedRouteBase}`
        );
    }

    return '';
}
