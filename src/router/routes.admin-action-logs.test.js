import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routesPath = path.join(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('admin action log routes', () => {
    it('registers a filterable admin history page gated by audit permission', () => {
        expect(routesSource).toContain("name: 'admin-action-logs'");
        expect(routesSource).toContain("path: '/admin/action-logs'");
        expect(routesSource).toContain('AdminActionLogs');
        expect(routesSource).toContain('adminPermission: ADMIN_PERMISSIONS.AuditView');
    });
});
