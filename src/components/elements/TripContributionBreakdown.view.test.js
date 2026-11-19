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

    it('shows typed or legacy fuel quantity on the fuel table row', () => {
        expect(componentSource).toContain('resolveContributionFuelDisplay');
        expect(componentSource).toContain('fuelLineLabel');
        expect(componentSource).toContain('tripContributionBreakdownFuelTyped');
        expect(componentSource).toContain('tripContributionBreakdownFuel');
    });

    it('shows the toll percentage on the peajes table row', () => {
        expect(componentSource).toMatch(
            /\$t\(\s*'tripContributionBreakdownTollsLabel'\s*,\s*\{\s*percent:\s*lines\.tollsPercent/
        );
    });

    it('keeps the consumption tooltip on the fuel row', () => {
        const fuelIndex = componentSource.indexOf('fuelLineLabel');
        const tooltipIndex = componentSource.indexOf(':data-tooltip="fuelTooltip"');
        const tollsIndex = componentSource.indexOf(
            'tripContributionBreakdownTollsLabel'
        );

        expect(fuelIndex).toBeGreaterThan(-1);
        expect(tooltipIndex).toBeGreaterThan(-1);
        expect(tooltipIndex).toBeLessThan(tollsIndex);
        expect(componentSource).toContain(
            'tripContributionBreakdownConsumptionTooltip'
        );
        expect(componentSource).toContain(
            'tripContributionBreakdownConsumptionTooltipTyped'
        );
        expect(componentSource).not.toMatch(/<button[^>]*tooltip-bottom/);
        expect(componentSource).toContain('@click.stop');
    });

    it('uses dark text so the table is readable on light backgrounds', () => {
        expect(componentSource).toMatch(
            /\.trip-contribution-breakdown\s*\{[^}]*color:\s*var\(--ds-text-primary/s
        );
    });
});

describe('TripContributionBreakdown.vue fuel profile and abuse report', () => {
    const source = componentSource.replace(/\r\n/g, '\n');

    it('accepts fuel profile, visibility flag and report route props', () => {
        expect(source).toMatch(/fuelProfile:\s*\{[\s\S]*?default: null/);
        expect(source).toMatch(/showFuelAbuseReport:\s*\{[\s\S]*?default: false/);
        expect(source).toMatch(/fuelAbuseRoute:\s*\{[\s\S]*?default: null/);
    });

    it('folds fuel type and consumption into the main fuel line', () => {
        expect(source).toContain('tripContributionBreakdownFuelTyped');
        expect(source).toContain('unitWordKey');
        expect(source).toContain('fuelTypeKey');
        expect(source).toContain('consumptionKey');
        expect(source).not.toContain(
            'trip-contribution-breakdown__fuel-profile'
        );
    });

    it('renders Denunciar abuso link with info tooltip only when allowed', () => {
        expect(source).toMatch(
            /v-if="showFuelAbuseReport && fuelAbuseRoute"[\s\S]*?<router-link[\s\S]*?:to="fuelAbuseRoute"/
        );
        expect(source).toContain("$t('fuelAbuseReportLink')");
        expect(source).toContain("$t('fuelAbuseReportTooltip')");
        expect(source).toContain('fa-info-circle');
    });
});
