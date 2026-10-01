import { describe, expect, it } from 'vitest';
import { normalizeClubCarpoolearWelcomeResult } from './clubCarpoolearWelcomeResult.js';

describe('normalizeClubCarpoolearWelcomeResult', () => {
    it('defaults to success', () => {
        expect(normalizeClubCarpoolearWelcomeResult(undefined)).toBe('success');
    });

    it('accepts success, failed, and pending', () => {
        expect(normalizeClubCarpoolearWelcomeResult('success')).toBe('success');
        expect(normalizeClubCarpoolearWelcomeResult('failed')).toBe('failed');
        expect(normalizeClubCarpoolearWelcomeResult('pending')).toBe('pending');
    });

    it('maps failure alias to failed', () => {
        expect(normalizeClubCarpoolearWelcomeResult('failure')).toBe('failed');
    });
});
