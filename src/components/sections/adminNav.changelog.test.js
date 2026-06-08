import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const navPath = path.join(__dirname, 'adminNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('adminNav changelog link', () => {
    it('links to the changelog admin page', () => {
        expect(navSource).toContain("name: 'admin-changelogs'");
        expect(navSource).toContain('adminNavChangelog');
    });
});
