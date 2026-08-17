import { describe, expect, it } from 'vitest';
import {
    sanitizeClientLogContext,
    sanitizeClientLogString
} from './clientLogSanitizer.js';

describe('clientLogSanitizer', () => {
    it('strips html tags from log strings', () => {
        expect(sanitizeClientLogString('<script>alert(1)</script>oops')).toBe('oops');
    });

    it('removes control characters from log strings', () => {
        expect(sanitizeClientLogString('hello\x00world')).toBe('helloworld');
    });

    it('truncates long log strings', () => {
        expect(sanitizeClientLogString('a'.repeat(20), 10)).toBe('a'.repeat(10));
    });

    it('returns null for empty strings', () => {
        expect(sanitizeClientLogString('')).toBeNull();
        expect(sanitizeClientLogString(null)).toBeNull();
    });

    it('keeps scalar context values and sanitizes nested error arrays', () => {
        expect(
            sanitizeClientLogContext({
                status: 422,
                source: 'trip_create',
                nested: { ignored: true },
                errors: {
                    car_id: ['<b>missing plate</b>']
                }
            })
        ).toEqual({
            status: 422,
            source: 'trip_create',
            errors: {
                car_id: ['missing plate']
            }
        });
    });

    it('returns null for non-object context', () => {
        expect(sanitizeClientLogContext('nope')).toBeNull();
    });
});
