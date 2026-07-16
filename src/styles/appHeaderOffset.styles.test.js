import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { APP_HEADER_OFFSET_CSS_VAR } from '../utils/appHeaderOffset.js';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');

describe('app header offset styles', () => {
    it('uses the measured header offset for mobile view padding and profile tabs', () => {
        expect(baseCss).toContain(APP_HEADER_OFFSET_CSS_VAR);
        expect(baseCss).toMatch(
            new RegExp(
                `\\.view-container\\s*\\{[^}]*padding-top:\\s*var\\(${APP_HEADER_OFFSET_CSS_VAR}`
            )
        );
        expect(baseCss).toMatch(
            new RegExp(
                `\\.nav-tabs\\s*\\{[^}]*top:\\s*var\\(${APP_HEADER_OFFSET_CSS_VAR}`
            )
        );
    });
});
