import { describe, expect, it } from 'vitest';
import {
    MANUAL_IDENTITY_REJECT_REASONS,
    isManualRejectReasonRequired
} from './manualIdentityValidationRejectReasons.js';

describe('MANUAL_IDENTITY_REJECT_REASONS', () => {
    it('lists aggregatable admin reject codes', () => {
        expect(MANUAL_IDENTITY_REJECT_REASONS.map((item) => item.value)).toEqual([
            'docs_illegible',
            'selfie_mismatch',
            'document_mismatch',
            'expired_or_invalid_document',
            'suspected_fraud',
            'other'
        ]);
    });
});

describe('isManualRejectReasonRequired', () => {
    it('is required only for reject', () => {
        expect(isManualRejectReasonRequired('reject')).toBe(true);
        expect(isManualRejectReasonRequired('approve')).toBe(false);
        expect(isManualRejectReasonRequired('pending')).toBe(false);
    });
});
