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
    it('positions the pin over the brand image inside header_logo-link', () => {
        expect(headerSource).toContain('class="header_logo-link"');
        expect(baseCss).toMatch(
            /\.header \.header_panel-left \.header_logo-link img:last-child\s*\{[^}]*left:\s*22px/s
        );
        expect(baseCss).not.toMatch(
            /\.header \.header_panel-left > img:last-child/
        );
    });

    it('offsets the pin further right on large desktop widths', () => {
        expect(baseCss).toMatch(
            /@media only screen and \(min-width: 1300px\)[\s\S]*\.header \.header_panel-left \.header_logo-link img:last-child\s*\{[^}]*left:\s*62px/s
        );
    });
});
