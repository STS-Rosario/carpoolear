import { describe, expect, it, vi } from 'vitest';
import {
    getIdentityValidationRedirectRoute,
    redirectIfIdentityValidationRequired,
    shouldBlockForIncompleteProfile,
    userNeedsIdentityValidation
} from './identityValidationNavigation';
import { INCOMPLETE_PROFILE_UPDATE_ROUTE } from './tripCreateErrors';

const completeUser = {
    image: 'https://example.com/a.jpg',
    description: 'About me',
    nro_doc: '12345678',
    mobile_phone: '3415551234',
    identity_validated: false,
    identity_validation_required_for_user: true
};

const enforcedConfig = {
    identity_validation_enabled: true,
    identity_validation_optional: false
};

describe('identityValidationNavigation', () => {
    it('blocks incomplete profile before identity validation', () => {
        const incomplete = { ...completeUser, nro_doc: '' };
        expect(shouldBlockForIncompleteProfile(incomplete)).toBe(true);
        expect(getIdentityValidationRedirectRoute(incomplete, enforcedConfig)).toEqual(
            INCOMPLETE_PROFILE_UPDATE_ROUTE
        );
        expect(userNeedsIdentityValidation(incomplete, enforcedConfig)).toBe(true);
    });

    it('sends complete user to identity validation when required', () => {
        expect(getIdentityValidationRedirectRoute(completeUser, enforcedConfig)).toEqual({
            name: 'identity_validation'
        });
    });

    it('returns null when validation not required', () => {
        expect(
            getIdentityValidationRedirectRoute(completeUser, {
                identity_validation_enabled: false
            })
        ).toBeNull();
    });

    it('redirectIfIdentityValidationRequired navigates with replace when asked', () => {
        const router = { push: vi.fn(), replace: vi.fn() };
        const incomplete = { ...completeUser, mobile_phone: '' };

        expect(
            redirectIfIdentityValidationRequired(router, {
                user: incomplete,
                config: enforcedConfig,
                useReplace: true
            })
        ).toBe(true);
        expect(router.replace).toHaveBeenCalledWith(INCOMPLETE_PROFILE_UPDATE_ROUTE);
        expect(router.push).not.toHaveBeenCalled();
    });
});
