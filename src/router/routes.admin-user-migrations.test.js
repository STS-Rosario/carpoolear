import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('admin user migrations routes', () => {
    it('defines list and new routes under admin', () => {
        expect(routesSource).toContain("path: '/admin/user-migrations'");
        expect(routesSource).toContain("name: 'admin-user-migrations'");
        expect(routesSource).toContain("path: '/admin/user-migrations/new'");
        expect(routesSource).toContain("name: 'admin-user-migration-new'");
    });
});
