import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('debug service index', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('isEnabledAsync returns false when the debug logger has not been initialized', async () => {
        const { isEnabledAsync } = await import('./index.js');
        await expect(isEnabledAsync()).resolves.toBe(false);
    });

    it('isEnabledAsync reads enabled state from the initialized debug logger instance', async () => {
        const cache = {
            getItem: vi.fn().mockResolvedValue(true),
            setItem: vi.fn().mockResolvedValue()
        };

        vi.doMock('../cache', () => ({ default: cache }));
        vi.doMock('../../utils/supportInfo.js', () => ({
            buildSupportInfoSnapshot: vi.fn().mockReturnValue({}),
            fetchSupportInfoSnapshot: vi.fn().mockResolvedValue({})
        }));

        const { init, isEnabledAsync } = await import('./index.js');
        await init();

        await expect(isEnabledAsync()).resolves.toBe(true);
    });
});
