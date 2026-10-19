import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const baseCss = fs.readFileSync(path.resolve(__dirname, 'base.css'), 'utf8');

describe('alertify notifier styles', () => {
    it('gives info toasts the info message background', () => {
        expect(baseCss).toMatch(
            /\.alertify-notifier \.ajs-message\.ajs-info\s*\{[^}]*background:\s*var\(--ds-info-bg/
        );
        expect(baseCss).toMatch(
            /\.alertify-notifier \.ajs-message\.ajs-info\s*\{[^}]*color:\s*var\(--ds-text-primary/
        );
    });
});
