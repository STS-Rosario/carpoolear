import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripStats.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripStats.vue redesign labeled stats', () => {
    it('shows each stat as label above value with middot separators', () => {
        expect(viewSource).toContain('trip-detail__stats');
        expect(viewSource).toContain('trip-detail__stat');
        expect(viewSource).toContain('trip-detail__stat-label');
        expect(viewSource).toContain('trip-detail__stat-value');
        expect(viewSource).toContain('trip-detail__stats-sep');
        expect(viewSource).toContain("$t('distancia')");
        expect(viewSource).toContain("$t('tripDetailStatDuration')");
        expect(viewSource).toContain("$t('huellaCarbono')");
        expect(viewSource).toContain("$t('aprox')");
        expect(viewSource).toMatch(
            /trip-detail__stat-label[\s\S]*distancia[\s\S]*trip-detail__stat-value[\s\S]*distanceString/
        );
        expect(viewSource).toMatch(
            /trip-detail__stat[\s\S]*trip-detail__stats-sep[\s\S]*trip-detail__stat[\s\S]*trip-detail__stats-sep[\s\S]*trip-detail__stat/
        );
    });
});
