import { describe, expect, it } from 'vitest';
import { getIdentityValidationMismatchDetails } from './identityValidationMismatchDetails.js';

describe('getIdentityValidationMismatchDetails', () => {
    it('returns both name and dni comparison details for both_mismatch', () => {
        const details = getIdentityValidationMismatchDetails({
            result: 'both_mismatch',
            user_name: 'Jane Doe',
            mp_name: 'Other Person',
            user_dni: '30123456',
            mp_dni: '30999999'
        });

        expect(details.reasonKey).toBe('resultBothMismatch');
        expect(details.showName).toBe(true);
        expect(details.showDni).toBe(true);
        expect(details.userName).toBe('Jane Doe');
        expect(details.mpName).toBe('Other Person');
        expect(details.userDni).toBe('30123456');
        expect(details.mpDni).toBe('30999999');
    });
});
