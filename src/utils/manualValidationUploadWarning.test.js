import { describe, expect, it } from 'vitest';
import {
    MANUAL_VALIDATION_UPLOAD_WARNING_KEY,
    getManualValidationUploadWarningKey
} from './manualValidationUploadWarning.js';

describe('manualValidationUploadWarning', () => {
    it('returns i18n key for post-review photo deletion warning', () => {
        expect(getManualValidationUploadWarningKey()).toBe(
            MANUAL_VALIDATION_UPLOAD_WARNING_KEY
        );
    });
});
