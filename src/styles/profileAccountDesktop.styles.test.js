import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');

describe('profile account desktop layout', () => {
    it('keeps profile tabs and content inside the account settings column', () => {
        expect(baseCss).toMatch(
            /\.settings-component \.tabset > \.nav-tabs\s*\{[\s\S]*width:\s*100%/
        );
        expect(baseCss).toMatch(
            /\.settings-component \.tabset > \.nav-tabs\s*\{[\s\S]*display:\s*flex/
        );
        expect(baseCss).toMatch(
            /\.settings-component \.tabset > \.nav-tabs > li > a\.active\s*\{[\s\S]*margin-bottom:\s*-1px/
        );
        expect(baseCss).toMatch(
            /\.settings-component \.tabset > \.nav-tabs > li > a:focus[\s\S]*outline:\s*none/
        );
    });

    it('lays out public profile info in a two-column grid below the tabs', () => {
        expect(baseCss).toMatch(
            /\.settings-component \.profile-info-component \.list-group\s*\{[\s\S]*display:\s*grid/
        );
        expect(baseCss).toMatch(
            /\.settings-component \.profile-info-component \.list-group\s*\{[\s\S]*grid-template-columns:\s*minmax\(180px, 230px\) minmax\(0, 1fr\)/
        );
        expect(baseCss).toMatch(
            /\.settings-component \.profile-info-component \.profile-info--name\.desktop\s*\{[\s\S]*padding:\s*0 0 1rem/
        );
    });
});
