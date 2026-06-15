import { describe, it, expect } from 'vitest';
import {
    IMAGE_UPLOAD_ACCEPT,
    getImageFileExtension,
    isAllowedImageUpload,
    filterAllowedImageUploads,
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
});
