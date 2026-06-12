import { formatDisplayDni } from './formatDisplayDni';

export const MISMATCH_RESULT_DNI = 'dni_mismatch';
export const MISMATCH_RESULT_NAME = 'name_mismatch';
export const MISMATCH_RESULT_BOTH = 'both_mismatch';

function formatMismatchDni(value, profileIdFormat) {
    if (!value) {
        return '-';
    }

    const formatted = formatDisplayDni(value, profileIdFormat);
    return formatted === null ? '-' : formatted;
}

export function getIdentityValidationMismatchDetails(query, options = {}) {
    const { profileIdFormat = null } = options;
    const result = query && query.result;
    if (
        result !== MISMATCH_RESULT_DNI &&
        result !== MISMATCH_RESULT_NAME &&
        result !== MISMATCH_RESULT_BOTH
    ) {
        return null;
    }

    const showName = result === MISMATCH_RESULT_NAME || result === MISMATCH_RESULT_BOTH;
    const showDni = result === MISMATCH_RESULT_DNI || result === MISMATCH_RESULT_BOTH;
    const reasonKey =
        result === MISMATCH_RESULT_BOTH
            ? 'resultBothMismatch'
            : result === MISMATCH_RESULT_NAME
                ? 'resultNameMismatch'
                : 'resultDniMismatch';

    return {
        reasonKey,
        showName,
        showDni,
        userName: showName ? (query.user_name || '-') : null,
        mpName: showName ? (query.mp_name || '-') : null,
        userDni: showDni ? formatMismatchDni(query.user_dni, profileIdFormat) : null,
        mpDni: showDni ? formatMismatchDni(query.mp_dni, profileIdFormat) : null
    };
}

export function getMismatchSupportWarningKey(mismatchReason) {
    if (mismatchReason === MISMATCH_RESULT_NAME) {
        return 'identityValidationRejectionSupportWarningNameMismatch';
    }
    if (mismatchReason === MISMATCH_RESULT_DNI) {
        return 'identityValidationRejectionSupportWarningDniMismatch';
    }
    if (mismatchReason === MISMATCH_RESULT_BOTH) {
        return 'identityValidationRejectionSupportWarningBothMismatch';
    }
    return null;
}

export function getManualRejectionSupportWarningKey(rejectReason) {
    return getMismatchSupportWarningKey(rejectReason);
}
