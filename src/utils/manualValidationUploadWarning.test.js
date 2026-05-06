import { describe, expect, it } from 'vitest';
import {
    MANUAL_VALIDATION_UPLOAD_WARNING_KEY,
    MANUAL_VALIDATION_UPLOAD_WARNING_STYLE,
    getManualValidationUploadWarningKey
} from './manualValidationUploadWarning.js';

describe('manualValidationUploadWarning', () => {
    it('returns i18n key for post-review photo deletion warning', () => {
        expect(getManualValidationUploadWarningKey()).toBe(
            MANUAL_VALIDATION_UPLOAD_WARNING_KEY
        );
    });

    it('exposes shared warning color style tokens', () => {
        expect(MANUAL_VALIDATION_UPLOAD_WARNING_STYLE).toEqual({
            border: '1px solid #faebcc',
            background: '#fcf8e3',
            color: '#8a6d3b'
        });
    });
});
