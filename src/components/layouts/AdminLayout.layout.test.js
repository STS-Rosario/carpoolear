import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layoutPath = path.join(__dirname, 'AdminLayout.vue');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');

describe('AdminLayout viewport scrolling', () => {
    it('does not cap sidebar height', () => {
        expect(layoutSource).not.toMatch(/\.admin-layout__sidebar\s*\{[^}]*max-height:/);
        expect(layoutSource).not.toMatch(/\.admin-layout__sidebar\s*\{[^}]*overflow-y:\s*auto/);
    });

    it('makes the content pane fill the remaining viewport height', () => {
        expect(layoutSource).toMatch(
            /\.admin-layout\s*\{[^}]*min-height:\s*calc\(100vh - var\(--app-header-offset/
        );
        expect(layoutSource).toMatch(/\.admin-layout-content\s*\{[^}]*display:\s*flex/);
        expect(layoutSource).toMatch(/\.admin-layout-card\s*\{[^}]*flex:\s*1/);
    });
});
