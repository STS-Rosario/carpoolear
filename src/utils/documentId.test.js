import { describe, expect, it } from 'vitest';
import {
    cleanDocumentIdForStorage,
    formatDocumentId,
    getMaxDocumentIdInputLength,
    isValidDocumentId,
    resolveProfileIdFormats
} from './documentId';

const PROFILE_ID_FORMATS = [
    { type: 'dni', pattern: '##.###.###' },
    { type: 'passport', pattern: 'A########' }
];

describe('resolveProfileIdFormats', () => {
    it('returns configured profile_id_formats when present', () => {
        expect(
            resolveProfileIdFormats({
                profile_id_formats: PROFILE_ID_FORMATS
            })
        ).toEqual(PROFILE_ID_FORMATS);
    });

    it('falls back to legacy profile_id_format string', () => {
        expect(
            resolveProfileIdFormats({ profile_id_format: '##.###.###' })
        ).toEqual([{ type: 'default', pattern: '##.###.###' }]);
    });
});

describe('formatDocumentId', () => {
    it('formats DNI values with the DNI mask', () => {
        expect(formatDocumentId('30123456', PROFILE_ID_FORMATS)).toBe(
            '30.123.456'
        );
    });

    it('formats passport values with the passport mask', () => {
        expect(formatDocumentId('A33070219', PROFILE_ID_FORMATS)).toBe(
            'A33070219'
        );
    });

    it('formats stored values that still contain separators', () => {
        expect(formatDocumentId('30.123.456', PROFILE_ID_FORMATS)).toBe(
            '30.123.456'
        );
    });
});

describe('cleanDocumentIdForStorage', () => {
    it('stores DNI without separators', () => {
        expect(
            cleanDocumentIdForStorage('30.123.456', PROFILE_ID_FORMATS)
        ).toBe('30123456');
    });

    it('stores passport values as uppercase alphanumeric without separators', () => {
        expect(
            cleanDocumentIdForStorage('a33070219', PROFILE_ID_FORMATS)
        ).toBe('A33070219');
    });
});

describe('isValidDocumentId', () => {
    it('accepts values that fully match an allowed mask', () => {
        expect(isValidDocumentId('30123456', PROFILE_ID_FORMATS)).toBe(true);
        expect(isValidDocumentId('A33070219', PROFILE_ID_FORMATS)).toBe(true);
    });

    it('rejects values that do not match any allowed mask', () => {
        expect(isValidDocumentId('ABC123', PROFILE_ID_FORMATS)).toBe(false);
        expect(isValidDocumentId('301234567', PROFILE_ID_FORMATS)).toBe(false);
    });
});

describe('getMaxDocumentIdInputLength', () => {
    it('returns the longest formatted mask length', () => {
        expect(getMaxDocumentIdInputLength(PROFILE_ID_FORMATS)).toBe(10);
    });
});
