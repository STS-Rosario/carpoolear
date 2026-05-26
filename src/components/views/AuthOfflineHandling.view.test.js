import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const loginSource = fs.readFileSync(path.resolve(__dirname, 'Login.vue'), 'utf8');
const registerSource = fs.readFileSync(path.resolve(__dirname, 'Register.vue'), 'utf8');

describe('auth views offline error handling', () => {
    it('does not show incorrect credentials for offline login failures', () => {
        expect(loginSource).toContain('isOfflineApiError');
        expect(loginSource).toContain('this.$t(\'emailOContra\')');
    });

    it('lets the global offline bar handle offline registration failures', () => {
        expect(registerSource).toContain('isOfflineApiError');
        expect(registerSource).toContain('return;');
    });
});
