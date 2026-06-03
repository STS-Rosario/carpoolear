import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'ToastUiEditor.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('ToastUiEditor resizable', () => {
    it('declares a resizable prop defaulting to false', () => {
        expect(componentSource).toMatch(/resizable:\s*\{[\s\S]*?type:\s*Boolean[\s\S]*?default:\s*false/);
    });

    it('applies a resizable class on the mount when resizable is enabled', () => {
        expect(componentSource).toContain('toast-ui-editor-mount--resizable');
        expect(componentSource).toContain(':class');
        expect(componentSource).toMatch(/resizable[\s\S]*toast-ui-editor-mount--resizable/);
    });

    it('allows vertical resize on the editor root without blocking overflow', () => {
        expect(componentSource).toContain('resize: vertical');
        expect(componentSource).toMatch(/toast-ui-editor-mount--resizable[\s\S]*overflow:\s*auto/);
    });

    it('sets minHeight to the height prop when resizable so the editor cannot shrink below default', () => {
        expect(componentSource).toMatch(/if\s*\(\s*this\.resizable\s*\)[\s\S]*merged\.minHeight\s*=\s*this\.height/);
    });

    it('allows markdown textarea resize inside a resizable mount', () => {
        expect(componentSource).toMatch(
            /\.toast-ui-editor-mount--resizable\s*:deep\(textarea\)[\s\S]*resize:\s*vertical/
        );
    });
});
