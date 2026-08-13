import { beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createPinia, setActivePinia } from 'pinia';

const footerPath = path.resolve(__dirname, 'FooterApp.vue');
const footerSource = fs.readFileSync(footerPath, 'utf8');

describe('FooterApp mobile navigation', () => {
    it('renders a text label under each footer icon', () => {
        expect(footerSource).toContain('mobile-footer-bar__label');
        expect(footerSource).toContain('$t(item.labelKey)');
    });

    it('shows a badge on my trips when there are pending requests', () => {
        expect(footerSource).toContain('myTripsBadgeCount');
        expect(footerSource).toContain('myTripsCount');
        expect(footerSource).toContain("item.id === 'my-trips'");
    });

    it('shows a badge on messages when there are unread conversations', () => {
        expect(footerSource).toContain('messagesBadgeCount');
        expect(footerSource).toContain('messagesCount');
        expect(footerSource).toContain("item.id === 'messages'");
    });

    it('uses fill icons that inherit active tab color', () => {
        expect(footerSource).toContain('color: inherit');
        expect(footerSource).toContain('fill: currentColor');
        expect(footerSource).toContain('stroke: none');
        expect(footerSource).not.toContain('stroke: currentColor');
    });

    it('renders a bottom indicator element for the active tab', () => {
        expect(footerSource).toContain('mobile-footer-bar__indicator');
        expect(footerSource).toContain('v-if="item.active"');
    });
});

describe('actionbars store mobile footer icons', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('uses my-trips and account icons for mis viajes and mi cuenta tabs', async () => {
        const { useActionbarsStore } = await import('../../stores/actionbars.js');
        const store = useActionbarsStore();
        const myTrips = store.footer_buttons.find((item) => item.id === 'my-trips');
        const account = store.footer_buttons.find((item) => item.id === 'profile');

        expect(myTrips.icon).toBe('my-trips');
        expect(account.icon).toBe('account');
    });
});
