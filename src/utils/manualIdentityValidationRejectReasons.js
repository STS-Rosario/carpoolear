export const MANUAL_IDENTITY_REJECT_REASONS = [
    { value: 'docs_illegible', labelKey: 'rejectReasonDocsIllegible' },
    { value: 'selfie_mismatch', labelKey: 'rejectReasonSelfieMismatch' },
    { value: 'document_mismatch', labelKey: 'rejectReasonDocumentMismatch' },
    { value: 'expired_or_invalid_document', labelKey: 'rejectReasonExpiredDocument' },
    { value: 'suspected_fraud', labelKey: 'rejectReasonSuspectedFraud' },
    { value: 'other', labelKey: 'rejectReasonOther' }
];

export function isManualRejectReasonRequired(action) {
    return action === 'reject';
}
