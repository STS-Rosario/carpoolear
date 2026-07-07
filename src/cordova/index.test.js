import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = path.resolve(__dirname, 'index.js');
const source = fs.readFileSync(sourcePath, 'utf8');

describe('cordova/index.js push init gating', () => {
    it('initializes push only after session restore and only for authenticated users', () => {
        const doInitMatch = source.match(
            /const doInit = async \(\) => \{[\s\S]*?\n\s*\};/
        );
        expect(doInitMatch).not.toBeNull();
        const doInit = doInitMatch[0];

        // Auth is restored by rootStore.init(); push.init() must run AFTER it
        // resolves so the auth state is known, not before.
        const rootInitIdx = doInit.indexOf('getRootStore().init()');
        const pushInitIdx = doInit.indexOf('push.init()');
        expect(rootInitIdx).toBeGreaterThan(-1);
        expect(pushInitIdx).toBeGreaterThan(rootInitIdx);

        // push.init() must be guarded by auth state so signed-out users are
        // never prompted for notification permissions on app startup.
        expect(doInit).toContain('authStore');
        expect(doInit).toMatch(/if\s*\(\s*authStore\.auth[\s\S]*?push\.init\(\)/);
    });
});
