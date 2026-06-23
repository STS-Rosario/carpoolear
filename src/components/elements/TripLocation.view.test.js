import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripLocation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripLocation punto partida and punto llegada', () => {
    it('shows point details after origin and destination when present', () => {
        expect(viewSource).toContain('trip.punto_partida');
        expect(viewSource).toContain('trip.punto_llegada');
        expect(viewSource).toContain('trip-location-point-detail');
        expect(viewSource).toContain("$t('puntoDePartida')");
        expect(viewSource).toContain("$t('puntoDeLlegada')");
    });
});
