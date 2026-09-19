import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layoutPath = path.join(__dirname, 'AdminLayout.vue');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');

describe('AdminLayout viewport scrolling', () => {
    it('caps the sidebar to the remaining viewport so a short content page does not scroll with the nav', () => {
        expect(layoutSource).toMatch(
            /\.admin-layout__sidebar\s*\{[^}]*max-height:\s*calc\(100vh - var\(--app-header-offset/
        );
        expect(layoutSource).toMatch(/\.admin-layout__sidebar\s*\{[^}]*overflow-y:\s*auto/);
    });

    it('does not cap sidebar height in the stacked mobile layout', () => {
        expect(layoutSource).toMatch(
            /@media \(max-width: 767px\)[\s\S]*\.admin-layout__sidebar[\s\S]*max-height:\s*none/
        );
    });
});
