import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const layoutPath = path.resolve(__dirname, 'AdminLayout.vue');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');

describe('AdminLayout', () => {
    it('allows horizontal scrolling in the main admin content area', () => {
        expect(layoutSource).toContain('admin-layout-content');
        expect(layoutSource).toContain('overflow-x: auto');
        expect(layoutSource).toContain('min-width: 0');
    });

    it('does not add a redundant top margin on top of view-container header offset', () => {
        // .view-container already clears the fixed header; extra margin causes
        // avoidable vertical scroll on short admin pages (e.g. user-migrations/new).
        expect(layoutSource).not.toMatch(/margin-top:\s*72px/);
        expect(layoutSource).not.toMatch(/margin-top:\s*24px/);
    });

    it('stretches the content column to fill available vertical space in the admin row', () => {
        // Bootstrap float columns shrink to content height; the content pane must
        // stretch with the sidebar (and to the remaining viewport) so short pages
        // do not leave a short overflow:auto box with a spurious vertical scrollbar.
        expect(layoutSource).toContain('admin-layout-row');
        expect(layoutSource).toMatch(/\.admin-layout-row\s*\{[^}]*display:\s*flex/);
        expect(layoutSource).toMatch(/\.admin-layout-row\s*\{[^}]*align-items:\s*stretch/);
        expect(layoutSource).toMatch(/min-height:\s*calc\(100vh/);
    });
});
