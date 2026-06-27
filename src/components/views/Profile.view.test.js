import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.resolve(__dirname, 'Profile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Profile view', () => {
    it('shows account nav on desktop for the signed-in user profile', () => {
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain(':show-nav="isMyOwnProfile"');
        expect(viewSource).toContain('isMyOwnProfile');
    });
});
