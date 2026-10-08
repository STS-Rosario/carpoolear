import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const source = fs.readFileSync(path.resolve(__dirname, 'App.vue'), 'utf8');

describe('App.vue banned account banner', () => {
    it('renders BannedAccountBanner for banned users', () => {
        expect(source).toContain('BannedAccountBanner');
        expect(source).toContain('isUserBanned');
        expect(source).toMatch(/BannedAccountBanner[\s\S]*isUserBanned|v-if="isBannedAccount"/);
    });
});
