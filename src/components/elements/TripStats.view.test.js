import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripStats.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripStats.vue redesign compact stats', () => {
    it('uses the compact trip-detail__stats line for both breakpoints', () => {
        expect(viewSource).toContain('trip-detail__stats');
        expect(viewSource).toContain('trip-detail__stats-sep');
        expect(viewSource).toMatch(
            /class="trip-detail__stats"[\s\S]*?distanceString/
        );
        expect(viewSource).not.toMatch(
            /class="trip-detail__stats"\s+v-if="isMobile"/
        );
        expect(viewSource).not.toContain("$t('distanciaARecorrer')");
        expect(viewSource).not.toContain("$t('tiempoEstimado')");
        expect(viewSource).not.toContain("$t('huellaCarbono')");
    });
});
