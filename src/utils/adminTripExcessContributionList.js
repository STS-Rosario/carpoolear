import { adminUserSupportTicketsRoute } from './adminUserSupportTicketsLink.js';
import { contributionUnitsFromCents } from './tripContributionDisplay.js';
import { parseAdminPaginationFromRoute } from './adminPagination';

export const ADMIN_EXCESO_CONTRIBUCION_REQUIRES_ACTION_ONLY_KEY =
    'adminExcesoContribucionRequiresActionOnly';

export const TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS = [
    { key: 'id', labelKey: 'id' },
    { key: 'user_name', labelKey: 'usuario' },
    { key: 'from_town', labelKey: 'origen' },
    { key: 'to_town', labelKey: 'destino' },
    { key: 'seat_price_cents', labelKey: 'contribucion' },
    { key: 'potential_seat_price_cents', labelKey: 'contribucionPotencial' },
    { key: 'average_contribution_cents', labelKey: 'contribucionPromedio' },
    { key: 'excess_contribution_percentage', labelKey: 'porcentajeExceso' },
    { key: 'has_private_note', labelKey: 'tieneNotas' },
    { key: 'excess_contribution_support_tickets_count', labelKey: 'ticketSoporte' },
    { key: 'exceso_contribucion_status', labelKey: 'estado' }
];

function createMemoryStorage() {
    const values = new Map();

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        }
    };
}

function resolveStorage(storage) {
    if (storage) {
        return storage;
    }

    if (typeof localStorage !== 'undefined') {
        return localStorage;
    }

    return createMemoryStorage();
}

export function getRequiresActionOnlyExcessContributions(storage) {
    const stored = resolveStorage(storage).getItem(
        ADMIN_EXCESO_CONTRIBUCION_REQUIRES_ACTION_ONLY_KEY
    );

    if (stored === null) {
        return true;
    }

    return stored === 'true';
}

export function saveRequiresActionOnlyExcessContributions(requiresActionOnly, storage) {
    resolveStorage(storage).setItem(
        ADMIN_EXCESO_CONTRIBUCION_REQUIRES_ACTION_ONLY_KEY,
        requiresActionOnly ? 'true' : 'false'
    );
}

export function getNextTripExcessContributionSortState(currentKey, currentDir, column) {
    if (currentKey === column) {
        return {
            sortKey: column,
            sortDir: currentDir === 'asc' ? 'desc' : 'asc'
        };
    }

    return {
        sortKey: column,
        sortDir: column === 'id' ? 'desc' : 'asc'
    };
}

export function buildTripExcessContributionListParams({
    page,
    perPage,
    requiresActionOnly = false,
    sortKey = null,
    sortDir = 'asc'
} = {}) {
    const params = {};

    if (page) {
        params.page = page;
    }
    if (perPage) {
        params.per_page = perPage;
    }
    if (requiresActionOnly) {
        params.requires_action_only = '1';
    }
    if (sortKey) {
        params.sort = sortKey;
        params.direction = sortDir === 'desc' ? 'desc' : 'asc';
    }

    return params;
}

export function parseTripExcessContributionListFromRoute(query = {}) {
    const pagination = parseAdminPaginationFromRoute(query);
    const requiresActionOnly = query.requires_action_only != null &&
        ['1', 'true', 'yes'].includes(String(query.requires_action_only).toLowerCase());

    const sortKey = query.sort ? String(query.sort) : null;
    const sortDir = String(query.direction || '').toLowerCase() === 'desc' ? 'desc' : 'asc';

    return {
        page: pagination.page,
        perPage: pagination.perPage,
        requiresActionOnly,
        sortKey,
        sortDir
    };
}

export const EXCESO_CONTRIBUCION_STATUSES = [
    'pendiente',
    'resuelto',
    'descartado',
    'en_proceso'
];

/** Button order: en proceso first, pendiente last. */
export const EXCESO_CONTRIBUCION_STATUS_ACTION_ORDER = [
    'en_proceso',
    'resuelto',
    'descartado',
    'pendiente'
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

export function formatAdminTripContributionLabel(cents) {
    const units = contributionUnitsFromCents(cents);

    if (!units) {
        return null;
    }

    return `$${units}`;
}

export function formatAdminExcessContributionPercentageLabel(percentage) {
    if (percentage == null || percentage === '') {
        return null;
    }

    return `${percentage}%`;
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
    return EXCESO_CONTRIBUCION_STATUS_ACTION_ORDER.filter(
        (status) => status !== currentStatus
    );
}

export function excessContributionStatusActionLabel(status, t) {
    const key = EXCESO_CONTRIBUCION_STATUS_ACTION_KEYS[status];
    if (key) {
        return t(key);
    }
    return status || '';
}

export function excessContributionStatusButtonVariant(status) {
    if (status === 'resuelto') {
        return 'success';
    }
    if (status === 'descartado') {
        return 'danger';
    }
    return 'secondary';
}
