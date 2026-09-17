import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const appPath = path.join(__dirname, 'App.vue');
const appSource = fs.readFileSync(appPath, 'utf8');

describe('App support feedback tab integration', () => {
    it('mounts the support feedback tab with splash and onboarding suppression', () => {
        expect(appSource).toContain('SupportFeedbackTab');
        expect(appSource).toContain(':onboarding-visible="onBoardingVisibility"');
        expect(appSource).toContain(':custom-splash-visible="customSplashVisible"');
    });
});
