import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'Auth.js'), 'utf8');

describe('AuthApi impersonation', () => {
    it('consumes impersonation handoff token', () => {
        expect(apiSource).toContain('consumeImpersonation');
        expect(apiSource).toContain('/api/auth/impersonate/consume');
    });

    it('stops active impersonation session', () => {
        expect(apiSource).toContain('stopImpersonation');
        expect(apiSource).toContain('/api/impersonate/stop');
    });
});
