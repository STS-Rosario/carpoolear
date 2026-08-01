import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripStats.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripStats.vue desktop light-theme labels', () => {
    it('always shows distance/time/co2 labels on desktop regardless of trip card theme', () => {
        const desktopBranch = viewSource.match(
            /<template v-else>([\s\S]*?)<\/template>/
        )[1];

        expect(desktopBranch).toMatch(
            /<span>\s*\{\{\s*\$t\('distanciaARecorrer'\)\s*\}\}\s*<\/span>/
        );
        expect(desktopBranch).toMatch(
            /<span>\s*\{\{\s*\$t\('tiempoEstimado'\)\s*\}\}\s*<\/span>/
        );
        expect(desktopBranch).toMatch(
            /<span>\s*\{\{\s*\$t\('huellaCarbono'\)/
        );
    });
});
