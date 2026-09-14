import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

function getRouteBlock(routeName) {
    const match = routesSource.match(
        new RegExp(
            `\\{\\s*\\n\\s*path:[^\\n]+\\n\\s*name:\\s*'${routeName}'[\\s\\S]*?\\n    \\},`
        )
    );
    expect(match).toBeTruthy();
    return match[0];
}

describe('guest trip access routes', () => {
    it('allows guests to browse /trips without an auth guard', () => {
        const tripsRoute = getRouteBlock('trips');

        expect(tripsRoute).toContain("path: '/trips'");
        expect(tripsRoute).not.toMatch(/beforeEnter:\s*auth\b/);
    });

    it('requires login before viewing trip detail', () => {
        const detailRoute = getRouteBlock('detail_trip');

        expect(detailRoute).toContain("path: '/trips/:id'");
        expect(detailRoute).toContain('checkLogin');
        expect(detailRoute).toContain('auth(to, from, next)');
    });

    it('requires login before viewing trip detail with location param', () => {
        const detailRoute = getRouteBlock('detail_trip_location');

        expect(detailRoute).toContain("path: '/trips/:id/:location'");
        expect(detailRoute).toContain('checkLogin');
        expect(detailRoute).toContain('auth(to, from, next)');
    });
});
