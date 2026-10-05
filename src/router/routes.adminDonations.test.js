import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesSource = fs.readFileSync(path.resolve(__dirname, 'routes.js'), 'utf8');

function routeBlock(name) {
    const match = routesSource.match(
        new RegExp(`\\{\\s*path: '[^']*',\\s*name: '${name}',[\\s\\S]*?\\n    \\},?\\n`)
    );
    return match ? match[0] : null;
}

describe('admin donation routes', () => {
    it('registers Donaciones with donations manage permission', () => {
        const block = routeBlock('admin-donaciones');
        expect(block).not.toBeNull();
        expect(block).toContain("path: '/admin/donaciones'");
        expect(block).toContain('component: AdminDonaciones');
        expect(block).toContain('ADMIN_PERMISSIONS.DonationsManage');
    });

    it('registers Club Carpoolear members with donations manage permission', () => {
        const block = routeBlock('admin-club-carpoolear');
        expect(block).not.toBeNull();
        expect(block).toContain("path: '/admin/club-carpoolear'");
        expect(block).toContain('component: AdminClubCarpoolear');
        expect(block).toContain('ADMIN_PERMISSIONS.DonationsManage');
    });
});
