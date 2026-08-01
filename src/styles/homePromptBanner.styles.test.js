import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssPath = path.resolve(__dirname, 'components/home-prompt-banner.css');
const mainCssPath = path.resolve(__dirname, 'main.css');

describe('home prompt banner styles', () => {
    it('is imported from main.css', () => {
        const mainCss = fs.readFileSync(mainCssPath, 'utf8');
        expect(mainCss).toContain('./components/home-prompt-banner.css');
    });

    it('defines the cream bordered banner shell from the home prompt mock', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('.home-prompt-banner');
        expect(css).toMatch(
            /\.home-prompt-banner\s*\{[^}]*background:\s*#fff5e6/s
        );
        expect(css).toMatch(
            /\.home-prompt-banner\s*\{[^}]*border:\s*1px\s+solid/s
        );
        expect(css).toMatch(
            /\.home-prompt-banner\s*\{[^}]*border-radius:\s*0\.5rem/s
        );
        expect(css).toContain('.home-prompt-banner__icon');
        expect(css).toContain('.home-prompt-banner__title');
        expect(css).toContain('.home-prompt-banner__text');
    });
});
