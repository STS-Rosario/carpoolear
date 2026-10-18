import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripContributionBreakdown.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripContributionBreakdown.vue', () => {
    it('renders the compact table without the leftover verbose list', () => {
        expect(componentSource).toContain('formatBreakdownLines');
        expect(componentSource).toContain('tripContributionBreakdown.js');
        expect(componentSource).toContain('trip-contribution-breakdown__table');
        expect(componentSource).toContain('tripContributionBreakdownFuel');
        expect(componentSource).toContain('tripContributionBreakdownTollsLabel');
        expect(componentSource).toContain('unLitroName');
        expect(componentSource).toContain('tripContributionBreakdownTripTotal');
        expect(componentSource).toContain('tripContributionBreakdownOccupantsSplit');
        expect(componentSource).toContain('tripContributionBreakdownPerPersonLabel');
        expect(componentSource).toContain('tripContributionHowCalculatedExplainer');
        expect(componentSource).toContain(
            'tripContributionHowCalculatedExplainerWithoutUnLitro'
        );
        expect(componentSource).toContain('tripContributionTankTip');
        expect(componentSource).toContain('lines.fuelCostInteger');
        expect(componentSource).toContain('lines.showSellado');
        expect(componentSource).toContain('lines.selladoBonificado');
        expect(componentSource).not.toContain(
            'trip-contribution-breakdown__details'
        );
        expect(componentSource).not.toContain(
            "$t('tripContributionBreakdownFuelLiter'"
        );
        expect(componentSource).not.toContain(
            "$t('tripContributionBreakdownLiters'"
        );
        expect(componentSource).not.toContain(
            "$t('tripContributionBreakdownFuelCost'"
        );
        expect(componentSource).not.toContain(
            "$t('tripContributionBreakdownOccupants'"
        );
    });

    it('shows the liter count on the fuel table row', () => {
        expect(componentSource).toMatch(
            /\$t\(\s*'tripContributionBreakdownFuel'\s*,\s*\{\s*liters:\s*lines\.liters/
        );
    });

    it('shows the toll percentage on the peajes table row', () => {
        expect(componentSource).toMatch(
            /\$t\(\s*'tripContributionBreakdownTollsLabel'\s*,\s*\{\s*percent:\s*lines\.tollsPercent/
        );
    });

    it('keeps the consumption tooltip on the fuel row', () => {
        const fuelIndex = componentSource.indexOf(
            'tripContributionBreakdownFuel'
        );
        const tooltipIndex = componentSource.indexOf(
            "$t('tripContributionBreakdownConsumptionTooltip'"
        );
        const tollsIndex = componentSource.indexOf(
            'tripContributionBreakdownTollsLabel'
        );

        expect(fuelIndex).toBeGreaterThan(-1);
        expect(tooltipIndex).toBeGreaterThan(fuelIndex);
        expect(tooltipIndex).toBeLessThan(tollsIndex);
        expect(componentSource).not.toMatch(/<button[^>]*tooltip-bottom/);
        expect(componentSource).toContain('@click.stop');
    });

    it('uses dark text so the table is readable on light backgrounds', () => {
        expect(componentSource).toMatch(
            /\.trip-contribution-breakdown\s*\{[^}]*color:\s*var\(--ds-text-primary/s
        );
    });
});
