import { describe, expect, it } from 'vitest';
import {
    getIdentityValidationMismatchDetails,
    getMismatchSupportWarningKey,
    getManualRejectionSupportWarningKey,
    MISMATCH_RESULT_BOTH
} from './identityValidationMismatchDetails.js';

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

    it('exports both mismatch result constant', () => {
        expect(MISMATCH_RESULT_BOTH).toBe('both_mismatch');
    });

    it('maps name mismatch reject reason to warning translation key', () => {
        expect(getManualRejectionSupportWarningKey('name_mismatch'))
            .toBe('identityValidationRejectionSupportWarningNameMismatch');
    });

    it('maps dni mismatch reject reason to warning translation key', () => {
        expect(getManualRejectionSupportWarningKey('dni_mismatch'))
            .toBe('identityValidationRejectionSupportWarningDniMismatch');
    });

    it('maps both mismatch reject reason to warning translation key', () => {
        expect(getManualRejectionSupportWarningKey('both_mismatch'))
            .toBe('identityValidationRejectionSupportWarningNameMismatch');
    });

    it('returns null when reject reason does not match known mismatch reasons', () => {
        expect(getManualRejectionSupportWarningKey('other')).toBe(null);
    });

    it('maps mismatch result to support warning key using shared helper', () => {
        expect(getMismatchSupportWarningKey('name_mismatch'))
            .toBe('identityValidationRejectionSupportWarningNameMismatch');
        expect(getMismatchSupportWarningKey('dni_mismatch'))
            .toBe('identityValidationRejectionSupportWarningDniMismatch');
        expect(getMismatchSupportWarningKey('both_mismatch'))
            .toBe('identityValidationRejectionSupportWarningNameMismatch');
        expect(getMismatchSupportWarningKey('other')).toBe(null);
    });
});
