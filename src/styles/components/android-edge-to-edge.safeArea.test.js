import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '../../..');

const capacitorConfig = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'capacitor.config.json'), 'utf8')
);
const androidPackagedConfig = JSON.parse(
    fs.readFileSync(
        path.join(repoRoot, 'android/app/src/main/assets/capacitor.config.json'),
        'utf8'
    )
);
const stylesXml = fs.readFileSync(
    path.join(repoRoot, 'android/app/src/main/res/values/styles.xml'),
    'utf8'
);
const mainActivity = fs.readFileSync(
    path.join(
        repoRoot,
        'android/app/src/main/java/com/sts/carpoolear/MainActivity.java'
    ),
    'utf8'
);

describe('Android 16 edge-to-edge navigation insets', () => {
    it('asks Capacitor to inset the WebView when Android enforces edge-to-edge', () => {
        expect(capacitorConfig.android.adjustMarginsForEdgeToEdge).toBe('auto');
        expect(androidPackagedConfig.android.adjustMarginsForEdgeToEdge).toBe(
            'auto'
        );
    });

    it('does not opt out of edge-to-edge so Capacitor auto margins apply on Android 16', () => {
        expect(stylesXml).not.toMatch(
            /windowOptOutEdgeToEdgeEnforcement/
        );
    });

    it('still fits system windows on Android 14 and below', () => {
        expect(mainActivity).toMatch(
            /setDecorFitsSystemWindows\(\s*getWindow\(\)\s*,\s*true\s*\)/
        );
    });
});
