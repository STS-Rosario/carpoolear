import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-card.css'),
    'utf8'
);
const mainCss = fs.readFileSync(path.resolve(__dirname, 'main.css'), 'utf8');

describe('trip card styles', () => {
    it('defines shell layout, seats tones, route labels, chips and detail CTA', () => {
        expect(css).toContain('.trip-card-shell');
        expect(css).toContain('.trip-card-shell__seats--high');
        expect(css).toContain('.trip-card-shell__seats--medium');
        expect(css).toContain('.trip-card-shell__seats--low');
        expect(css).toContain('.trip-card-shell__seats--full');
        expect(css).toContain('.trip-card-shell__route-label');
        expect(css).toContain('.trip-card-shell__chip');
        expect(css).toContain('.trip-card-shell__detail');
        expect(css).toMatch(
            /\.trip-card-shell__header\s*\{[\s\S]*min-height:\s*2\.25rem/
        );
    });

    it('is imported from main.css', () => {
        expect(mainCss).toContain('./components/trip-card.css');
    });
});
