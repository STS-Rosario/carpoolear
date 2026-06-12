import { describe, expect, it } from 'vitest';
import { displayDniOrDash, formatDisplayDni } from './formatDisplayDni';

const DNI_FORMAT = '##.###.###';

describe('formatDisplayDni', () => {
    it('formats raw DNI using profile_id_format pattern', () => {
        expect(formatDisplayDni('30123456', DNI_FORMAT)).toBe('30.123.456');
    });

    it('returns null for empty values', () => {
        expect(formatDisplayDni(null, DNI_FORMAT)).toBeNull();
        expect(formatDisplayDni('', DNI_FORMAT)).toBeNull();
        expect(formatDisplayDni('   ', DNI_FORMAT)).toBeNull();
    });

    it('returns value as string when pattern is missing', () => {
        expect(formatDisplayDni('30123456', null)).toBe('30123456');
    });
});

describe('displayDniOrDash', () => {
    it('returns formatted DNI for display', () => {
        expect(displayDniOrDash('30123456', DNI_FORMAT)).toBe('30.123.456');
    });

    it('returns em dash for empty values', () => {
        expect(displayDniOrDash(null, DNI_FORMAT)).toBe('—');
        expect(displayDniOrDash('', DNI_FORMAT)).toBe('—');
    });
});
