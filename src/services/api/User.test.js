import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'User.js'), 'utf8');

describe('UserApi identity verification funnel', () => {
    it('passes query params when requesting the Mercado Pago OAuth URL', () => {
        expect(apiSource).toContain('getMercadoPagoOAuthUrl(params = {})');
        expect(apiSource).toContain("this.get('/api/users/mercadopago-oauth-url', params)");
    });

    it('posts whitelisted identity verification client events', () => {
        expect(apiSource).toContain('recordIdentityVerificationEvent(payload)');
        expect(apiSource).toContain("this.post('/api/users/identity-verification-events', payload)");
    });
});
