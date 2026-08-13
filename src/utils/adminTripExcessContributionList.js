import { adminUserSupportTicketsRoute } from './adminUserSupportTicketsLink.js';
import { contributionUnitsFromCents } from './tripContributionDisplay.js';

export const EXCESO_CONTRIBUCION_STATUSES = [
    'pendiente',
    'resuelto',
    'descartado',
    'en_proceso'
];

export const EXCESO_CONTRIBUCION_STATUS_LABEL_KEYS = {
    pendiente: 'excesoContribucionStatusPendiente',
    resuelto: 'excesoContribucionStatusResuelto',
    descartado: 'excesoContribucionStatusDescartado',
    en_proceso: 'excesoContribucionStatusEnProceso'
};

export const EXCESO_CONTRIBUCION_STATUS_ACTION_KEYS = {
    pendiente: 'marcarExcesoContribucionPendiente',
    resuelto: 'marcarExcesoContribucionResuelto',
    descartado: 'marcarExcesoContribucionDescartado',
    en_proceso: 'marcarExcesoContribucionEnProceso'
};

export function formatTripContributionPesosLabel(cents) {
    const units = contributionUnitsFromCents(cents);

    if (!units) {
        return '-';
    }

    return `$${units}`;
}

export function excessContributionStatusLabel(status, t) {
    const key = EXCESO_CONTRIBUCION_STATUS_LABEL_KEYS[status];
    if (key) {
        return t(key);
    }
    return status || '-';
}

export function excessContributionStatusClass(status) {
    switch (status) {
        case 'resuelto':
            return 'label label-success';
        case 'descartado':
            return 'label label-default';
        case 'en_proceso':
            return 'label label-info';
        case 'pendiente':
            return 'label label-warning';
        default:
            return 'label label-default';
    }
}

export function adminExcessContributionDetailRoute(tripId) {
    return {
        name: 'admin-exceso-contribucion-detail',
        params: { tripId: String(tripId) }
    };
}

export function adminTripSearchRoute(tripId) {
    return {
        name: 'admin-trips',
        query: { trip_id: String(tripId) }
    };
}

export function excessContributionSupportTicketsRoute(userId) {
    return adminUserSupportTicketsRoute(userId, {
        type: 'excess_contribution',
        open: true
    });
}

export function excessContributionStatusActions(currentStatus) {
    return EXCESO_CONTRIBUCION_STATUSES.filter((status) => status !== currentStatus);
}

export function excessContributionStatusActionLabel(status, t) {
    const key = EXCESO_CONTRIBUCION_STATUS_ACTION_KEYS[status];
    if (key) {
        return t(key);
    }
    return status || '';
}
