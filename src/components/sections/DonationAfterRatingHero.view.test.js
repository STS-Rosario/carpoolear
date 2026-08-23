import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const heroPath = path.resolve(__dirname, 'DonationAfterRatingHero.vue');
const heroSource = fs.readFileSync(heroPath, 'utf8');

describe('DonationAfterRatingHero', () => {
    it('renders the two-line hero title with Dela Gothic One styling', () => {
        expect(heroSource).toContain('donation-after-rating-hero');
        expect(heroSource).toContain('donation-after-rating-hero__title');
        expect(heroSource).toContain('NECESITAMOS');
        expect(heroSource).toContain('TU APORTE');
        expect(heroSource).toContain("'Dela Gothic One'");
        expect(heroSource).toContain('--ds-text-primary');
        expect(heroSource).toContain('--ds-header-donate-bg');
    });

    it('shows the hero image from API_URL/img with a rotated green backdrop', () => {
        expect(heroSource).toContain('getDonationAfterRatingHeroImageUrl');
        expect(heroSource).toContain('donation-after-rating-hero__image-frame');
        expect(heroSource).toContain('donation-after-rating-hero__image-backdrop');
        expect(heroSource).toContain('donation-after-rating-hero__image');
        const backdropRule = heroSource.match(
            /\.donation-after-rating-hero__image-backdrop\s*\{[^}]+\}/
        );
        expect(backdropRule).not.toBeNull();
        expect(backdropRule[0]).not.toMatch(/transform:\s*rotate/);
        expect(heroSource).toMatch(
            /\.donation-after-rating-hero__image\s*\{[\s\S]*?transform:\s*rotate/
        );
    });

    it('uses a side-by-side layout on desktop and stacks on mobile', () => {
        expect(heroSource).toMatch(
            /@media \(min-width: 768px\)[\s\S]*donation-after-rating-hero[\s\S]*grid-template-columns/
        );
        expect(heroSource).toMatch(
            /donation-after-rating-hero__media[\s\S]*width:\s*100%/
        );
    });

    it('spans the full viewport width and keeps the title and image within bounds', () => {
        expect(heroSource).toContain('donation-after-rating-hero--full-width');
        expect(heroSource).toMatch(
            /donation-after-rating-hero__title-line[\s\S]*max-width:\s*100%/
        );
        expect(heroSource).toMatch(
            /donation-after-rating-hero__media[\s\S]*overflow:\s*hidden/
        );
        expect(heroSource).toMatch(
            /@media \(min-width: 768px\)[\s\S]*align-items:\s*start/
        );
    });
});
