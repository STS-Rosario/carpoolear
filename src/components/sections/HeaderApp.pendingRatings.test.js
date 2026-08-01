import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const bannerPath = path.resolve(
    __dirname,
    '../PendingRatingsBanner.vue'
);
const headerPath = path.resolve(__dirname, 'HeaderApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('PendingRatingsBanner', () => {
    it('uses cream prompt-banner styling with i18n banner text', () => {
        const bannerSource = fs.readFileSync(bannerPath, 'utf8');
        expect(bannerSource).toContain('pending-ratings-banner');
        expect(bannerSource).toContain('home-prompt-banner');
        expect(bannerSource).toContain("$t('pendingRatingsBanner')");
        expect(bannerSource).toContain("name: 'my-trips'");
        expect(bannerSource).toMatch(
            /\.pending-ratings-banner\s*\{[^}]*margin-top:\s*1rem/s
        );
        expect(bannerSource).not.toContain('#c00');
        expect(bannerSource).not.toContain('#f0ad4e');
    });
});

describe('HeaderApp pending ratings banner', () => {
    it('renders PendingRatingsBanner below identity validation banner', () => {
        expect(headerSource).toContain('<PendingRatingsBanner />');
        const identityIndex = headerSource.indexOf(
            '<IdentityValidationCountdownBanner />'
        );
        const pendingIndex = headerSource.indexOf('<PendingRatingsBanner />');
        expect(identityIndex).toBeGreaterThan(-1);
        expect(pendingIndex).toBeGreaterThan(identityIndex);
    });
});
