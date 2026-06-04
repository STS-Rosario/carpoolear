import { describe, expect, it } from 'vitest';
import { formatAdminUserNavLabel } from './adminUserNavLabel';

describe('adminUserNavLabel', () => {
    it('appends count in parentheses when count is a number', () => {
        expect(formatAdminUserNavLabel('Ver viajes', 3)).toBe('Ver viajes (3)');
        expect(formatAdminUserNavLabel('Ver viajes', 0)).toBe('Ver viajes (0)');
    });

    it('returns label unchanged when count is not a number', () => {
        expect(formatAdminUserNavLabel('Ver viajes', null)).toBe('Ver viajes');
        expect(formatAdminUserNavLabel('Ver viajes', undefined)).toBe('Ver viajes');
    });
});
