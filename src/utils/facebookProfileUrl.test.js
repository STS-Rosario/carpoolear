import { describe, expect, it } from 'vitest';
import {
    isValidFacebookProfileUrl,
    normalizeFacebookProfileUrl
} from './facebookProfileUrl.js';

describe('facebookProfileUrl', () => {
    it('returns null for empty values', () => {
        expect(normalizeFacebookProfileUrl(null)).toBeNull();
        expect(normalizeFacebookProfileUrl('')).toBeNull();
        expect(normalizeFacebookProfileUrl('   ')).toBeNull();
    });

    it('canonicalizes facebook profile urls', () => {
        expect(normalizeFacebookProfileUrl('facebook.com/test-user')).toBe(
            'https://facebook.com/test-user'
        );
        expect(normalizeFacebookProfileUrl('www.facebook.com/test-user')).toBe(
            'https://facebook.com/test-user'
        );
        expect(normalizeFacebookProfileUrl('https://facebook.com/test-user')).toBe(
            'https://facebook.com/test-user'
        );
    });

    it('rejects non-facebook urls', () => {
        expect(normalizeFacebookProfileUrl('https://example.com/profile')).toBeNull();
        expect(isValidFacebookProfileUrl('https://example.com/profile')).toBe(false);
    });
});
