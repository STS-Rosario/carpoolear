import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const navPath = path.join(__dirname, 'adminNav.vue');
const permissionsPath = path.join(__dirname, '../../utils/adminPermissions.js');
const navSource = fs.readFileSync(navPath, 'utf8');
const permissionsSource = fs.readFileSync(permissionsPath, 'utf8');

describe('adminNav changelog link', () => {
    it('links to the changelog admin page', () => {
        expect(permissionsSource).toContain("name: 'admin-changelogs'");
        expect(permissionsSource).toContain('adminNavChangelog');
        expect(navSource).toContain('visibleAdminNavItems');
    });
});
