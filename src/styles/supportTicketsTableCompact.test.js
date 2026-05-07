import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, 'supportTicketsTableCompact.css');

describe('supportTicketsTableCompact.css', () => {
    it('uses auto table layout and avoids squeezing narrow cols with width 1%', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).toContain('table-layout: auto');
        expect(css).not.toContain('table-layout: fixed');
        expect(css).not.toContain('width: 1%');
    });

    it('makes the subject column fill remaining table width, not a fixed fraction', () => {
        const css = fs.readFileSync(cssPath, 'utf8');
        expect(css).not.toMatch(/width:\s*40%/);
        expect(css).toMatch(/\.support-tickets-table__subject[\s\S]*?width:\s*100%/);
    });
});
