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
const countdownBannerSource = fs.readFileSync(
    path.resolve(
        __dirname,
        '../../components/IdentityValidationCountdownBanner.vue'
    ),
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

    it('applies safe-area inset only on the topmost mobile header bar', () => {
        expect(baseCss).toMatch(
            /\.header\s*>\s*\.mobile-header-bar:first-child\s*\{[^}]*padding-top:\s*calc\(4px\s*\+\s*env\(safe-area-inset-top\)\)/s
        );
        expect(headerMobileCss).toMatch(
            /\.header\s*>\s*\.mobile-header-bar--branded\.visible-xs:first-child\s*\{[^}]*env\(safe-area-inset-top\)/s
        );
    });

    it('applies safe-area inset to the identity countdown banner at the top of the stack', () => {
        expect(countdownBannerSource).toMatch(
            /padding-top:\s*calc\(10px\s*\+\s*env\(safe-area-inset-top\)\)/
        );
    });

    it('keeps Android out of edge-to-edge while iOS can overlay the notch', () => {
        expect(capacitorConfig).toMatch(
            /"overlaysWebView"\s*:\s*false/
        );
        expect(mainJs).toMatch(
            /setOverlaysWebView\(\s*\{[^}]*overlay:\s*Capacitor\.getPlatform\(\)\s*===\s*'ios'/
        );
        expect(mainJs).toMatch(
            /setBackgroundColor\(\s*\{\s*color:\s*'#1E5F9E'\s*\}\s*\)/
        );
    });
});
