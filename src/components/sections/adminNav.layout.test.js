import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const navPath = path.join(__dirname, 'adminNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('adminNav layout spacing', () => {
    it('does not add a redundant top margin on top of view-container header offset', () => {
        // Same double-offset bug as AdminLayout: tall sidebar + extra margin
        // forces vertical scroll when page content would otherwise fit.
        expect(navSource).not.toMatch(/margin-top:\s*72px/);
        expect(navSource).not.toMatch(/margin-top:\s*92px/);
    });

    it('filters sidebar links with visibleAdminNavItems', () => {
        expect(navSource).toContain('visibleAdminNavItems');
        expect(navSource).toContain('v-for="item in navItems"');
        expect(navSource).toContain('item.name');
        expect(navSource).toContain('item.labelKey');
    });
});
