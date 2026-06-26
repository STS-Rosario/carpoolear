import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const headerPath = path.resolve(__dirname, '../components/sections/HeaderApp.vue');
const footerPath = path.resolve(__dirname, '../components/sections/FooterApp.vue');
const headerSource = fs.readFileSync(headerPath, 'utf8');
const footerSource = fs.readFileSync(footerPath, 'utf8');

describe('mobile navigation class separation', () => {
    it('styles header and footer bars independently in base.css', () => {
        expect(baseCss).toContain('.mobile-header-bar {');
        expect(baseCss).toContain('.mobile-footer-bar {');
        expect(baseCss).not.toMatch(/\.actionbar-top\s*\{/);
        expect(baseCss).not.toMatch(/\.actionbar-bottom\s*\{/);
        expect(baseCss).not.toMatch(/\.actionbar\s*\{/);
    });

    it('uses mobile-header-bar classes in HeaderApp', () => {
        expect(headerSource).toContain('mobile-header-bar');
        expect(headerSource).not.toContain('actionbar-top');
        expect(headerSource).not.toContain('class="actionbar ');
    });

    it('uses mobile-footer-bar classes in FooterApp', () => {
        expect(footerSource).toContain('mobile-footer-bar');
        expect(footerSource).not.toContain('actionbar-bottom');
        expect(footerSource).not.toContain('class="actionbar ');
    });
});
