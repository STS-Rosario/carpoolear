import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'CoordinateTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('CoordinateTrip.vue contribution warning', () => {
    it('uses optional amountPart so zero-price trips omit currency in driver and passenger copy', () => {
        expect(viewSource).toContain('getContributionWarningAmountPart');
        expect(viewSource).toMatch(
            /\$t\(\s*'coordinateTripContributionWarningDriver'\s*,\s*\{[\s\S]*?\bamountPart\b/s
        );
        expect(viewSource).toMatch(
            /\$t\(\s*'coordinateTripContributionWarningPassengerPrefix'\s*,\s*\{[\s\S]*?\bamountPart\b/s
        );
    });

    it('links passenger report action to soporte', () => {
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerPrefix'");
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerSuffix')");
        expect(viewSource).toMatch(
            /<router-link\s+:to="\{\s*path:\s*'\/soporte'\s*\}">\s*\{\{\s*\$t\('coordinateTripContributionWarningPassengerReportLink'\)\s*\}\}\s*<\/router-link>/
        );
    });
});
