export function isManualValidationPaymentFailed(query = {}) {
    const result = query.payment_result;
    if (result === undefined || result === null || result === '') {
        return false;
    }
    return String(result) !== 'success';
}
