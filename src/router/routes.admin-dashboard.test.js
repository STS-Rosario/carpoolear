import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

const navPath = path.resolve(__dirname, '../components/sections/adminNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

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
        expect(navSource.indexOf('adminNavTablero')).toBeLessThan(navSource.indexOf('adminNavGraficos'));
        expect(navSource).toContain("name: 'admin-dashboard'");
    });
});
