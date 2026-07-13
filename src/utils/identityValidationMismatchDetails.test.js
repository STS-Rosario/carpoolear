import { describe, expect, it } from 'vitest';
import {
    getIdentityValidationMismatchDetails,
    getMismatchSupportWarningKey,
    getMismatchSupportWarningParts,
    getManualRejectionSupportWarningKey,
    MISMATCH_RESULT_BOTH,
    WARNING_PART_LAYOUT_INLINE_LINK,
    WARNING_PART_LAYOUT_TWO_PARAGRAPH
} from './identityValidationMismatchDetails.js';

describe('getIdentityValidationMismatchDetails', () => {
    it('returns both name and dni comparison details for both_mismatch', () => {
        const details = getIdentityValidationMismatchDetails(
            {
                result: 'both_mismatch',
                user_name: 'Jane Doe',
                mp_name: 'Other Person',
                user_dni: '30123456',
                mp_dni: '30999999'
            },
            { profileIdFormat: '##.###.###' }
        );

        expect(details.reasonKey).toBe('resultBothMismatch');
        expect(details.showName).toBe(true);
        expect(details.showDni).toBe(true);
        expect(details.userName).toBe('Jane Doe');
        expect(details.mpName).toBe('Other Person');
        expect(details.userDni).toBe('30.123.456');
        expect(details.mpDni).toBe('30.999.999');
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
            .toBe('identityValidationRejectionSupportWarningBothMismatch');
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
            .toBe('identityValidationRejectionSupportWarningBothMismatch');
        expect(getMismatchSupportWarningKey('other')).toBe(null);
    });

    it('returns two-paragraph warning parts for both mismatch', () => {
        expect(
            getMismatchSupportWarningParts(
                'identityValidationRejectionSupportWarningBothMismatch'
            )
        ).toEqual({
            layout: WARNING_PART_LAYOUT_TWO_PARAGRAPH,
            paragraph1Key:
                'identityValidationRejectionSupportWarningBothMismatchParagraph1',
            paragraph2LeadKey:
                'identityValidationRejectionSupportWarningBothMismatchParagraph2Lead',
            paragraph2TailKey:
                'identityValidationRejectionSupportWarningBothMismatchParagraph2Tail'
        });
    });

    it('returns inline-link warning parts for single-field mismatch', () => {
        expect(
            getMismatchSupportWarningParts(
                'identityValidationRejectionSupportWarningNameMismatch'
            )
        ).toEqual({
            layout: WARNING_PART_LAYOUT_INLINE_LINK,
            leadKey: 'identityValidationRejectionSupportWarningNameMismatchLead',
            tailKey: 'identityValidationRejectionSupportWarningNameMismatchTail'
        });
    });
});
