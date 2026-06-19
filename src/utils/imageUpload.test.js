import { describe, it, expect } from 'vitest';
import {
    IMAGE_UPLOAD_ACCEPT,
    DEFAULT_IMAGE_UPLOAD_MAX_BYTES,
    getImageFileExtension,
    getImageUploadMaxBytes,
    getImageUploadMaxMb,
    isAllowedImageUpload,
    filterAllowedImageUploads,
    findOversizedImageUploads,
    selectAllowedImageUploads,
    getImageUploadSizeErrorKey,
    getImageUploadSizeErrorParams,
    getDataUrlByteSize,
    normalizeCapacitorImageFormat
} from './imageUpload';

describe('imageUpload', () => {
    it('exposes accept attribute covering jpg and jpeg', () => {
        expect(IMAGE_UPLOAD_ACCEPT).toContain('.jpg');
        expect(IMAGE_UPLOAD_ACCEPT).toContain('.jpeg');
        expect(IMAGE_UPLOAD_ACCEPT).toContain('image/jpeg');
    });

    it('reads file extension from name', () => {
        expect(getImageFileExtension({ name: 'photo.JPEG' })).toBe('jpeg');
        expect(getImageFileExtension({ name: 'no-extension' })).toBe('');
    });

    it('accepts .jpeg uploads when .jpg is allowed', () => {
        const file = new File(['x'], 'scan.jpeg', { type: 'image/jpeg' });

        expect(isAllowedImageUpload(file)).toBe(true);
    });

    it('accepts .jpg uploads when .jpeg is allowed', () => {
        const file = new File(['x'], 'scan.jpg', { type: 'image/jpeg' });

        expect(isAllowedImageUpload(file)).toBe(true);
    });

    it('accepts image/jpg MIME for jpeg files', () => {
        const file = new File(['x'], 'scan.jpeg', { type: 'image/jpg' });

        expect(isAllowedImageUpload(file)).toBe(true);
    });

    it('rejects non-image uploads', () => {
        const file = new File(['x'], 'notes.pdf', { type: 'application/pdf' });

        expect(isAllowedImageUpload(file)).toBe(false);
    });

    it('filters uploads keeping jpeg files and dropping invalid ones', () => {
        const files = [
            new File(['a'], 'valid.jpeg', { type: 'image/jpeg' }),
            new File(['b'], 'invalid.pdf', { type: 'application/pdf' })
        ];

        expect(filterAllowedImageUploads(files)).toHaveLength(1);
        expect(filterAllowedImageUploads(files)[0].name).toBe('valid.jpeg');
    });

    it('normalizes capacitor jpg format to jpeg for data URIs', () => {
        expect(normalizeCapacitorImageFormat('jpg')).toBe('jpeg');
        expect(normalizeCapacitorImageFormat('jpeg')).toBe('jpeg');
    });

    it('defaults image upload max bytes to 10 MB when config is missing', () => {
        expect(getImageUploadMaxBytes(null)).toBe(DEFAULT_IMAGE_UPLOAD_MAX_BYTES);
        expect(DEFAULT_IMAGE_UPLOAD_MAX_BYTES).toBe(10 * 1024 * 1024);
    });

    it('reads image upload max bytes from server config', () => {
        expect(getImageUploadMaxBytes({ image_upload_max_bytes: 2 * 1024 * 1024 })).toBe(
            2 * 1024 * 1024
        );
    });

    it('exposes max upload size in megabytes for UI copy', () => {
        expect(getImageUploadMaxMb({ image_upload_max_bytes: 2 * 1024 * 1024 })).toBe(2);
    });

    it('finds oversized uploads and keeps a display label per file', () => {
        const small = new File(['a'], 'ok.jpg', { type: 'image/jpeg' });
        Object.defineProperty(small, 'size', { value: 100 });
        const large = new File(['b'], 'big.jpg', { type: 'image/jpeg' });
        Object.defineProperty(large, 'size', { value: DEFAULT_IMAGE_UPLOAD_MAX_BYTES + 1 });

        const oversized = findOversizedImageUploads([small, large], DEFAULT_IMAGE_UPLOAD_MAX_BYTES, (file) =>
            file.name === 'big.jpg' ? 'Front of ID' : file.name
        );

        expect(oversized).toEqual([
            {
                file: large,
                displayName: 'Front of ID'
            }
        ]);
    });

    it('selects allowed uploads and reports oversized files before submit', () => {
        const valid = new File(['a'], 'valid.jpg', { type: 'image/jpeg' });
        Object.defineProperty(valid, 'size', { value: 100 });
        const tooBig = new File(['b'], 'huge.jpg', { type: 'image/jpeg' });
        Object.defineProperty(tooBig, 'size', { value: DEFAULT_IMAGE_UPLOAD_MAX_BYTES + 1 });
        const invalid = new File(['c'], 'notes.pdf', { type: 'application/pdf' });

        const result = selectAllowedImageUploads([valid, tooBig, invalid], {
            limit: 3,
            maxBytes: DEFAULT_IMAGE_UPLOAD_MAX_BYTES
        });

        expect(result.files).toEqual([valid]);
        expect(result.oversized).toEqual([{ file: tooBig, displayName: 'huge.jpg' }]);
    });

    it('reads max bytes from config when selecting uploads', () => {
        const valid = new File(['a'], 'valid.jpg', { type: 'image/jpeg' });
        Object.defineProperty(valid, 'size', { value: 100 });
        const tooBig = new File(['b'], 'huge.jpg', { type: 'image/jpeg' });
        Object.defineProperty(tooBig, 'size', { value: 3 * 1024 * 1024 });

        const result = selectAllowedImageUploads([valid, tooBig], {
            config: { image_upload_max_bytes: 2 * 1024 * 1024 }
        });

        expect(result.files).toEqual([valid]);
        expect(result.oversized).toHaveLength(1);
    });

    it('builds i18n key and params for a single oversized file', () => {
        const file = new File(['x'], 'selfie.jpg', { type: 'image/jpeg' });
        const oversized = [{ file, displayName: 'Photo of yourself holding your ID' }];

        expect(getImageUploadSizeErrorKey(oversized)).toBe('imageUploadTooLargeSingle');
        expect(getImageUploadSizeErrorParams(oversized, DEFAULT_IMAGE_UPLOAD_MAX_BYTES)).toEqual({
            fileLabel: 'Photo of yourself holding your ID',
            maxMb: 10
        });
    });

    it('builds i18n key and params for multiple oversized files', () => {
        const first = new File(['a'], 'front.jpg', { type: 'image/jpeg' });
        const second = new File(['b'], 'back.jpg', { type: 'image/jpeg' });
        const oversized = [
            { file: first, displayName: 'front.jpg' },
            { file: second, displayName: 'Back of ID' }
        ];

        expect(getImageUploadSizeErrorKey(oversized)).toBe('imageUploadTooLargeMultiple');
        expect(getImageUploadSizeErrorParams(oversized, 2 * 1024 * 1024)).toEqual({
            fileLabels: 'front.jpg, Back of ID',
            maxMb: 2
        });
    });

    it('estimates decoded byte size from a data URL payload', () => {
        const bytes = new Uint8Array([1, 2, 3, 4, 5]);
        const base64 = btoa(String.fromCharCode(...bytes));
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        expect(getDataUrlByteSize(dataUrl)).toBe(bytes.length);
    });
});
