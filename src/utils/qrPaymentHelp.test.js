import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const helperPath = path.resolve(__dirname, 'qrPaymentHelp.js');

describe('QR payment help', () => {
    it('points to the public Carpoolear app URL', async () => {
        expect(fs.existsSync(helperPath)).toBe(true);
        const { CARPOOLEAR_APP_URL } = await import('./qrPaymentHelp.js');
        expect(CARPOOLEAR_APP_URL).toBe('https://www.carpoolear.com.ar/app');
    });
});
