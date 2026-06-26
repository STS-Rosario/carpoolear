import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const EXPECTED_MOBILE_FOOTER = [
    { id: 'home', labelKey: 'inicio', icon: 'home', url: 'trips' },
    { id: 'my-trips', labelKey: 'misViajes', icon: 'seat', url: 'my-trips' },
    { id: 'new-trip', labelKey: 'crearViaje', icon: 'add', url: 'new-trip' },
    { id: 'profile', labelKey: 'miCuenta', icon: 'contact', url: 'profile' },
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
});
