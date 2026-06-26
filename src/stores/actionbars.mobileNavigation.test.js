import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const EXPECTED_MOBILE_FOOTER = [
    { id: 'home', labelKey: 'inicio', icon: 'home', url: 'trips' },
    { id: 'my-trips', labelKey: 'misViajes', icon: 'my-trips', url: 'my-trips' },
    { id: 'new-trip', labelKey: 'crearViaje', icon: 'create-trip', url: 'new-trip' },
    { id: 'profile', labelKey: 'miCuenta', icon: 'account', url: 'profile' },
    { id: 'menu', labelKey: 'menu', icon: 'menu', url: 'mobile-menu' }
];

describe('actionbars store mobile footer navigation', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('defines five labeled footer tabs for mobile navigation', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();

        expect(store.footer_buttons).toHaveLength(5);
        EXPECTED_MOBILE_FOOTER.forEach((expected, index) => {
            const button = store.footer_buttons[index];
            expect(button.id).toBe(expected.id);
            expect(button.labelKey).toBe(expected.labelKey);
            expect(button.icon).toBe(expected.icon);
            expect(button.url).toBe(expected.url);
        });
    });

    it('includes a menu tab that routes to the mobile menu screen', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();
        const menuButton = store.footer_buttons.find((b) => b.id === 'menu');

        expect(menuButton).toBeDefined();
        expect(menuButton.url).toBe('mobile-menu');
    });

    it('opens the mobile menu and remembers the current route', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();
        const push = vi.fn(() => Promise.resolve());
        const router = {
            currentRoute: {
                value: {
                    name: 'profile',
                    params: { id: 'me' },
                    query: {}
                }
            },
            push,
            stack: [],
            _push: push
        };

        await store.openMobileMenu(router);

        expect(store.mobileMenuReturnRoute).toEqual({
            name: 'profile',
            params: { id: 'me' },
            query: {}
        });
        expect(push).toHaveBeenCalledWith({ name: 'mobile-menu' });
    });

    it('closes the mobile menu when the menu tab is tapped again', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();
        store.mobileMenuReturnRoute = {
            name: 'trips',
            params: {},
            query: { clearSearch: 'true' }
        };
        const push = vi.fn(() => Promise.resolve());
        const router = {
            currentRoute: {
                value: {
                    name: 'mobile-menu',
                    params: {},
                    query: {}
                }
            },
            push,
            stack: [{ name: 'mobile-menu' }],
            _push: push
        };

        await store.openMobileMenu(router);

        expect(push).toHaveBeenCalledWith({
            name: 'trips',
            params: {},
            query: { clearSearch: 'true' }
        });
        expect(store.mobileMenuReturnRoute).toBeNull();
    });

    it('closes the mobile menu using the remembered route', async () => {
        const { useActionbarsStore } = await import('./actionbars.js');
        const store = useActionbarsStore();
        store.mobileMenuReturnRoute = {
            name: 'my-trips',
            params: {},
            query: {}
        };
        const push = vi.fn(() => Promise.resolve());
        const router = {
            stack: [{ name: 'mobile-menu' }],
            _push: push
        };

        await store.closeMobileMenu(router);

        expect(push).toHaveBeenCalledWith({
            name: 'my-trips',
            params: {},
            query: {}
        });
        expect(store.mobileMenuReturnRoute).toBeNull();
    });
});
