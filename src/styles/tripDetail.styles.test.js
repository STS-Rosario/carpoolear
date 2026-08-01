import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-detail.css'),
    'utf8'
);

/** Match a mobile rule that may also be dual-scoped with the desktop twin. */
function dualRule(mobileSelector, bodySnippet) {
    const esc = (s) =>
        s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const mobile = esc(mobileSelector);
    const desktop = esc(mobileSelector.replace(/--mobile/g, '--desktop'));
    return new RegExp(
        `${mobile}(?:\\s*,\\s*${desktop})?\\s*\\{[^}]*${bodySnippet}`
    );
}

describe('trip-detail.css', () => {
    it('scopes mobile section labels and stack under .trip-detail', () => {
        expect(css).toContain('.trip-detail');
        expect(css).toContain('.trip-detail__section-title');
        expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/);
        expect(css).toContain('.trip-detail__stack');
        expect(css).toContain('.trip-detail__cta .btn-primary');
        expect(css).toContain('.trip-detail__passengers');
    });

    it('scopes shared visual rules under trip-detail mobile/desktop modifiers', () => {
        // Shared visual rules before the first @media must include --mobile
        // (often dual-scoped with --desktop). Unscoped rules would leak.
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
            dualRule(
                '.trip-detail--mobile .trip-detail__section-title',
                'font-size:\\s*0\\.875rem'
            )
        );
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__section-title',
                'font-weight:\\s*var\\(--ds-font-weight-normal,\\s*400\\)'
            )
        );
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__region',
                'font-size:\\s*0\\.875rem'
            )
        );
    });

    it('keeps contribution label in sentence case on mobile condiciones', () => {
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__condiciones .trip_seats-available_label',
                'text-transform:\\s*none'
            )
        );
    });

    it('removes the dotted border under condiciones preferences on mobile', () => {
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__condiciones .trip-data--container .trip-data',
                'border-bottom:\\s*0'
            )
        );
    });

    it('keeps distance, time and CO2 stats the same size and centered on mobile', () => {
        expect(css).toContain('.trip-detail--mobile .trip-detail__stats');
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__stats',
                'justify-content:\\s*center'
            )
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\.trip-detail-component\s+\.trip-stats\s*>\s*div\s*>\s*span:last-child[\s\S]*?font-size:\s*inherit/
        );
        expect(css).toMatch(
            /\.trip-detail--mobile\s+\.trip-detail__stats\s+span[\s\S]*?font-weight:\s*inherit/
        );
    });
});

describe('trip detail desktop card layout', () => {
    it('defines desktop card shell and two-column grids', () => {
        expect(css).toContain('.trip-detail--desktop');
        expect(css).toContain('.trip-detail__card');
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*border-radius:\s*var\(--ds-card-radius/
        );
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*box-shadow:\s*var\(--ds-card-shadow/
        );
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*background:\s*var\(--ds-card-bg/
        );
        expect(css).toContain('.trip-detail__detalle-grid');
        expect(css).toContain('.trip-detail__actions-grid');
        expect(css).toMatch(
            /@media\s*\(min-width:\s*768px\)[\s\S]*\.trip-detail__detalle-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*1fr/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__section\.trip-detail__actions-grid\s*\{[^}]*display:\s*grid/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__section\.trip-detail__actions-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*1fr\s*1fr/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__lugares-col\s*\{[^}]*flex-direction:\s*column/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__seats-pill\s*\{[^}]*font-size:\s*2\.25rem/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver\s*\{[^}]*background:\s*var\(--trip-detail-driver-bg/
        );
    });

    it('neutralizes TripSeats bootstrap offsets inside desktop trip detail', () => {
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*margin-left:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*width:\s*100%/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*float:\s*none/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*padding-left:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-seats\s+\.row\s*\{[^}]*margin:\s*0/
        );
    });

    it('hides the TripPrice spacer div under desktop contribucion, mirroring the mobile rule', () => {
        expect(css).toMatch(
            dualRule(
                ".trip-detail--mobile .trip-detail__condiciones .trip-seats > div[style*='height']",
                'display:\\s*none\\s*!important'
            )
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__contribucion\s+\.trip-seats\s*>\s*div\[style\*='height'\]\s*\{[^}]*display:\s*none\s*!important/
        );
    });

    it('neutralizes bootstrap row negative margins for desktop passengers and stats columns', () => {
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__joined\s+\.row\s*\{[^}]*margin-left:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__joined\s+\.row\s*\{[^}]*margin-right:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-stats\.row\s*\{[^}]*margin-left:\s*0/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-stats\.row\s*\{[^}]*margin-right:\s*0/
        );
    });
});

describe('trip detail card/stack nesting', () => {
    it('lets the card, not the inert single-child stack, govern the flex column of sections', () => {
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__card',
                'display:\\s*flex'
            )
        );
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__card',
                'flex-direction:\\s*column'
            )
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__card[\s\S]*?display:\s*flex/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__card[\s\S]*?flex-direction:\s*column/
        );
    });
});

describe('trip detail mobile DETALLE gap', () => {
    it('tightens the detalle-grid gap on mobile so route/stats spacing matches the pre-shared-grid layout', () => {
        expect(css).toMatch(
            dualRule(
                '.trip-detail--mobile .trip-detail__detalle-grid',
                'gap:\\s*0\\.75rem'
            )
        );
    });
});

describe('trip detail labeled stats', () => {
    it('stacks each stat label above its value and keeps middot separators', () => {
        expect(css).toMatch(
            /\.trip-detail--(?:mobile|desktop)\s+\.trip-detail__stat\s*\{[^}]*flex-direction:\s*column/
        );
        expect(css).toContain('.trip-detail__stat-label');
        expect(css).toContain('.trip-detail__stat-value');
        expect(css).toMatch(
            /\.trip-detail__stat-label[^{]*\{[^}]*font-weight:\s*var\(--ds-font-weight-bold/
        );
        expect(css).toMatch(
            /\.trip-detail--(?:mobile|desktop)\s+\.trip-detail__stats-sep\s*\{[^}]*align-self:\s*center/
        );
    });
});

describe('trip detail desktop page title', () => {
    it('styles a white page-header band inside the card, with a square grey driver band below', () => {
        expect(css).toContain('.trip-detail__page-header');
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__page-header\s*\{[^}]*background:\s*(#fff|var\(--trip-detail-canvas|#ffffff)/
        );
        expect(css).not.toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__page-header\s*\{[^}]*box-shadow:\s*var\(--ds-card-shadow/
        );
        expect(css).not.toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__page-header\s*\{[^}]*border-radius:\s*var\(--ds-card-radius/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__page-title\s*\{[^}]*font-size:\s*1\.5rem/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver\s*\{[^}]*border-top:\s*1px\s+solid\s+#d6d4cf/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver\s*\{[^}]*border-radius:\s*0/
        );
    });

    it('sizes the driver avatar to the height of the driver info block', () => {
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver__mobile-top\s*\{[^}]*align-items:\s*stretch/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver__mobile\s+\.trip_driver_img\s*\{[^}]*height:\s*100%/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver__mobile\s+\.trip_driver_img\s*\{[^}]*aspect-ratio:\s*1\s*\/\s*1/
        );
    });
});

describe('trip detail desktop shares mobile visual language', () => {
    it('styles route timeline, chips, and city/region on desktop like mobile', () => {
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__route[\s\S]*?display:\s*flex/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__route-graphic::before[\s\S]*?background:\s*var\(--ds-action/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__city[\s\S]*?font-weight:\s*var\(--ds-font-weight-bold/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__chip[\s\S]*?background:\s*var\(--trip-detail-chip-bg/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__stats[\s\S]*?color:\s*var\(--ds-text-secondary/
        );
    });

    it('styles desktop condiciones preferences and contribución price like mobile', () => {
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__condiciones[\s\S]*?\.trip-data\s+em\s*\{[^}]*float:\s*none/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__contribucion\s+\.trip_seat-price_value-main\s*\{[^}]*font-size:\s*1\.5rem/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver\s+a[\s\S]*?color:\s*var\(--ds-text-primary/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-detail__lugares\s+\.trip_seats-available_value\s*\{[^}]*color:\s*var\(--ds-text-primary/
        );
    });
});
