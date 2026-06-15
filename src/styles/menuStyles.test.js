import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');

describe('menu styles', () => {
    it('does not force uppercase on desktop header navigation links', () => {
        expect(baseCss).not.toMatch(
            /\.header_panel-right \.btn-link,\s*\n\s*\.header_panel-right a \{[^}]*text-transform:\s*uppercase/s
        );
    });

    it('does not force uppercase on mobile profile tab navigation', () => {
        expect(baseCss).not.toMatch(
            /\.nav-tabs>li>a \{[^}]*text-transform:\s*uppercase/s
        );
    });
});
