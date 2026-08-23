import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('HeaderApp donation after rating header', () => {
    it('shows the minimal donation header instead of the full app chrome', () => {
        const template = headerSource.match(/<template>([\s\S]*)<\/template>/)[1];

        expect(headerSource).toContain('usesDonationAfterRatingHeader');
        expect(headerSource).toContain('DonationAfterRatingHeader');
        expect(template).toContain(
            '<DonationAfterRatingHeader v-if="usesDonationAfterRatingHeader" />'
        );
        expect(template).toContain('<template v-else>');
        expect(template.indexOf('DonationAfterRatingHeader')).toBeLessThan(
            template.indexOf('<template v-else>')
        );
        expect(template).toMatch(
            /v-else[\s\S]*IdentityValidationCountdownBanner/
        );
    });
});
