import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.resolve(__dirname, 'Profile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Profile view', () => {
    it('shows account nav on desktop for the signed-in user profile', () => {
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain(':show-nav="isMyOwnProfile"');
        expect(viewSource).toContain('isMyOwnProfile');
    });

    it('wraps tabs in profile-page shell with identity header above tabs', () => {
        expect(viewSource).toContain('profile-page');
        expect(viewSource).toContain('ProfileIdentityHeader');
        expect(viewSource).toContain('profile-page__content-card');
        const headerIndex = viewSource.indexOf('ProfileIdentityHeader');
        const tabsetIndex = viewSource.indexOf('<tabset');
        expect(headerIndex).toBeGreaterThan(-1);
        expect(tabsetIndex).toBeGreaterThan(headerIndex);
        expect(viewSource).not.toContain('Resumen');
        expect(viewSource).not.toContain('viajesJuntos');
    });

    it('deep-links Viajes / Perfil / Calificaciones via query and defaults to Perfil', () => {
        expect(viewSource).toContain('resolveProfileTabIndex');
        expect(viewSource).toContain("from '../../utils/profileDeepLinks'");
        expect(viewSource).toContain('this.$route.query');
        expect(viewSource).toContain('applyProfileDeepLink');
        expect(viewSource).not.toContain('getRememberedTab');
    });

    it('shows pending friend-request banner above tabs for incoming requests', () => {
        const headerIndex = viewSource.indexOf('ProfileIdentityHeader');
        const bannerIndex = viewSource.indexOf(
            'profile-pending-friend-request'
        );
        const tabsetIndex = viewSource.indexOf('<tabset');
        expect(bannerIndex).toBeGreaterThan(headerIndex);
        expect(tabsetIndex).toBeGreaterThan(bannerIndex);
        expect(viewSource).toContain('home-prompt-banner');
        expect(viewSource).toContain('fa-user-plus');
        expect(viewSource).toContain("$t('solicitudAmistadPendiente')");
        expect(viewSource).toContain("friendship_state === 'pending_received'");
        expect(viewSource).toMatch(
            /variant="tertiary"[\s\S]*?tone="destructive"[\s\S]*?icon-right="fa fa-times"[\s\S]*?\$t\('rechazar'\)/
        );
        expect(viewSource).toMatch(
            /variant="primary"[\s\S]*?icon-right="fa fa-check"[\s\S]*?\$t\('aceptar'\)/
        );
        expect(viewSource).toContain('onAcceptFriend');
        expect(viewSource).toContain('onRejectFriend');
        expect(viewSource).toContain('useFriendsStore');
        expect(viewSource).toContain("acceptFriend: 'accept'");
        expect(viewSource).toContain("rejectFriend: 'reject'");
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /\.profile-pending-friend-request\s*\{[^}]*width:\s*fit-content/s
        );
        expect(viewSource).toMatch(
            /\.profile-pending-friend-request\s*\{[^}]*max-width:\s*100%/s
        );
    });
});
