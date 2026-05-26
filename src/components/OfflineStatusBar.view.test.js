import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('OfflineStatusBar component', () => {
    it('renders a fixed bottom status bar from initialized network state', () => {
        const componentPath = path.resolve(__dirname, 'OfflineStatusBar.vue');
        const source = fs.readFileSync(componentPath, 'utf8');

        expect(source).toContain("name: 'offline-status-bar'");
        expect(source).toContain('networkReady');
        expect(source).toContain('networkState');
        expect(source).toContain('role="status"');
        expect(source).toContain('position: fixed');
        expect(source).toContain('bottom: 0');
        expect(source).toContain('offlineStatusBarMessage');
    });

    it('is mounted once at the app root', () => {
        const appPath = path.resolve(__dirname, '../App.vue');
        const source = fs.readFileSync(appPath, 'utf8');

        expect(source).toContain('<OfflineStatusBar />');
        expect(source).toContain("import OfflineStatusBar from './components/OfflineStatusBar.vue'");
    });
});
