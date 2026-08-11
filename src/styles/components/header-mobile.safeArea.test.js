import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCss = fs.readFileSync(
    path.resolve(__dirname, '../base.css'),
    'utf8'
);
const headerMobileCss = fs.readFileSync(
    path.resolve(__dirname, 'header-mobile.css'),
    'utf8'
);
const mainJs = fs.readFileSync(
    path.resolve(__dirname, '../../main.js'),
    'utf8'
);
const capacitorConfig = fs.readFileSync(
    path.resolve(__dirname, '../../../capacitor.config.json'),
    'utf8'
);

describe('iOS Capacitor mobile header safe-area', () => {
    it('pins the fixed header to the viewport top so html safe-area is not applied twice', () => {
        expect(baseCss).toMatch(
            /\.header\s*\{[^}]*position:\s*fixed;[^}]*top:\s*0;/s
        );
        expect(baseCss).not.toMatch(
            /html\s*\{[^}]*padding-top:\s*env\(safe-area-inset-top\)/s
        );
        expect(baseCss).not.toMatch(
            /\.ios\s+\.header\s*\{[^}]*padding-top:\s*26px/s
        );
    });

    it('applies safe-area inset once on the mobile header bar itself', () => {
        expect(headerMobileCss).toMatch(
            /padding-top:\s*calc\(\s*var\(--ds-header-mobile-padding-y\)\s*\+\s*env\(safe-area-inset-top\)\s*\)/
        );
        expect(baseCss).toMatch(
            /\.mobile-header-bar\s*\{[^}]*padding-top:\s*calc\(4px\s*\+\s*env\(safe-area-inset-top\)\)/s
        );
    });

    it('lets the status bar overlay the webview so the blue header fills the notch area', () => {
        expect(capacitorConfig).toMatch(
            /"overlaysWebView"\s*:\s*true/
        );
        expect(mainJs).toMatch(
            /setOverlaysWebView\(\s*\{\s*overlay:\s*true\s*\}\s*\)/
        );
        expect(mainJs).toMatch(
            /setBackgroundColor\(\s*\{\s*color:\s*'#1E5F9E'\s*\}\s*\)/
        );
    });
});
