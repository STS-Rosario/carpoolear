import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve(__dirname, 'auth.js');
const source = fs.readFileSync(sourcePath, 'utf8');

describe('auth.onLoggin push registration', () => {
    it('initializes push after login so FCM tokens are obtained for fresh sessions', () => {
        const onLogginMatch = source.match(
            /async onLoggin\(token\) \{[\s\S]*?\n\s{8}\},/
        );
        expect(onLogginMatch).not.toBeNull();
        const onLoggin = onLogginMatch[0];

        // deviceStore.register() alone is a no-op without device_id. Fresh
        // logins never ran push.init() at startup (auth-gated), so login must
        // start push to obtain the FCM token and persist the device.
        expect(onLoggin).toMatch(/push-capacitor/);
        expect(onLoggin).toMatch(/\.init\s*\(/);
        expect(onLoggin).toContain('deviceStore.register()');
    });
});
