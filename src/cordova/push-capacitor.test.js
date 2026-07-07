import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve(__dirname, 'push-capacitor.js');
const source = fs.readFileSync(sourcePath, 'utf8');

describe('push-capacitor.js initWebPush permission request', () => {
    it('calls the global window.Notification.requestPermission, not the local Notification class', () => {
        // The module declares a local `class Notification {}` that shadows the
        // global Web Notifications API. Calling the bare `Notification.requestPermission()`
        // resolves to that local class (which has no static method) and throws
        // "TypeError: Notification.requestPermission is not a function".
        // The permission prompt must be invoked on the global explicitly.
        expect(source).not.toContain('await Notification.requestPermission()');
        expect(source).not.toContain('Notification.requestPermission().');
        expect(source).toContain('window.Notification.requestPermission()');
    });
});
