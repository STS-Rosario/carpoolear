import { describe, expect, it, vi } from 'vitest';
import {
    computeScaledDimensions,
    compressImageFilesForUpload,
    DEFAULT_COMPRESS_MAX_DIMENSION,
    NATIVE_UPLOAD_TARGET_BYTES,
    resolveNativeUploadMaxBytes
} from './imageUploadCompress.js';

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false)
    }
}));

import { Capacitor } from '@capacitor/core';

describe('computeScaledDimensions', () => {
    it('keeps dimensions when already within max', () => {
        expect(computeScaledDimensions(800, 600, DEFAULT_COMPRESS_MAX_DIMENSION)).toEqual({
            width: 800,
            height: 600
        });
    });

    it('scales down the longest edge to max dimension', () => {
        expect(computeScaledDimensions(4032, 3024, DEFAULT_COMPRESS_MAX_DIMENSION)).toEqual({
            width: 3072,
            height: 2304
        });
    });

    it('handles portrait photos', () => {
        expect(computeScaledDimensions(3024, 4032, DEFAULT_COMPRESS_MAX_DIMENSION)).toEqual({
            width: 2304,
            height: 3072
        });
    });
});

describe('resolveNativeUploadMaxBytes', () => {
    it('uses config max on web', () => {
        Capacitor.isNativePlatform.mockReturnValue(false);

        expect(resolveNativeUploadMaxBytes({ image_upload_max_bytes: 5_000_000 })).toBe(5_000_000);
    });

    it('caps native uploads at 3MB', () => {
        Capacitor.isNativePlatform.mockReturnValue(true);

        expect(resolveNativeUploadMaxBytes({ image_upload_max_bytes: 10_000_000 })).toBe(
            NATIVE_UPLOAD_TARGET_BYTES
        );
    });
});

describe('compressImageFilesForUpload', () => {
    it('returns empty array for no files', async () => {
        await expect(compressImageFilesForUpload([], null)).resolves.toEqual([]);
    });
});
