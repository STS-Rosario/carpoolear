import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCssPath = path.resolve(__dirname, 'base.css');
const profileCssPath = path.resolve(__dirname, 'components/profile-page.css');
const baseCss = fs.readFileSync(baseCssPath, 'utf8');
const profileCss = fs.readFileSync(profileCssPath, 'utf8');

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

    it('styles profile info tiles for desktop side-by-side layout', () => {
        expect(profileCss).toContain('.profile-info-panel__tiles');
        expect(profileCss).toMatch(
            /\.profile-info-panel__tiles\s*\{[\s\S]*flex-direction:\s*row/
        );
        expect(profileCss).toContain('.profile-info-panel__privacy');
    });
});
