import { describe, expect, it } from 'vitest';
import { compareAndroidVersion, compareSemver } from './versionCompare.js';

describe('compareAndroidVersion', () => {
    it('returns -1 when current is lower than minimum', () => {
        expect(compareAndroidVersion('9', '10')).toBe(-1);
    });

    it('returns 1 when current is higher than minimum', () => {
        expect(compareAndroidVersion('11', '10')).toBe(1);
    });

    it('returns 0 when versions match', () => {
        expect(compareAndroidVersion('10', '10')).toBe(0);
    });

    it('treats non-numeric input as zero', () => {
        expect(compareAndroidVersion('abc', '1')).toBe(-1);
        expect(compareAndroidVersion('abc', '')).toBe(0);
        expect(compareAndroidVersion('abc', 'abc')).toBe(0);
    });
});

describe('compareSemver', () => {
    it('returns -1/1/0 for lower/higher/equal versions', () => {
        expect(compareSemver('1.2.3', '1.2.4')).toBe(-1);
        expect(compareSemver('1.2.4', '1.2.3')).toBe(1);
        expect(compareSemver('1.2.3', '1.2.3')).toBe(0);
    });

    it('compares numerically, not lexicographically', () => {
        expect(compareSemver('1.10.0', '1.9.0')).toBe(1);
        expect(compareSemver('2.10.0', '2.9.9')).toBe(1);
    });

    it('treats missing parts as zero', () => {
        expect(compareSemver('1.2', '1.2.3')).toBe(-1);
        expect(compareSemver('1.2.3.1', '1.2.3')).toBe(1);
    });

    it('handles major-boundary bumps', () => {
        expect(compareSemver('2.0.0', '1.9.9')).toBe(1);
    });

    it('normalizes garbage input to zero', () => {
        expect(compareSemver('abc', '0.0.1')).toBe(-1);
        expect(compareSemver('abc', 'abc')).toBe(0);
    });
});
