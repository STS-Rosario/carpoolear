import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');

describe('mobile navigation styles', () => {
    it('uses a blue background for the mobile bottom bar', () => {
        expect(baseCss).toMatch(
            /\.actionbar-bottom\s*\{[^}]*background(?:-color)?:\s*var\(--secondary-background\)/s
        );
    });

    it('styles footer labels and active state for labeled tabs', () => {
        expect(baseCss).toContain('.actionbar_item_label');
        expect(baseCss).toMatch(
            /\.actionbar-bottom \.actionbar_item\.active \.actionbar_item_label\s*\{[^}]*color:\s*#ff6b6b/s
        );
        expect(baseCss).toMatch(
            /\.actionbar-bottom \.actionbar_item svg\s*\{[^}]*fill:\s*#fff/s
        );
    });
});
