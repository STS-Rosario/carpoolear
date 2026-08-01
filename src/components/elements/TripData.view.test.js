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
    it('hides friendship/visibility rows on mobile trip detail', () => {
        expect(viewSource).toContain('isMobile');
        expect(viewSource).toMatch(
            /v-if="!isMobile"[\s\S]*?friendship_type_id|friendship_type_id[\s\S]*?v-if="!isMobile"/
        );
        expect(viewSource).toContain("$t('publico')");
        expect(viewSource).toContain("$t('nofumar')");
    });
});
