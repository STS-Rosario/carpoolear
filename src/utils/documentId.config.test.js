import { describe, expect, it } from 'vitest';
import {
    cleanDocumentIdForStorageFromConfig,
    formatDocumentIdFromConfig,
    getDocumentIdPlaceholderFromConfig,
    getMaxDocumentIdInputLengthFromConfig,
    isValidDocumentIdForConfig
} from './documentId';

const APP_CONFIG = {
    profile_id_format: '##.###.###',
    profile_id_formats: [
        { type: 'dni', pattern: '##.###.###' },
        { type: 'passport', pattern: 'A########' }
    ]
};

describe('document id config helpers', () => {
    it('formats passport values from app config', () => {
        expect(formatDocumentIdFromConfig('A33070219', APP_CONFIG)).toBe(
            'A33070219'
        );
    });

    it('normalizes DNI for storage from app config', () => {
        expect(
            cleanDocumentIdForStorageFromConfig('30.123.456', APP_CONFIG)
        ).toBe('30123456');
    });

    it('rejects values outside allowed masks from app config', () => {
        expect(isValidDocumentIdForConfig('ABC123', APP_CONFIG)).toBe(false);
    });

    it('uses the longest mask for input maxlength', () => {
        expect(getMaxDocumentIdInputLengthFromConfig(APP_CONFIG)).toBe(10);
    });

    it('builds a placeholder from all allowed masks', () => {
        expect(getDocumentIdPlaceholderFromConfig(APP_CONFIG)).toBe(
            '##.###.### / A########'
        );
    });
});
