import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileInfo.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ProfileInfo cars display', () => {
    it('lists all active patentes when viewing a profile', () => {
        expect(viewSource).toContain('activeCarsWithPlate');
        expect(viewSource).toContain('visibleCars');
        expect(viewSource).toContain('v-for="car in visibleCars"');
        expect(viewSource).toContain('profile-car-patente');
        expect(viewSource).not.toContain('profile.cars[0].patente');
    });
});

describe('ProfileInfo report action', () => {
    it('links to a denuncia ticket for another user profile', () => {
        expect(viewSource).toContain("from '../../utils/reportTicketRoute'");
        expect(viewSource).toContain('buildReportTicketRoute');
        expect(viewSource).toContain('reportTicketSubjectForUser');
        expect(viewSource).toContain("$t('denunciar')");
        expect(viewSource).toContain('fa-flag');
        expect(viewSource).toContain('canReportProfile');
        expect(viewSource).toMatch(
            /v-if="canReportProfile"[\s\S]*?:to="reportProfileRoute"/s
        );
    });
});
