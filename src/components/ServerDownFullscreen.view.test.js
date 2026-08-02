import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('ServerDownFullscreen component', () => {
    it('renders a blocking fullscreen message with retry controls', () => {
        const componentPath = path.resolve(
            __dirname,
            'ServerDownFullscreen.vue'
        );
        const source = fs.readFileSync(componentPath, 'utf8');

        expect(source).toContain("name: 'server-down-fullscreen'");
        expect(source).toContain('serverDownTitle');
        expect(source).toContain('serverDownLead');
        expect(source).toContain('serverDownRetryButton');
        expect(source).toContain('position: fixed');
        expect(source).toContain('z-index: 10001');
    });

    it('uses primary AppButton for retry with loading while checking', () => {
        const componentPath = path.resolve(
            __dirname,
            'ServerDownFullscreen.vue'
        );
        const source = fs.readFileSync(componentPath, 'utf8');

        expect(source).toContain("import AppButton from './ui/AppButton.vue'");
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?:loading="checking"[\s\S]*?onRetry[\s\S]*?serverDownRetryButton/
        );
        expect(source).not.toContain('btn btn-primary');
    });

    it('is mounted at the app root after maintenance handling', () => {
        const appPath = path.resolve(__dirname, '../App.vue');
        const source = fs.readFileSync(appPath, 'utf8');

        expect(source).toContain('<ServerDownFullscreen v-else-if="serverDownWallVisible" />');
        expect(source).toContain(
            "import ServerDownFullscreen from './components/ServerDownFullscreen.vue'"
        );
        expect(source).toContain('serverDownWallVisible');
    });
});
