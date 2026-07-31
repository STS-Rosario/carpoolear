import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve(__dirname, 'components/profile-page.css');
const mainCssPath = path.resolve(__dirname, 'main.css');

describe('profile page styles', () => {
    it('is imported from main.css after base.css', () => {
        const mainCss = fs.readFileSync(mainCssPath, 'utf8');
        expect(mainCss).toContain("components/profile-page.css");
        const baseIdx = mainCss.indexOf("base.css");
        const profileIdx = mainCss.indexOf("components/profile-page.css");
        expect(profileIdx).toBeGreaterThan(baseIdx);
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

    it('removes tab focus ring and uses Barlow 400 by default', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.profile-page\s+\.tabset\s*>\s*\.nav-tabs\s*>\s*li\s*>\s*a:focus[\s\S]*outline:\s*none/
        );
        expect(css).toMatch(
            /\.profile-page\s*\{[^}]*font-family:\s*var\(--ds-font-family\)/
        );
        expect(css).toMatch(
            /\.profile-page\s*\{[^}]*font-weight:\s*var\(--ds-font-weight-normal,\s*400\)/
        );
    });

    it('stacks profile trip cards full-width and fixes perfil detail icons', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('.profile-trip-component .trips-list');
        expect(css).toMatch(
            /\.profile-trip-card\s+[^\n]*col-[^\{]*\{[^}]*float:\s*none/
        );
        expect(css).toMatch(
            /\.profile-info-panel__details\s+\.list-group-item\s+i[\s\S]*float:\s*none/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.tab-content\s+\.profile-rates-component\s+\.list-group-item[\s\S]*box-shadow:\s*none/
        );
    });

    it('keeps profile tab panels from overflowing the content card', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toMatch(
            /\.profile-page\s+\.profile-rates-component\.container[\s\S]*max-width:\s*100%/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.profile-trip-component\.container[\s\S]*max-width:\s*100%/
        );
        expect(css).toMatch(
            /\.profile-page__content-card\s*\{[^}]*overflow-x:\s*hidden/
        );
        expect(css).toMatch(
            /\.profile-page\s+\.profile-rates-component\s+\.alert[\s\S]*max-width:\s*100%/
        );
    });
});
