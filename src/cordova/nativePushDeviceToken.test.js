import { describe, expect, it, vi } from 'vitest';
import {
    isIosNativePlatform,
    persistPushDeviceToken
} from './nativePushDeviceToken.js';

describe('isIosNativePlatform', () => {
    it('is true only for ios', () => {
        expect(isIosNativePlatform('ios')).toBe(true);
        expect(isIosNativePlatform('android')).toBe(false);
        expect(isIosNativePlatform('web')).toBe(false);
    });
});

describe('persistPushDeviceToken', () => {
    it('sets device id then registers', async () => {
        const setDeviceId = vi.fn();
        const register = vi.fn().mockResolvedValue(undefined);
        await persistPushDeviceToken('fcm-token', { setDeviceId, register });
        expect(setDeviceId).toHaveBeenCalledWith('fcm-token');
        expect(register).toHaveBeenCalled();
    });

    it('no-ops when token is empty', async () => {
        const setDeviceId = vi.fn();
        const register = vi.fn();
        await persistPushDeviceToken('', { setDeviceId, register });
        expect(setDeviceId).not.toHaveBeenCalled();
        expect(register).not.toHaveBeenCalled();
    });
});
