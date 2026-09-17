import { describe, expect, it } from 'vitest';
import {
    getIdentityVerificationClientContext,
    IDENTITY_VERIFICATION_CLIENT_EVENTS
} from './identityVerificationClientContext.js';

describe('getIdentityVerificationClientContext', () => {
    it('returns platform and app version from injected readers', () => {
        expect(getIdentityVerificationClientContext({
            getPlatform: () => 'android',
            getAppVersion: () => '4.1.0'
        })).toEqual({
            platform: 'android',
            app_version: '4.1.0'
        });
    });

    it('omits app_version when unavailable and defaults platform to web', () => {
        expect(getIdentityVerificationClientContext({
            getPlatform: () => '',
            getAppVersion: () => null
        })).toEqual({
            platform: 'web'
        });
    });
});

describe('IDENTITY_VERIFICATION_CLIENT_EVENTS', () => {
    it('whitelists confirm modal funnel events', () => {
        expect(IDENTITY_VERIFICATION_CLIENT_EVENTS).toEqual({
            confirmModalShown: 'confirm_modal_shown',
            confirmModalCancelled: 'confirm_modal_cancelled'
        });
    });
});
