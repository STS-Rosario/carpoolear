import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-detail.css'),
    'utf8'
);

describe('trip-detail.css', () => {
    it('scopes mobile section labels and stack under .trip-detail', () => {
        expect(css).toContain('.trip-detail');
        expect(css).toContain('.trip-detail__section-title');
        expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/);
        expect(css).toContain('.trip-detail__stack');
        expect(css).toContain('.trip-detail__cta .btn-primary');
        expect(css).toContain('.trip-detail__passengers');
    });
});
