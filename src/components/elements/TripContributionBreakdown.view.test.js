import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripContributionBreakdown.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripContributionBreakdown.vue', () => {
    it('formats API breakdown with i18n line items and consumption tooltip', () => {
        expect(componentSource).toContain('formatBreakdownLines');
        expect(componentSource).toContain('tripContributionBreakdown.js');
        expect(componentSource).toContain("$t('tripContributionBreakdownFuelLiter'");
        expect(componentSource).toContain("$t('tripContributionBreakdownLiters'");
        expect(componentSource).toContain("$t('tripContributionBreakdownFuelCost'");
        expect(componentSource).toContain("$t('tripContributionBreakdownTolls'");
        expect(componentSource).toContain("$t('tripContributionBreakdownSellado'");
        expect(componentSource).toContain("$t('tripContributionBreakdownSelladoBonificado')");
        expect(componentSource).toContain("$t('tripContributionBreakdownTotal'");
        expect(componentSource).toContain("$t('tripContributionBreakdownTotalWithSellado'");
        expect(componentSource).toContain("$t('tripContributionBreakdownTotalWithSelladoBonificado'");
        expect(componentSource).toContain("$t('tripContributionBreakdownOccupants'");
        expect(componentSource).toContain("$t('tripContributionBreakdownPerPerson'");
        expect(componentSource).toContain('tooltip-bottom');
        expect(componentSource).toContain("$t('tripContributionBreakdownConsumptionTooltip'");
        expect(componentSource).toContain('lines.showSellado');
        expect(componentSource).toContain('lines.selladoBonificado');
    });

    it('does not use a button for the liters tooltip trigger', () => {
        expect(componentSource).not.toMatch(
            /<button[^>]*tooltip-bottom/
        );
        expect(componentSource).toContain('@click.stop');
    });

    it('uses dark text so the list is readable on light backgrounds', () => {
        expect(componentSource).toMatch(
            /\.trip-contribution-breakdown\s*\{[^}]*color:\s*var\(--ds-text-primary/s
        );
    });
});
