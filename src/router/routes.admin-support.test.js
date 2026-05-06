import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('admin support routes', () => {
    it('defines dedicated route for support ticket creation page', () => {
        expect(routesSource).toContain("path: '/admin/support-tickets/new'");
        expect(routesSource).toContain("name: 'admin-support-ticket-new'");
    });

    it('keeps support ticket list route separated from create page route', () => {
        expect(routesSource).toContain("path: '/admin/support-tickets'");
        expect(routesSource).toContain("name: 'admin-support-tickets'");
        expect(routesSource).toContain("path: '/admin/support-tickets/new'");
    });
});
