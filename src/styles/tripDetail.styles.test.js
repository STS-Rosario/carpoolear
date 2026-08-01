import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-detail.css'),
    'utf8'
);

describe('trip-detail.css', () => {
    it('scopes mobile section labels and stack under .trip-detail', () => {
        expect(css).toContain('.trip-detail');
        expect(css).toContain('.trip-detail__section-title');
        expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/);
        expect(css).toContain('.trip-detail__stack');
        expect(css).toContain('.trip-detail__cta .btn-primary');
        expect(css).toContain('.trip-detail__passengers');
    });

    it('scopes base visual rules under .trip-detail--mobile so desktop keeps its own layout/colors', () => {
        // Every declaration block outside the max-width media query must be
        // scoped under .trip-detail--mobile, otherwise it would also apply to
        // desktop trip detail (same markup classes, isMobile === false).
        const beforeMediaQuery = css.split('@media')[0];
        const ruleBlocks = beforeMediaQuery.match(/[^{}]+\{[^}]*\}/g) || [];

        expect(ruleBlocks.length).toBeGreaterThan(0);
        ruleBlocks.forEach((block) => {
            const selector = block.split('{')[0];
            expect(selector).toContain('.trip-detail--mobile');
        });

        expect(css).toContain('.trip-detail.trip-detail--mobile');
        expect(css).toContain('.trip-detail--mobile .trip-detail__cta-secondary');
        expect(css).toContain('.trip-detail--mobile .trip-detail__passengers');
    });

    it('uses a white page canvas with a grey driver header band', () => {
        expect(css).toMatch(
            /\.trip-detail(?:\.trip-detail)?--mobile[\s\S]*?--trip-detail-canvas:\s*#fff/
        );
        expect(css).toContain('--trip-detail-driver-bg');
        expect(css).toContain('.trip-detail--mobile .trip-driver');
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-driver[\s\S]*?background:\s*var\(--trip-detail-driver-bg/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-driver[\s\S]*?border-top:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-driver[\s\S]*?border-bottom:\s*1px\s+solid\s+#d6d4cf/
        );
        expect(css).toMatch(
            /@media[^{]*max-width:\s*767px[^{]*\{[\s\S]*\.trip-detail--mobile\s+\.trip-driver[\s\S]*?margin:\s*0\s+-10px/
        );
        expect(css).toContain('.trip-detail__route');
        expect(css).toContain('.trip-detail__chip');
    });

    it('sizes section titles like province labels: 0.875rem regular weight', () => {
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__section-title\s*\{[^}]*font-size:\s*0\.875rem/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__section-title\s*\{[^}]*font-weight:\s*var\(--ds-font-weight-normal,\s*400\)/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__region\s*\{[^}]*font-size:\s*0\.875rem/
        );
    });

    it('keeps contribution label in sentence case on mobile condiciones', () => {
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__condiciones\s+\.trip_seats-available_label\s*\{[^}]*text-transform:\s*none/
        );
    });

    it('removes the dotted border under condiciones preferences on mobile', () => {
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__condiciones\s+\.trip-data--container\s+\.trip-data\s*\{[^}]*border-bottom:\s*0/
        );
    });

    it('keeps distance, time and CO2 stats the same size and centered on mobile', () => {
        expect(css).toContain('.trip-detail--mobile .trip-detail__stats');
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__stats\s*\{[^}]*justify-content:\s*center/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\.trip-detail-component\s+\.trip-stats\s*>\s*div\s*>\s*span:last-child[\s\S]*?font-size:\s*inherit/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__stats\s+span[\s\S]*?font-weight:\s*inherit/
        );
    });
});
