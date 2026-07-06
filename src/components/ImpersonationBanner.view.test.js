import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'ImpersonationBanner.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('ImpersonationBanner', () => {
    it('shows impersonation warning and stop action', () => {
        expect(source).toContain('impersonation-banner');
        expect(source).toContain("t('impersonationBannerText'");
        expect(source).toContain("t('impersonationBannerStop')");
        expect(source).toContain('stopImpersonation');
    });

    it('uses target user name in banner text', () => {
        expect(source).toContain('user?.name');
    });
});
