import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve(__dirname, 'components/profile-page.css');
const mainCssPath = path.resolve(__dirname, 'main.css');

describe('profile page styles', () => {
    it('is imported from main.css', () => {
        const mainCss = fs.readFileSync(mainCssPath, 'utf8');
        expect(mainCss).toContain("components/profile-page.css");
    });

    it('styles profile tabs with grey baseline and wider blue active underline', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.profile-page\s+\.tabset\s*>\s*\.nav-tabs\s*\{[^}]*border-bottom:\s*1px\s+solid\s+#(?:aaa|d0d0d0|ccc)/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a\.active\s*\{[^}]*border-bottom:\s*4px\s+solid/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.tabset\s*>\s*\.nav-tabs::after\s*\{[^}]*display:\s*none/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.tabset\s+\.nav\s*>\s*li\s*>\s*a\.active::after\s*\{[^}]*display:\s*none/
        );
    });
});
