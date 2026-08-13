import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const footerMobileCss = fs.readFileSync(
    path.resolve(__dirname, 'footer-mobile.css'),
    'utf8'
);

describe('mobile footer safe layout', () => {
    it('overrides Bootstrap visible-xs so tab items stay in one row', () => {
        expect(footerMobileCss).toMatch(
            /\.mobile-footer-bar\.visible-xs\s*\{[^}]*display:\s*flex\s*!important;/s
        );
        expect(footerMobileCss).toMatch(/align-items:\s*flex-end/);
    });
});
