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
});
