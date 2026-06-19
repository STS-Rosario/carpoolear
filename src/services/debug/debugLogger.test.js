import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDebugLogger } from './debugLogger.js';
import { buildSupportInfoSnapshot } from '../../utils/supportInfo.js';

describe('debugLogger', () => {
    let mockStorage;
    let mockGetSupportInfoSnapshot;
    let originalConsole;

    beforeEach(() => {
        mockStorage = {
            getItem: vi.fn().mockResolvedValue(null),
            setItem: vi.fn().mockResolvedValue()
        };
        mockGetSupportInfoSnapshot = vi.fn().mockReturnValue(
            buildSupportInfoSnapshot({
                appVersionInfo: null,
                windowAppVersion: '3.1.6',
                capacitorPlatform: 'web',
                isNativePlatform: false,
                device: { platform: 'web', model: 'Test', version: '1.0' },
                notificationPermission: 'default',
                networkOnline: true
            })
        );
        originalConsole = { ...console };
    });

    afterEach(() => {
        Object.keys(originalConsole).forEach((key) => {
            console[key] = originalConsole[key];
        });
    });

    describe('init', () => {
        it('clears the log buffer on init', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.log('first');
            await logger.init();
            console.log('second');
            const info = logger.getDebugInfo();
            expect(info).not.toContain('first');
            expect(info).toContain('second');
        });

        it('reads enabled state from storage on init', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            expect(logger.isEnabled()).toBe(true);
        });
    });

    describe('log capture', () => {
        it('captures console.log when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.log('hello world');
            const info = logger.getDebugInfo();
            expect(info).toContain('hello world');
            expect(info).toContain('log');
        });

        it('captures console.warn when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.warn('warning message');
            const info = logger.getDebugInfo();
            expect(info).toContain('warning message');
            expect(info).toContain('warn');
        });

        it('captures console.error when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.error('error message');
            const info = logger.getDebugInfo();
            expect(info).toContain('error message');
            expect(info).toContain('error');
        });
    });

    describe('clearLogs', () => {
        it('clears previous logs', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.log('before clear');
            logger.clearLogs();
            console.log('after clear');
            const info = logger.getDebugInfo();
            expect(info).not.toContain('before clear');
            expect(info).toContain('after clear');
        });
    });

    describe('getDebugInfo', () => {
        it('includes labeled support info fields in output', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            const info = logger.getDebugInfo();
            expect(info).toContain('App Version: 3.1.6');
            expect(info).toContain('Platform: web');
            expect(info).toContain('Device Model: Test');
            expect(info).toContain('OS Version: 1.0');
            expect(info).not.toContain('"platform"');
        });

        it('includes notification permission in output', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            const info = logger.getDebugInfo();
            expect(info).toContain('default');
        });

        it('includes captured log lines', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            console.log('my log entry');
            const info = logger.getDebugInfo();
            expect(info).toContain('my log entry');
        });

        it('uses refreshed support info snapshot when updated', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            logger.setSupportInfoSnapshot(buildSupportInfoSnapshot({
                windowAppVersion: '9.9.9',
                capacitorPlatform: 'android',
                isNativePlatform: true,
                device: { platform: 'android', model: 'Pixel', version: '15' }
            }));
            const info = logger.getDebugInfo();
            expect(info).toContain('App Version: 9.9.9');
            expect(info).toContain('Platform: android');
        });
    });

    describe('isEnabled / setEnabled', () => {
        it('returns false when not enabled', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            expect(logger.isEnabled()).toBe(false);
        });

        it('persists enabled state via storage', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            await logger.init();
            mockStorage.setItem.mockClear();
            await logger.setEnabled(true);
            expect(mockStorage.setItem).toHaveBeenCalledWith('DEBUG_MODE_ENABLED', true);
        });

        it('reads enabled state from storage', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getSupportInfoSnapshot: mockGetSupportInfoSnapshot });
            const enabled = await logger.isEnabledAsync();
            expect(enabled).toBe(true);
        });
    });
});
