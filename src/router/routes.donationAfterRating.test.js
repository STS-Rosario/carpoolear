import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('donation after positive rating route', () => {
    it('registers a full-page donation prompt after rating', () => {
        expect(routesSource).toContain("path: '/donate-after-rating/:tripId'");
        expect(routesSource).toContain("name: 'donate-after-rating'");
        expect(routesSource).toContain('DonationAfterRating');
    });
});
