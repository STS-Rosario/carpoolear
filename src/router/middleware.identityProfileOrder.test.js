import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const routerReplace = vi.fn();

vi.mock('../router', () => ({
    default: {
        replace: (...args) => routerReplace(...args),
        rememberRoute: null
    }
}));

describe('requireIdentityPendingRatingsAndProfile order', () => {
    beforeEach(async () => {
        setActivePinia(createPinia());
        routerReplace.mockReset();
        vi.resetModules();
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
        authStore.appConfig = {
            identity_validation_enabled: true,
            identity_validation_optional: false
        };

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
});
