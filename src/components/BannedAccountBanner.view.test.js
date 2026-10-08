import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(
    path.resolve(__dirname, 'BannedAccountBanner.vue'),
    'utf8'
);

describe('BannedAccountBanner', () => {
    it('shows the deactivated account mesa de ayuda message', () => {
        expect(source).toContain('banned-account-banner');
        expect(source).toContain("$t('cuentaDesactivadaMesaAyuda')");
    });
});
