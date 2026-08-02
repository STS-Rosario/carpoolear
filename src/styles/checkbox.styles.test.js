import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCss = fs.readFileSync(
    path.resolve(__dirname, 'base.css'),
    'utf8'
);
const carpoolearCss = fs.readFileSync(
    path.resolve(__dirname, 'main.carpoolear.css'),
    'utf8'
);

describe('native checkbox color', () => {
    it('uses dark grey accent for checkboxes app-wide', () => {
        for (const css of [baseCss, carpoolearCss]) {
            expect(css).toMatch(
                /input\[type=["']checkbox["']\]\s*\{[^}]*accent-color:\s*#555/
            );
        }
    });

    it('spaces checkbox and label when the input is nested in the label', () => {
        for (const css of [baseCss, carpoolearCss]) {
            expect(css).toMatch(
                /label:has\(\s*>\s*input\[type=["']checkbox["']\]\s*\)\s*\{[^}]*gap:\s*0\.5(?:rem|em)/s
            );
            expect(css).toMatch(
                /label:has\(\s*>\s*input\[type=["']checkbox["']\]\s*\)\s*\{[^}]*display:\s*inline-flex/s
            );
        }
    });
});
