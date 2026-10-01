import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerPath = path.resolve(__dirname, 'DonationAfterRatingHeader.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('DonationAfterRatingHeader', () => {
    it('renders carpoolear and STS project branding in one line', () => {
        expect(headerSource).toContain('donation-after-rating-app-header');
        expect(headerSource).toContain("$t('proyectoDe')");
        expect(headerSource).toContain('logo_sts_nuevo_color.png');
        expect(headerSource).toContain('flex-wrap: nowrap');
        expect(headerSource).toMatch(
            /donation-after-rating-app-header__project[\s\S]*color:\s*#fff/
        );
        expect(headerSource).toMatch(
            /donation-after-rating-app-header__sts-logo[\s\S]*filter:\s*brightness\(0\)\s*invert\(1\)/
        );
        expect(headerSource).not.toContain('router-link');
        expect(headerSource).not.toContain('header-donate');
    });
});
