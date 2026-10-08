import { adminUserSupportTicketsRoute } from './adminUserSupportTicketsLink.js';
import { contributionUnitsFromCents } from './tripContributionDisplay.js';
import { parseAdminPaginationFromRoute } from './adminPagination';
import { resolveWebAppBaseUrl } from './supportTicketTripReport.js';

export const ADMIN_EXCESO_CONTRIBUCION_REQUIRES_ACTION_ONLY_KEY =
    'adminExcesoContribucionRequiresActionOnly';

export const TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS = [
    { key: 'id', labelKey: 'id' },
    { key: 'user_name', labelKey: 'usuario' },
    { key: 'from_town', labelKey: 'origen' },
    { key: 'to_town', labelKey: 'destino' },
    { key: 'seat_price_cents', labelKey: 'contribucion' },
    { key: 'maximum_seat_price_cents', labelKey: 'contribucionMaximaColumna' },
    { key: 'potential_seat_price_cents', labelKey: 'contribucionPotencial' },
    { key: 'average_contribution_cents', labelKey: 'contribucionPromedio' },
    { key: 'excess_contribution_percentage', labelKey: 'porcentajeExceso' },
    { key: 'suspected_contribution', labelKey: 'contribucionSospechada' },
    { key: 'phone_in_description', labelKey: 'telefonoEnDescripcion' },
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

/**
 * Formats the LLM suspected contribution (currency units, may arrive as a
 * decimal string from the API) using the same peso label as cents amounts.
 */
export function formatAdminSuspectedContributionLabel(amount) {
    if (amount == null || amount === '') {
        return null;
    }

    const numeric = Number(amount);

    if (!Number.isFinite(numeric)) {
        return null;
    }

    return formatAdminTripContributionLabel(Math.round(numeric * 100));
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

/** Days the excess contribution sanction lasts; the template's banned-until date is today plus this. */
export const EXCESS_CONTRIBUTION_SANCTION_DAYS = 7;

function padDatePart(value) {
    return String(value).padStart(2, '0');
}

/** Today (or `now`) plus `days`, formatted dd/mm/yyyy in local time. */
export function excessContributionSanctionEndDate(
    now = new Date(),
    days = EXCESS_CONTRIBUTION_SANCTION_DAYS
) {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days);
    return `${padDatePart(end.getDate())}/${padDatePart(end.getMonth() + 1)}/${end.getFullYear()}`;
}

function markdownUrlLink(url) {
    return `[${url}](${url})`;
}

/**
 * Payload for POST /api/admin/support/tickets: an excess-contribution ticket for the
 * item's user and trip, with the i18n subject and the template message interpolated
 * with the public trip link, the maximum seat contribution, the sanction end date and
 * the terms link.
 */
export function buildExcessContributionTemplatedTicketPayload(item, t, options = {}) {
    const {
        webAppBaseUrl = resolveWebAppBaseUrl(),
        now = new Date(),
        sanctionDays = EXCESS_CONTRIBUTION_SANCTION_DAYS
    } = options;
    const baseUrl = String(webAppBaseUrl || '').replace(/\/$/, '');

    return {
        user_id: item.user_id,
        type: 'excess_contribution',
        subject: t('ticketTypeExcessContribution'),
        message_markdown: t('excessContributionTemplatedTicketMessage', {
            tripLink: markdownUrlLink(`${baseUrl}/trips/${item.id}`),
            maxAmount:
                formatAdminTripContributionLabel(item.maximum_seat_price_cents) ??
                t('noDisponible'),
            bannedUntil: excessContributionSanctionEndDate(now, sanctionDays),
            termsLink: markdownUrlLink(`${baseUrl}/terminos`)
        }),
        trip_id: item.id
    };
}
