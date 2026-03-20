import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createDebugLogger } from './debugLogger.js';

describe('debugLogger', () => {
    let mockStorage;
    let mockGetDeviceInfo;
    let originalConsole;

    beforeEach(() => {
        mockStorage = {
            getItem: vi.fn().mockResolvedValue(null),
            setItem: vi.fn().mockResolvedValue()
        };
        mockGetDeviceInfo = vi.fn().mockReturnValue({
            appVersion: '3.1.6',
            device: { platform: 'web', model: 'Test', osVersion: '1.0' },
            notificationPermission: 'default',
            networkOnline: true
        });
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
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
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
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            expect(logger.isEnabled()).toBe(true);
        });
    });

    describe('log capture', () => {
        it('captures console.log when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            console.log('hello world');
            const info = logger.getDebugInfo();
            expect(info).toContain('hello world');
            expect(info).toContain('log');
        });

        it('captures console.warn when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            console.warn('warning message');
            const info = logger.getDebugInfo();
            expect(info).toContain('warning message');
            expect(info).toContain('warn');
        });

        it('captures console.error when enabled', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
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
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
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
        it('includes app version in output', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            const info = logger.getDebugInfo();
            expect(info).toContain('3.1.6');
        });

        it('includes device info in output', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            const info = logger.getDebugInfo();
            expect(info).toContain('web');
            expect(info).toContain('Test');
        });

        it('includes notification permission in output', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            const info = logger.getDebugInfo();
            expect(info).toContain('default');
        });

        it('includes captured log lines', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            console.log('my log entry');
            const info = logger.getDebugInfo();
            expect(info).toContain('my log entry');
        });
    });

    describe('isEnabled / setEnabled', () => {
        it('returns false when not enabled', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            expect(logger.isEnabled()).toBe(false);
        });

        it('persists enabled state via storage', async () => {
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            await logger.init();
            mockStorage.setItem.mockClear();
            await logger.setEnabled(true);
            expect(mockStorage.setItem).toHaveBeenCalledWith('DEBUG_MODE_ENABLED', true);
        });

        it('reads enabled state from storage', async () => {
            mockStorage.getItem.mockResolvedValue(true);
            const logger = createDebugLogger({ storage: mockStorage, getDeviceInfo: mockGetDeviceInfo });
            const enabled = await logger.isEnabledAsync();
            expect(enabled).toBe(true);
        });
    });
});
