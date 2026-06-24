import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const headerSource = fs.readFileSync(
    path.resolve(__dirname, '../components/sections/HeaderApp.vue'),
    'utf8'
);

describe('HeaderApp locale preference', () => {
    it('persists locale locally and syncs it to the user profile when logged in', () => {
        expect(headerSource).toContain('persistLocaleChoice');
        expect(headerSource).toContain('syncLocaleToBackend');
        expect(headerSource).toMatch(
            /setLocale\(locale\)[\s\S]*syncLocaleToBackend\(userApi, locale, this\.logged\)/
        );
    });
});
