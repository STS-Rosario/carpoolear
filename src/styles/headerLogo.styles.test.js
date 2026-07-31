import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const headerPath = path.resolve(
    __dirname,
    '../components/sections/HeaderApp.vue'
);
const headerSource = fs.readFileSync(headerPath, 'utf8');

describe('desktop header logo positioning', () => {
    it('renders logo2.svg as a single inline logo image', () => {
        expect(headerSource).toContain('class="header_logo-link"');
        expect(headerSource).toContain('logo2.svg');
        expect(headerSource).toContain('class="header_logo-image"');
        expect(headerSource).not.toContain('background_desktop');
    });

    it('sizes the desktop header logo without layered background images', () => {
        expect(baseCss).toMatch(
            /\.header \.header_panel-left \.header_logo-link \.header_logo-image\s*\{[^}]*height:\s*2rem/s
        );
        expect(baseCss).not.toMatch(
            /\.header \.header_panel-left \.header_logo-link img:last-child/
        );
    });
});
