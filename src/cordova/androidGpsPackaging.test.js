import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const manifestPath = path.resolve(
    __dirname,
    '../../android/app/src/main/AndroidManifest.xml'
);
const gradlePath = path.resolve(__dirname, '../../android/app/build.gradle');
const pluginPath = path.resolve(
    __dirname,
    '../../android/app/src/main/java/com/sts/carpoolear/DeviceGpsPlugin.java'
);
const mainActivityPath = path.resolve(
    __dirname,
    '../../android/app/src/main/java/com/sts/carpoolear/MainActivity.java'
);

describe('Android GPS optional packaging', () => {
    it('declares GPS optional with tools:replace', () => {
        const xml = fs.readFileSync(manifestPath, 'utf8');
        expect(xml).toContain('xmlns:tools=');
        expect(xml).toMatch(
            /android\.hardware\.location\.gps[\s\S]*android:required="false"/
        );
        expect(xml).toContain('tools:replace="android:required"');
    });

    it('bumps version to 4.0.36 / 4003600', () => {
        const gradle = fs.readFileSync(gradlePath, 'utf8');
        expect(gradle).toContain('versionCode 4003600');
        expect(gradle).toContain('versionName "4.0.36"');
    });

    it('registers DeviceGps plugin for FEATURE_LOCATION_GPS', () => {
        const plugin = fs.readFileSync(pluginPath, 'utf8');
        const mainActivity = fs.readFileSync(mainActivityPath, 'utf8');
        expect(plugin).toContain('@CapacitorPlugin(name = "DeviceGps")');
        expect(plugin).toContain('FEATURE_LOCATION_GPS');
        expect(mainActivity).toContain('registerPlugin(DeviceGpsPlugin.class)');
    });
});
