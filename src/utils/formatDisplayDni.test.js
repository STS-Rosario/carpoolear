import { describe, expect, it } from 'vitest';
import { displayDniOrDash, formatDisplayDni } from './formatDisplayDni';

const PROFILE_ID_FORMAT = '##.###.###,A########';

describe('formatDisplayDni', () => {
    it('formats raw DNI using profile_id_format pattern', () => {
        expect(formatDisplayDni('30123456', '##.###.###')).toBe('30.123.456');
    });

    it('formats passport values using comma-separated profile_id_format', () => {
        expect(formatDisplayDni('A33070219', PROFILE_ID_FORMAT)).toBe(
            'A33070219'
        );
        expect(formatDisplayDni('abc123', PROFILE_ID_FORMAT)).toBe('ABC123');
    });

    it('returns null for empty values', () => {
        expect(formatDisplayDni(null, '##.###.###')).toBeNull();
        expect(formatDisplayDni('', '##.###.###')).toBeNull();
        expect(formatDisplayDni('   ', '##.###.###')).toBeNull();
    });

    it('returns null when value is not a DNI or a 5 to 9 character passport', () => {
        expect(formatDisplayDni('AB12', PROFILE_ID_FORMAT)).toBeNull();
        expect(formatDisplayDni('ABCDEFGHIJ', PROFILE_ID_FORMAT)).toBeNull();
    });

    it('returns value as string when pattern is missing', () => {
        expect(formatDisplayDni('30123456', null)).toBe('30123456');
    });
});

describe('displayDniOrDash', () => {
    it('returns formatted DNI for display', () => {
        expect(displayDniOrDash('30123456', '##.###.###')).toBe('30.123.456');
    });

    it('returns formatted passport for display', () => {
        expect(displayDniOrDash('A33070219', PROFILE_ID_FORMAT)).toBe(
            'A33070219'
        );
    });

    it('returns em dash for empty values', () => {
        expect(displayDniOrDash(null, '##.###.###')).toBe('—');
        expect(displayDniOrDash('', '##.###.###')).toBe('—');
    });
});
