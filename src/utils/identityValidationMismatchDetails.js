export function getIdentityValidationMismatchDetails(query) {
    const result = query && query.result;
    if (
        result !== 'dni_mismatch' &&
        result !== 'name_mismatch' &&
        result !== 'both_mismatch'
    ) {
        return null;
    }

    const showName = result === 'name_mismatch' || result === 'both_mismatch';
    const showDni = result === 'dni_mismatch' || result === 'both_mismatch';
    const reasonKey =
        result === 'both_mismatch'
            ? 'resultBothMismatch'
            : result === 'name_mismatch'
                ? 'resultNameMismatch'
                : 'resultDniMismatch';

    return {
        reasonKey,
        showName,
        showDni,
        userName: showName ? (query.user_name || '-') : null,
        mpName: showName ? (query.mp_name || '-') : null,
        userDni: showDni ? (query.user_dni || '-') : null,
        mpDni: showDni ? (query.mp_dni || '-') : null
    };
}
