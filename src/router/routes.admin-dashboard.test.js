import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

const permissionsPath = path.resolve(__dirname, '../utils/adminPermissions.js');
const permissionsSource = fs.readFileSync(permissionsPath, 'utf8');

describe('admin dashboard routes', () => {
    it('uses AdminDashboard as default admin home at /admin', () => {
        expect(routesSource).toContain("path: '/admin'");
        expect(routesSource).toContain("name: 'admin-dashboard'");
        expect(routesSource).toContain('AdminDashboard');
    });

    it('keeps charts on a dedicated admin route', () => {
        expect(routesSource).toContain("path: '/admin/graficos'");
        expect(routesSource).toContain("name: 'admin-page'");
        expect(routesSource).toContain('AdminPage');
    });
});

describe('admin dashboard navigation', () => {
    it('lists Tablero first and links to admin dashboard', () => {
        const dashboardIndex = permissionsSource.indexOf("name: 'admin-dashboard'");
        const graphsIndex = permissionsSource.indexOf("name: 'admin-page'");
        expect(dashboardIndex).toBeGreaterThan(-1);
        expect(graphsIndex).toBeGreaterThan(-1);
        expect(dashboardIndex).toBeLessThan(graphsIndex);
    });
});
