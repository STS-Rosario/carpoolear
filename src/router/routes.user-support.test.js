import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('user support routes', () => {
    it('defines dedicated route for creating support tickets', () => {
        expect(routesSource).toContain("path: '/soporte/nuevo'");
        expect(routesSource).toContain("name: 'ticket-new'");
    });

    it('keeps support list route and create route separated', () => {
        expect(routesSource).toContain("path: '/soporte'");
        expect(routesSource).toContain("name: 'tickets'");
        expect(routesSource).toContain("path: '/soporte/nuevo'");
    });
});
