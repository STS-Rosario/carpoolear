import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'trip-card.css'),
    'utf8'
);

describe('trip card equal-height list styles', () => {
    it('does not stretch unpaid-sellado columns to 100% of the stacked trips row', () => {
        expect(css).not.toMatch(
            /\.row\s*>\s*\[class\*=['"]col-['"]\]\.trip-needs-sellado/
        );
    });
});
