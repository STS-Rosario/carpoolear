import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('HeaderApp mobile navigation', () => {
    it('shows notification and message icons with badges when logged in on mobile', () => {
        expect(headerSource).toContain('header_mobile_actions');
        expect(headerSource).toContain('toNotifications');
        expect(headerSource).toContain('toConversations');
        expect(headerSource).toContain('notificationsCount');
        expect(headerSource).toContain('unreadMessagesCount');
        expect(headerSource).toContain('v-if="isMobile && logged"');
    });

    it('does not show donate button, search, or ellipsis menu on mobile', () => {
        expect(headerSource).not.toMatch(
            /v-if="isMobile && user && !shouldHideDonationOnIOSCapacitor/
        );
        expect(headerSource).not.toContain('fa-ellipsis-v');
        expect(headerSource).not.toContain("item.id === 'search'");
        expect(headerSource).not.toMatch(
            /v-for="item in rightHeaderButton"[^]*visible-xs/s
        );
    });
});
