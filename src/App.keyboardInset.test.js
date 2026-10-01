import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');

describe('App keyboard inset observer', () => {
    it('installs the visualViewport observer for overlay keyboards', () => {
        expect(appSource).toContain('installAppKeyboardInsetObserver');
        expect(appSource).toContain('stopKeyboardInsetObserver');
        expect(appSource).toMatch(
            /mounted\s*\(\s*\)\s*\{[\s\S]*installAppKeyboardInsetObserver\s*\(/
        );
        expect(appSource).toMatch(
            /beforeUnmount\s*\(\s*\)\s*\{[\s\S]*stopKeyboardInsetObserver/
        );
    });
});
