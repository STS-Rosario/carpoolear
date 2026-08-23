import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'DonationAfterRatingHeader.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('DonationAfterRatingHeader', () => {
    it('renders only a centered logo without navigation or donate actions', () => {
        expect(headerSource).toContain('donation-after-rating-app-header');
        expect(headerSource).toContain('donation-after-rating-app-header__logo');
        expect(headerSource).toContain('header_logo');
        expect(headerSource).not.toContain('router-link');
        expect(headerSource).not.toContain('header-donate');
        expect(headerSource).not.toContain('crearViaje');
        expect(headerSource).not.toContain('HeaderMenuDropdown');
        expect(headerSource).not.toContain('PendingRatingsBanner');
        expect(headerSource).not.toContain('IdentityValidationCountdownBanner');
    });
});
