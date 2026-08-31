import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { DONATION_AFTER_RATING_HEADER_ROUTE_NAMES } from '../utils/donationAfterRatingHeader.js';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('donation after positive rating route', () => {
    it('registers a full-page donation prompt after rating', () => {
        expect(routesSource).toContain("path: '/donate-after-rating/:tripId'");
        expect(routesSource).toContain(
            `name: '${DONATION_AFTER_RATING_HEADER_ROUTE_NAMES[0]}'`
        );
        expect(routesSource).toContain('DonationAfterRating');
    });

    it('registers a dev-only preview route without auth guards', () => {
        expect(routesSource).toContain(
            "path: '/preview/donation-after-rating/:tripId?'"
        );
        expect(routesSource).toContain(
            `name: '${DONATION_AFTER_RATING_HEADER_ROUTE_NAMES[1]}'`
        );
        expect(routesSource).toContain('preview: true');
        expect(routesSource).not.toMatch(
            /preview-donation-after-rating[\s\S]*?beforeEnter/
        );
    });
});
