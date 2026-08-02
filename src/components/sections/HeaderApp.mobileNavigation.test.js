import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('HeaderApp mobile navigation', () => {
    it('shows notification icon with badge when logged in on mobile', () => {
        expect(headerSource).toContain('mobile-header-bar__actions');
        expect(headerSource).toContain('toNotifications');
        expect(headerSource).toContain('notificationsCount');
        expect(headerSource).not.toContain('unreadMessagesCount');
        expect(headerSource).toContain('v-if="isMobile && logged"');
        expect(headerSource).toContain('icon="bell"');
    });

    it('does not render a messages icon in the mobile header', () => {
        expect(headerSource).not.toContain('aria-label="Mensajes"');
        expect(headerSource).not.toMatch(/@click="toConversations"/);
        expect(headerSource).not.toContain('icon="message"');
    });

    it('shows a branded mobile header with logo and login or Doná', () => {
        expect(headerSource).toContain('mobile-header-bar--branded');
        expect(headerSource).toContain('showBrandedMobileHeader');
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*header_logo/
        );
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*v-if="!logged"[\s\S]*variant="header-create"[\s\S]*iniciarSesion/
        );
        expect(headerSource).toMatch(
            /showBrandedMobileHeader[\s\S]*variant="header-donate"/
        );
    });

    it('keeps search and ellipsis menu out of the branded mobile header', () => {
        expect(headerSource).toContain('v-if="showMenu && !isMobile"');
        expect(headerSource).toContain("item.id !== 'search'");
        expect(headerSource).toContain('mobileUtilityHeaderButtons');
    });

    it('does not render the legacy mobile trips Ingresar btn-primary', () => {
        expect(headerSource).not.toContain('btn-login-header');
        expect(headerSource).not.toContain('Ingresar');
        expect(headerSource).not.toContain('isTripsPage');
        expect(headerSource).not.toMatch(
            /btn btn-primary[\s\S]*:to="\{ name: 'login' \}"/
        );
    });
});
