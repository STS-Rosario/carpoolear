import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDriver.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripDriver report action', () => {
    it('links to a denuncia ticket for the trip driver when viewer is not the driver', () => {
        expect(viewSource).toContain("from '../../utils/reportTicketRoute'");
        expect(viewSource).toContain('buildReportTicketRoute');
        expect(viewSource).toContain('reportTicketSubjectForTrip');
        expect(viewSource).toContain("$t('denunciar')");
        expect(viewSource).toContain('fa-flag');
        expect(viewSource).toContain('canReportDriver');
        expect(viewSource).toMatch(
            /v-if="canReportDriver"[\s\S]*?:to="reportTripRoute"/s
        );
    });
});
