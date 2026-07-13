import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve(__dirname, 'main.js');
const source = fs.readFileSync(sourcePath, 'utf8');

describe('main.js push ownership', () => {
    it('does not register push notifications (cordova/push-capacitor owns that)', () => {
        // Early register() in main.js races ahead of token-saving listeners in
        // push-capacitor, and prompts for permission before auth is known.
        expect(source).not.toMatch(/PushNotifications\.register\s*\(/);
        expect(source).not.toMatch(
            /initializePushNotifications\s*=\s*async/
        );
    });
});
