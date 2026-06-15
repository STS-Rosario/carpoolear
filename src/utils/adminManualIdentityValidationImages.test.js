import { describe, it, expect } from 'vitest';
import { shouldShowPurgedPhotosMessage } from './adminManualIdentityValidationImages.js';

describe('shouldShowPurgedPhotosMessage', () => {
    it('returns false when photos were never submitted', () => {
        expect(shouldShowPurgedPhotosMessage({
            has_images: false,
            images_purged_at: null
        })).toBe(false);
    });

    it('returns true when an admin purged the photos', () => {
        expect(shouldShowPurgedPhotosMessage({
            has_images: false,
            images_purged_at: '2026-06-15 12:00:00'
        })).toBe(true);
    });

    it('returns false when photos are still available', () => {
        expect(shouldShowPurgedPhotosMessage({
            has_images: true,
            images_purged_at: '2026-06-15 12:00:00'
        })).toBe(false);
    });
});
