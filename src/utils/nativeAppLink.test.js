import { describe, expect, it } from 'vitest';
import { parseNativeAppLinkUrl } from './nativeAppLink.js';

describe('parseNativeAppLinkUrl', () => {
    it('maps production MP return URL to identity_validation route', () => {
        const parsed = parseNativeAppLinkUrl(
            'https://carpoolear.com.ar/app/setting/identity-validation?result=success'
        );
        expect(parsed).toEqual({
            name: 'identity_validation',
            path: '/setting/identity-validation',
            query: { result: 'success' }
        });
    });

    it('accepts www host and preserves mismatch query params', () => {
        const parsed = parseNativeAppLinkUrl(
            'https://www.carpoolear.com.ar/app/setting/identity-validation?result=dni_mismatch&mp_name=Foo'
        );
        expect(parsed?.query).toEqual({
            result: 'dni_mismatch',
            mp_name: 'Foo'
        });
    });

    it('rejects non-identity paths under /app', () => {
        expect(
            parseNativeAppLinkUrl('https://carpoolear.com.ar/app/trips/1')
        ).toBeNull();
    });

    it('rejects http and foreign hosts', () => {
        expect(
            parseNativeAppLinkUrl(
                'http://carpoolear.com.ar/app/setting/identity-validation?result=success'
            )
        ).toBeNull();
        expect(
            parseNativeAppLinkUrl(
                'https://evil.example/app/setting/identity-validation'
            )
        ).toBeNull();
    });
});