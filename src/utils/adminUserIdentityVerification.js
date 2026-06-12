import { formatAdminUserPropertyValue } from './adminUserDetailProperties';

const IDENTITY_VERIFICATION_DETAIL_KEYS = [
    {
        key: 'identity_validated_at',
        labelKey: 'identity_validated_at',
        when: (user) => !!user?.identity_validated_at
    },
    {
        key: 'identity_validation_rejected_at',
        labelKey: 'identity_validation_rejected_at',
        when: (user) => !!user?.identity_validation_rejected_at
    },
    {
        key: 'identity_validation_reject_reason',
        labelKey: 'identity_validation_reject_reason',
        when: (user) => !!user?.identity_validation_reject_reason
    },
    {
        key: 'validate_by_date',
        labelKey: 'validate_by_date',
        when: (user) => !!user?.validate_by_date
    }
];

const METHOD_LABEL_KEYS = {
    mercado_pago: 'adminIdentityValidationMethodMercadoPago',
    manual: 'adminIdentityValidationMethodManual'
};

function isUserIdentityVerified(user) {
    if (!user) {
        return false;
    }
    if (typeof user.identity_validated === 'boolean') {
        return user.identity_validated;
    }
    return Number(user.identity_validated) > 0;
}

function formatIdentityValidationMethod(type, translate) {
    if (!type) {
        return '—';
    }
    const labelKey = METHOD_LABEL_KEYS[type];
    return labelKey ? translate(labelKey) : String(type);
}

export function buildAdminUserIdentityVerificationSection(user, { translate }) {
    const isVerified = isUserIdentityVerified(user);

    const detailRows = IDENTITY_VERIFICATION_DETAIL_KEYS.filter((definition) =>
        definition.when(user)
    ).map((definition) => ({
        key: definition.key,
        label: translate(definition.labelKey),
        value: formatAdminUserPropertyValue(user[definition.key])
    }));

    return {
        isVerified,
        statusLabel: isVerified
            ? translate('identidadValidada')
            : translate('identidadNoValidada'),
        methodLabel: formatIdentityValidationMethod(
            user?.identity_validation_type,
            translate
        ),
        detailRows
    };
}

export function canClearAdminUserIdentityVerification(user) {
    return !!user?.identity_validated_at;
}
