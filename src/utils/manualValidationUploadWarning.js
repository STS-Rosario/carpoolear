export const MANUAL_VALIDATION_UPLOAD_WARNING_KEY =
    'manualValidationUploadDeletionWarning';

export const MANUAL_VALIDATION_UPLOAD_WARNING_STYLE = Object.freeze({
    border: '1px solid #faebcc',
    background: '#fcf8e3',
    color: '#8a6d3b'
});

export function getManualValidationUploadWarningKey() {
    return MANUAL_VALIDATION_UPLOAD_WARNING_KEY;
}
