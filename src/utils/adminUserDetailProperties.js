const EMPTY_VALUE = '—';

const ADMIN_USER_PROPERTY_DEFINITIONS = [
    { key: 'id', label: 'ID' },
    { key: 'banned', labelKey: 'usuarioSuspendido', type: 'boolean' },
    { key: 'active', labelKey: 'usuarioActivo', type: 'boolean' },
    { key: 'name', labelKey: 'nombreYApellido' },
    { key: 'username', labelKey: 'username' },
    { key: 'email', labelKey: 'eMail' },
    { key: 'mobile_phone', labelKey: 'numeroDeTelefono' },
    { key: 'phone_verified', labelKey: 'phone_verified', type: 'boolean' },
    { key: 'phone_verified_at', labelKey: 'phone_verified_at' },
    { key: 'nro_doc', labelKey: 'doc' },
    { key: 'is_admin', labelKey: 'is_admin', type: 'boolean' },
    { key: 'is_member', labelKey: 'is_member', type: 'boolean' },
    { key: 'has_pin', labelKey: 'has_pin', type: 'boolean' },
    { key: 'description', labelKey: 'acercaDeMi' },
    { key: 'private_note', labelKey: 'notaPrivada' },
    { key: 'image', labelKey: 'image' },
    { key: 'birthday', labelKey: 'birthday' },
    { key: 'gender', labelKey: 'gender' },
    { key: 'facebook_profile_url', label: 'Perfil de Facebook' },
    { key: 'data_visibility', labelKey: 'data_visibility' },
    { key: 'identity_validated', labelKey: 'identity_validated', type: 'boolean' },
    { key: 'identity_validated_at', labelKey: 'identity_validated_at' },
    { key: 'identity_validation_type', labelKey: 'identity_validation_type' },
    {
        key: 'identity_validation_rejected_at',
        labelKey: 'identity_validation_rejected_at'
    },
    {
        key: 'identity_validation_reject_reason',
        labelKey: 'identity_validation_reject_reason'
    },
    { key: 'validate_by_date', labelKey: 'validate_by_date' },
    { key: 'driver_is_verified', labelKey: 'driver_is_verified', type: 'boolean' },
    { key: 'driver_data_docs', labelKey: 'driver_data_docs', type: 'json' },
    { key: 'patente', labelKey: 'patente' },
    { key: 'car_description', labelKey: 'car_description' },
    { key: 'cars', labelKey: 'cars', type: 'json' },
    { key: 'emails_notifications', labelKey: 'emails_notifications', type: 'boolean' },
    {
        key: 'do_not_alert_request_seat',
        labelKey: 'do_not_alert_request_seat',
        type: 'boolean'
    },
    {
        key: 'do_not_alert_accept_passenger',
        labelKey: 'do_not_alert_accept_passenger',
        type: 'boolean'
    },
    {
        key: 'do_not_alert_pending_rates',
        labelKey: 'do_not_alert_pending_rates',
        type: 'boolean'
    },
    { key: 'do_not_alert_pricing', labelKey: 'do_not_alert_pricing', type: 'boolean' },
    { key: 'monthly_donate', labelKey: 'monthly_donate', type: 'boolean' },
    { key: 'unaswered_messages_limit', labelKey: 'unaswered_messages_limit' },
    { key: 'autoaccept_requests', labelKey: 'autoaccept_requests', type: 'boolean' },
    { key: 'on_boarding_view', labelKey: 'on_boarding_view' },
    { key: 'account_number', labelKey: 'account_number' },
    { key: 'account_type', labelKey: 'account_type' },
    { key: 'account_bank', labelKey: 'account_bank' },
    { key: 'positive_ratings', labelKey: 'positive_ratings' },
    { key: 'negative_ratings', labelKey: 'negative_ratings' },
    { key: 'references', labelKey: 'references' },
    { key: 'support_tickets_count', labelKey: 'support_tickets_count' },
    { key: 'admin_trips_count', labelKey: 'admin_trips_count' },
    { key: 'admin_ratings_count', labelKey: 'admin_ratings_count' },
    { key: 'last_connection', labelKey: 'ultimaConexion' },
    { key: 'created_at', labelKey: 'created_at' }
];

function isTruthyFlag(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    return Number(value) > 0;
}

export function formatAdminUserPropertyValue(value, type = 'text') {
    if (type === 'boolean') {
        if (value === null || value === undefined || value === '') {
            return EMPTY_VALUE;
        }
        return isTruthyFlag(value) ? 'Sí' : 'No';
    }

    if (type === 'json') {
        if (value === null || value === undefined) {
            return EMPTY_VALUE;
        }
        return JSON.stringify(value);
    }

    if (value === null || value === undefined || value === '') {
        return EMPTY_VALUE;
    }

    return String(value);
}

function resolvePropertyLabel(definition, translate) {
    if (definition.label) {
        return definition.label;
    }
    if (definition.labelKey) {
        return translate(definition.labelKey);
    }
    return definition.key;
}

export function getAdminUserBannedBanner(user, translate) {
    const isBanned = Number(user?.banned) > 0;

    if (isBanned) {
        return {
            label: translate('usuarioSuspendido'),
            modifier: 'danger'
        };
    }

    return {
        label: translate('usuarioActivo'),
        modifier: 'success'
    };
}

export function buildAdminUserPropertyRows(user, { translate }) {
    if (!user) {
        return [];
    }

    return ADMIN_USER_PROPERTY_DEFINITIONS.map((definition) => ({
        key: definition.key,
        label: resolvePropertyLabel(definition, translate),
        value: formatAdminUserPropertyValue(
            user[definition.key],
            definition.type || 'text'
        )
    }));
}
