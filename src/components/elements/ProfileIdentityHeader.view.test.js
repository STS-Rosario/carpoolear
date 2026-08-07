import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.resolve(__dirname, 'ProfileIdentityHeader.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ProfileIdentityHeader', () => {
    it('renders avatar, name, verified pill, thumbs ratings and trips', () => {
        expect(viewSource).toContain('profile-identity-header');
        expect(viewSource).toContain('v-imgSrc:profile');
        expect(viewSource).toContain('profile-identity-header__name');
        expect(viewSource).toContain("$t('usuarioVerificado')");
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('perfilViajesParticipados');
        expect(viewSource).toContain('getMembershipDuration');
        expect(viewSource).not.toContain('fa-smile');
        expect(viewSource).not.toContain('Resumen');
    });
});
