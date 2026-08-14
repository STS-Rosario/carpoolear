import { describe, expect, it } from 'vitest';
import {
    cleanDocumentIdForStorage,
    formatDocumentId,
    getMaxDocumentIdInputLength,
    isValidDocumentId,
    parseProfileIdFormat,
    resolveProfileIdFormats
} from './documentId';

const PROFILE_ID_FORMAT = '##.###.###,A########';
const PROFILE_ID_PATTERNS = ['##.###.###', 'A########'];

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

describe('formatDocumentId', () => {
    it('formats DNI values with the DNI mask', () => {
        expect(formatDocumentId('30123456', PROFILE_ID_PATTERNS)).toBe(
            '30.123.456'
        );
    });

    it('formats passport values with the passport mask', () => {
        expect(formatDocumentId('A33070219', PROFILE_ID_PATTERNS)).toBe(
            'A33070219'
        );
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
    });
});

describe('isValidDocumentId', () => {
    it('accepts values that fully match an allowed mask', () => {
        expect(isValidDocumentId('30123456', PROFILE_ID_PATTERNS)).toBe(true);
        expect(isValidDocumentId('A33070219', PROFILE_ID_PATTERNS)).toBe(true);
    });

    it('rejects values that do not match any allowed mask', () => {
        expect(isValidDocumentId('ABC123', PROFILE_ID_PATTERNS)).toBe(false);
        expect(isValidDocumentId('301234567', PROFILE_ID_PATTERNS)).toBe(false);
    });
});

describe('getMaxDocumentIdInputLength', () => {
    it('returns the longest formatted mask length', () => {
        expect(getMaxDocumentIdInputLength(PROFILE_ID_PATTERNS)).toBe(10);
    });
});
