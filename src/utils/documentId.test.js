import { describe, expect, it } from 'vitest';
import {
    DOCUMENT_TYPE_DNI,
    DOCUMENT_TYPE_PASSPORT,
    cleanDocumentIdForStorage,
    formatDocumentId,
    formatDocumentIdInput,
    getMaxDocumentIdInputLength,
    inferDocumentType,
    isValidDocumentId,
    parseProfileIdFormat,
    resolveDniFormats,
    resolveProfileIdFormats
} from './documentId';

const PROFILE_ID_FORMAT = '##.###.###,A########';
const PROFILE_ID_PATTERNS = ['##.###.###', 'A########'];
const DNI_PATTERNS = ['##.###.###'];

describe('parseProfileIdFormat', () => {
    it('splits comma-separated masks', () => {
        expect(parseProfileIdFormat(PROFILE_ID_FORMAT)).toEqual(
            PROFILE_ID_PATTERNS
        );
    });

    it('returns a single mask unchanged', () => {
        expect(parseProfileIdFormat('##.###.###')).toEqual(['##.###.###']);
    });

    it('trims whitespace around masks', () => {
        expect(parseProfileIdFormat(' ##.###.### , A######## ')).toEqual(
            PROFILE_ID_PATTERNS
        );
    });
});

describe('resolveProfileIdFormats', () => {
    it('reads masks from profile_id_format config', () => {
        expect(
            resolveProfileIdFormats({ profile_id_format: PROFILE_ID_FORMAT })
        ).toEqual(PROFILE_ID_PATTERNS);
    });
});

describe('resolveDniFormats', () => {
    it('keeps only digit masks for DNI', () => {
        expect(
            resolveDniFormats({ profile_id_format: PROFILE_ID_FORMAT })
        ).toEqual(DNI_PATTERNS);
    });
});

describe('formatDocumentId', () => {
    it('formats DNI values with the DNI mask', () => {
        expect(formatDocumentId('30123456', PROFILE_ID_PATTERNS)).toBe(
            '30.123.456'
        );
    });

    it('formats flexible passport values in uppercase without a mask', () => {
        expect(formatDocumentId('A33070219', PROFILE_ID_PATTERNS)).toBe(
            'A33070219'
        );
        expect(formatDocumentId('abc123', PROFILE_ID_PATTERNS)).toBe('ABC123');
    });

    it('formats stored values that still contain separators', () => {
        expect(formatDocumentId('30.123.456', PROFILE_ID_PATTERNS)).toBe(
            '30.123.456'
        );
    });
});

describe('cleanDocumentIdForStorage', () => {
    it('stores DNI without separators', () => {
        expect(
            cleanDocumentIdForStorage('30.123.456', PROFILE_ID_PATTERNS)
        ).toBe('30123456');
    });

    it('stores passport values as uppercase alphanumeric without separators', () => {
        expect(
            cleanDocumentIdForStorage('a33070219', PROFILE_ID_PATTERNS)
        ).toBe('A33070219');
        expect(cleanDocumentIdForStorage('ab-c12 3', PROFILE_ID_PATTERNS)).toBe(
            'ABC123'
        );
    });
});

describe('isValidDocumentId', () => {
    it('accepts DNI values that match the DNI mask', () => {
        expect(isValidDocumentId('30123456', PROFILE_ID_PATTERNS)).toBe(true);
        expect(
            isValidDocumentId('30123456', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_DNI
            })
        ).toBe(true);
    });

    it('accepts 5 to 9 alphanumeric passport values', () => {
        expect(isValidDocumentId('ABC123', PROFILE_ID_PATTERNS)).toBe(true);
        expect(isValidDocumentId('A33070219', PROFILE_ID_PATTERNS)).toBe(true);
        expect(isValidDocumentId('12345', PROFILE_ID_PATTERNS)).toBe(true);
        expect(isValidDocumentId('ABCDEFGHI', PROFILE_ID_PATTERNS)).toBe(true);
        expect(
            isValidDocumentId('abc123', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_PASSPORT
            })
        ).toBe(true);
    });

    it('rejects passport values outside 5 to 9 alphanumeric characters', () => {
        expect(isValidDocumentId('AB12', PROFILE_ID_PATTERNS)).toBe(false);
        expect(isValidDocumentId('ABCDEFGHIJ', PROFILE_ID_PATTERNS)).toBe(false);
        expect(
            isValidDocumentId('AB12', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_PASSPORT
            })
        ).toBe(false);
    });

    it('rejects passport values when the selected type is DNI', () => {
        expect(
            isValidDocumentId('ABC123', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_DNI
            })
        ).toBe(false);
    });
});

describe('formatDocumentIdInput', () => {
    it('applies the DNI mask while typing a DNI', () => {
        expect(
            formatDocumentIdInput('30123456', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_DNI
            })
        ).toBe('30.123.456');
    });

    it('uppercases and keeps alphanumeric passport input while typing', () => {
        expect(
            formatDocumentIdInput('ab-c12 3', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_PASSPORT
            })
        ).toBe('ABC123');
    });

    it('limits passport input to 9 characters', () => {
        expect(
            formatDocumentIdInput('abcdefghij', PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_PASSPORT
            })
        ).toBe('ABCDEFGHI');
    });
});

describe('inferDocumentType', () => {
    it('infers DNI when the value matches the DNI mask', () => {
        expect(inferDocumentType('30123456', PROFILE_ID_PATTERNS)).toBe(
            DOCUMENT_TYPE_DNI
        );
        expect(inferDocumentType('30.123.456', PROFILE_ID_PATTERNS)).toBe(
            DOCUMENT_TYPE_DNI
        );
    });

    it('infers passport when the value does not match the DNI mask', () => {
        expect(inferDocumentType('ABC123', PROFILE_ID_PATTERNS)).toBe(
            DOCUMENT_TYPE_PASSPORT
        );
        expect(inferDocumentType('A33070219', PROFILE_ID_PATTERNS)).toBe(
            DOCUMENT_TYPE_PASSPORT
        );
    });

    it('defaults to DNI when the value is empty', () => {
        expect(inferDocumentType('', PROFILE_ID_PATTERNS)).toBe(
            DOCUMENT_TYPE_DNI
        );
    });
});

describe('getMaxDocumentIdInputLength', () => {
    it('returns the DNI mask length for DNI and 9 for passport', () => {
        expect(
            getMaxDocumentIdInputLength(PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_DNI
            })
        ).toBe(10);
        expect(
            getMaxDocumentIdInputLength(PROFILE_ID_PATTERNS, {
                type: DOCUMENT_TYPE_PASSPORT
            })
        ).toBe(9);
    });
});
