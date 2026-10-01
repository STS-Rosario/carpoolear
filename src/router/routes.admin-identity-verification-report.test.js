import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routesSource = fs.readFileSync(path.join(__dirname, 'routes.js'), 'utf8');

function routeBlock(name) {
    const nameIndex = routesSource.indexOf(`name: '${name}'`);
    if (nameIndex === -1) {
        return '';
    }
    const start = routesSource.lastIndexOf('{\n        path:', nameIndex);
    const end = routesSource.indexOf('\n    }', nameIndex);
    return routesSource.slice(start, end);
}

describe('admin identity verification report route', () => {
    it('lazy-loads the report view', () => {
        expect(routesSource).toContain(
            "const AdminIdentityVerificationReport = () => import('../components/views/AdminIdentityVerificationReport.vue');"
        );
    });

    it('is an admin page gated by the identity stats permission', () => {
        const block = routeBlock('admin-identity-verification-report');

        expect(block).toContain("path: '/admin/identity-verification-report'");
        expect(block).toContain('component: AdminIdentityVerificationReport');
        expect(block).toContain('beforeEnter: authAdmin');
        expect(block).toContain('adminPermission: ADMIN_PERMISSIONS.IdentityStats');
        expect(block).toContain("active_id: 'admin'");
        expect(block).toContain("titleKey: 'adminNavReporteVerificaciones'");
    });
});
