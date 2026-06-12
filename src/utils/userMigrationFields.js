import { displayDniOrDash } from './formatDisplayDni';

const EMPTY_VALUE = '—';

export const DEFAULT_FIELD_SOURCES = {
    email: 'removed',
    password: 'kept',
    nro_doc: 'removed',
    mobile_phone: 'kept',
    created_at: 'removed'
};

export const migrationFields = [
    { key: 'email', labelKey: 'migracionCampoEmail' },
    { key: 'password', labelKey: 'migracionCampoContrasena' },
    { key: 'nro_doc', labelKey: 'migracionCampoDni' },
    { key: 'mobile_phone', labelKey: 'migracionCampoTelefono' },
    { key: 'created_at', labelKey: 'migracionCampoFechaCreacion' }
];

export function createDefaultFieldSources() {
    return { ...DEFAULT_FIELD_SOURCES };
}

export function formatMigrationFieldValue(fieldKey, user, options = {}) {
    if (!user) {
        return EMPTY_VALUE;
    }

    if (fieldKey === 'nro_doc') {
        return displayDniOrDash(user.nro_doc, options.profileIdFormat, EMPTY_VALUE);
    }

    const value = user[fieldKey];
    return value ? String(value) : EMPTY_VALUE;
}
