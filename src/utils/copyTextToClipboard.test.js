import { describe, expect, it, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const helperPath = path.resolve(__dirname, 'copyTextToClipboard.js');

describe('copyTextToClipboard', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('writes text to the clipboard and returns true', async () => {
        expect(fs.existsSync(helperPath)).toBe(true);
        const { copyTextToClipboard } = await import('./copyTextToClipboard.js');
        const writeText = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', {
            clipboard: { writeText }
        });

        const result = await copyTextToClipboard('https://checkout.example/pay');

        expect(writeText).toHaveBeenCalledWith('https://checkout.example/pay');
        expect(result).toBe(true);
    });

    it('returns false when there is no text to copy', async () => {
        expect(fs.existsSync(helperPath)).toBe(true);
        const { copyTextToClipboard } = await import('./copyTextToClipboard.js');
        const writeText = vi.fn();
        vi.stubGlobal('navigator', {
            clipboard: { writeText }
        });

        expect(await copyTextToClipboard('')).toBe(false);
        expect(writeText).not.toHaveBeenCalled();
    });

    it('returns false when clipboard is unavailable', async () => {
        expect(fs.existsSync(helperPath)).toBe(true);
        const { copyTextToClipboard } = await import('./copyTextToClipboard.js');
        vi.stubGlobal('navigator', {});

        expect(await copyTextToClipboard('https://checkout.example/pay')).toBe(
            false
        );
    });
});
