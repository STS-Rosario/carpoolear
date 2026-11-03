import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const routerReplace = vi.fn();
const routerState = { rememberRoute: null };

vi.mock('../router', () => ({
    default: {
        replace: (...args) => routerReplace(...args),
        get rememberRoute() {
            return routerState.rememberRoute;
        },
        set rememberRoute(value) {
            routerState.rememberRoute = value;
        }
    }
}));

const completeProfileUser = {
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

describe('requireIdentityPendingRatingsAndProfile order', () => {
    beforeEach(async () => {
        setActivePinia(createPinia());
        routerReplace.mockReset();
        routerState.rememberRoute = null;
        vi.resetModules();

        const { useRatesStore } = await import('../stores/rates');
        useRatesStore().pending_rates = [];
    });

    it('redirects incomplete profile before identity validation', async () => {
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = {
            image: '',
            description: 'x',
            nro_doc: '123',
            mobile_phone: '341',
            identity_validation_required_for_user: true,
            identity_validated: false
        };
        authStore.appConfig = enforcedConfig;

        const { requireIdentityPendingRatingsAndProfile } = await import('./middleware.js');
        const next = vi.fn();

        requireIdentityPendingRatingsAndProfile(
            { name: 'conversations-list' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith(false);
        expect(routerReplace).toHaveBeenCalledWith({
            name: 'profile_update',
            query: { incompleteProfile: 'true' }
        });
    });

    it('redirects complete profile to identity validation when required', async () => {
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = { ...completeProfileUser };
        authStore.appConfig = enforcedConfig;

        const { requireIdentityPendingRatingsAndProfile } = await import('./middleware.js');
        const next = vi.fn();

        requireIdentityPendingRatingsAndProfile(
            { name: 'conversations-list' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith(false);
        expect(routerReplace).toHaveBeenCalledWith({ name: 'identity_validation' });
        expect(routerReplace).not.toHaveBeenCalledWith({
            name: 'profile_update',
            query: { incompleteProfile: 'true' }
        });
    });

    it('does not redirect to profile when user is not loaded yet', async () => {
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = null;
        authStore.appConfig = enforcedConfig;

        const { requireIdentityPendingRatingsAndProfile } = await import('./middleware.js');
        const next = vi.fn();

        requireIdentityPendingRatingsAndProfile(
            { name: 'conversations-list' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith();
        expect(routerReplace).not.toHaveBeenCalled();
    });

    it('stores route query when bouncing incomplete profile from manual validation', async () => {
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = {
            ...completeProfileUser,
            nro_doc: ''
        };
        authStore.appConfig = enforcedConfig;

        const { requireProfileThenIdentityValidation } = await import('./middleware.js');
        const next = vi.fn();
        const to = {
            name: 'identity_validation_manual',
            params: {},
            query: { request_id: '9', resubmit: '1' }
        };

        requireProfileThenIdentityValidation(to, { name: 'trips' }, next);

        expect(next).toHaveBeenCalledWith(false);
        expect(routerState.rememberRoute).toEqual({
            name: 'identity_validation_manual',
            params: {},
            query: { request_id: '9', resubmit: '1' }
        });
    });
});

describe('requireProfileThenIdentityValidation order', () => {
    beforeEach(async () => {
        setActivePinia(createPinia());
        routerReplace.mockReset();
        routerState.rememberRoute = null;
        vi.resetModules();
    });

    it('redirects complete profile to identity validation when required', async () => {
        const { useAuthStore } = await import('../stores/auth');
        const authStore = useAuthStore();
        authStore.user = { ...completeProfileUser };
        authStore.appConfig = enforcedConfig;

        const { requireProfileThenIdentityValidation } = await import('./middleware.js');
        const next = vi.fn();

        requireProfileThenIdentityValidation(
            { name: 'live-share-trip' },
            { name: 'trips' },
            next
        );

        expect(next).toHaveBeenCalledWith(false);
        expect(routerReplace).toHaveBeenCalledWith({ name: 'identity_validation' });
    });
});
