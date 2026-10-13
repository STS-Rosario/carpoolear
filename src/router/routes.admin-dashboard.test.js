import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ADMIN_NAV_ITEMS } from '../utils/adminPermissions.js';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs
    .readFileSync(routesPath, 'utf8')
    .replace(/\r\n/g, '\n');

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
        const tableroIndex = ADMIN_NAV_ITEMS.findIndex(
            (item) => item.labelKey === 'adminNavTablero'
        );
        const graficosIndex = ADMIN_NAV_ITEMS.findIndex(
            (item) => item.labelKey === 'adminNavGraficos'
        );
        expect(tableroIndex).toBeGreaterThanOrEqual(0);
        expect(graficosIndex).toBeGreaterThanOrEqual(0);
        expect(tableroIndex).toBeLessThan(graficosIndex);
        expect(
            ADMIN_NAV_ITEMS.some((item) => item.name === 'admin-dashboard')
        ).toBe(true);
    });
});
