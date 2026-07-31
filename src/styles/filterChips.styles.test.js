import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const mainCssPath = path.resolve(__dirname, 'main.css');
const cssPath = path.resolve(__dirname, 'components/filter-chips.css');
const mainCss = fs.readFileSync(mainCssPath, 'utf8');

describe('filter-chips.css', () => {
    it('is imported from main.css', () => {
        expect(mainCss).toContain("components/filter-chips.css");
    });

    it('defines shared chip layout and active state', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('.filter-chips');
        expect(css).toContain('.filter-chip');
        expect(css).toContain('.filter-chip--active');
        expect(css).toContain('border-radius: 999px');
    });
});
