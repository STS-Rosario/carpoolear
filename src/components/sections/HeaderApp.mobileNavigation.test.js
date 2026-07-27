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

    it('does not show donate button, search, or ellipsis menu on mobile', () => {
        expect(headerSource).not.toMatch(
            /v-if="isMobile && user && !shouldHideDonationOnIOSCapacitor/
        );
        expect(headerSource).toContain('v-if="showMenu && !isMobile"');
        expect(headerSource).toContain("item.id !== 'search'");
        expect(headerSource).toContain('mobileUtilityHeaderButtons');
    });
});
