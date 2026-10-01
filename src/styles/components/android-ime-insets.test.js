import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../../..');
const mainActivity = fs.readFileSync(
    path.join(
        repoRoot,
        'android/app/src/main/java/com/sts/carpoolear/MainActivity.java'
    ),
    'utf8'
);

describe('Android overlay IME WebView insets', () => {
    it('replaces Capacitor inset handling after the bridge WebView exists', () => {
        const superOnCreate = mainActivity.indexOf('super.onCreate');
        const webView = mainActivity.indexOf('getBridge().getWebView()');
        const listener = mainActivity.indexOf('setOnApplyWindowInsetsListener');

        expect(superOnCreate).toBeGreaterThan(-1);
        expect(webView).toBeGreaterThan(superOnCreate);
        expect(listener).toBeGreaterThan(webView);
    });

    it('insets the WebView by IME height on Android 15+ without dropping system bars', () => {
        expect(mainActivity).toMatch(/VANILLA_ICE_CREAM/);
        expect(mainActivity).toMatch(/Type\.systemBars\(\)/);
        expect(mainActivity).toMatch(/Type\.displayCutout\(\)/);
        expect(mainActivity).toMatch(/Type\.ime\(\)/);
        expect(mainActivity).toMatch(/Math\.max\([\s\S]*ime/);
    });
});
