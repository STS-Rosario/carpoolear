import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const manifestPath = path.resolve(
    __dirname,
    '../../android/app/src/main/AndroidManifest.xml'
);

describe('Android App Links (MP identity return)', () => {
    it('declares verified https intent for identity-validation path', () => {
        const xml = fs.readFileSync(manifestPath, 'utf8');
        expect(xml).toContain('android:autoVerify="true"');
        expect(xml).toContain('android.intent.action.VIEW');
        expect(xml).toContain('android:host="carpoolear.com.ar"');
        expect(xml).toContain('android:host="www.carpoolear.com.ar"');
        expect(xml).toContain(
            'android:pathPrefix="/app/setting/identity-validation"'
        );
    });
});