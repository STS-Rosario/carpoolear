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
