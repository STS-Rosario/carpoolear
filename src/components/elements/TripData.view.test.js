import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripData.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripData trip car display', () => {
    it('does not duplicate patente (shown in TripDescription instead)', () => {
        expect(viewSource).not.toContain('trip.car.patente');
    });
});

describe('TripData trip visibility', () => {
    it('omits friendship/visibility rows so condiciones match the redesign preferences list', () => {
        expect(viewSource).not.toContain('friendship_type_id');
        expect(viewSource).not.toContain("$t('publico')");
        expect(viewSource).not.toContain("$t('privacidadViaje')");
        expect(viewSource).toContain("$t('nofumar')");
        expect(viewSource).toContain("$t('noanimales')");
        expect(viewSource).toContain("$t('noninos')");
    });
});
