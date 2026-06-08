import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, '../../router/routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('live location routes', () => {
    it('registers management, trip view, and public routes', () => {
        expect(routesSource).toContain("path: '/trips/:id/live'");
        expect(routesSource).toContain("name: 'trip_live_share'");
        expect(routesSource).toContain("path: '/trips/:id/ubicacion'");
        expect(routesSource).toContain("name: 'trip_live_view'");
        expect(routesSource).toContain("path: '/live/:token'");
        expect(routesSource).toContain("name: 'live_location_public'");
    });
});
