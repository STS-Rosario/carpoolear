import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'CoordinateTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('CoordinateTrip.vue contribution warning', () => {
    it('links passenger report action to soporte', () => {
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerPrefix')");
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerSuffix')");
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerReportLink')");
        expect(viewSource).toContain("<router-link :to=\"{ path: '/soporte' }\">");
    });
});
