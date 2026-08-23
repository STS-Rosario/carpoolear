import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('HeaderApp donation after rating header', () => {
    it('shows the minimal donation header instead of the full app chrome', () => {
        expect(headerSource).toContain('usesDonationAfterRatingHeader');
        expect(headerSource).toContain('DonationAfterRatingHeader');
        expect(headerSource).toMatch(
            /v-if="usesDonationAfterRatingHeader"[\s\S]*DonationAfterRatingHeader/
        );
        expect(headerSource).toMatch(
            /v-else[\s\S]*IdentityValidationCountdownBanner/
        );
        expect(headerSource).not.toMatch(
            /usesDonationAfterRatingHeader[\s\S]*IdentityValidationCountdownBanner/
        );
    });
});
