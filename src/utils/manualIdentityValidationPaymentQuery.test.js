import { describe, expect, it } from 'vitest';
import { isManualValidationPaymentFailed } from './manualIdentityValidationPaymentQuery.js';

describe('isManualValidationPaymentFailed', () => {
    it('is true when payment_result is a non-success value', () => {
        expect(isManualValidationPaymentFailed({ payment_result: 'failure' })).toBe(true);
        expect(isManualValidationPaymentFailed({ payment_result: 'pending' })).toBe(true);
    });

    it('is false when payment succeeded or result is absent', () => {
        expect(isManualValidationPaymentFailed({ payment_success: '1' })).toBe(false);
        expect(isManualValidationPaymentFailed({ payment_result: 'success' })).toBe(false);
        expect(isManualValidationPaymentFailed({})).toBe(false);
    });
});
