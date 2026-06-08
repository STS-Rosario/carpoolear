import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const routesPath = path.join(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('admin changelog routes', () => {
    it('registers changelog admin list and form routes', () => {
        expect(routesSource).toContain("name: 'admin-changelogs'");
        expect(routesSource).toContain("name: 'admin-changelog-new'");
        expect(routesSource).toContain("name: 'admin-changelog-edit'");
    });
});
