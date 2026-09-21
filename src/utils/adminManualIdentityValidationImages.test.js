import { describe, it, expect } from 'vitest';
import {
    isApprovedWithImagesPending,
    shouldShowPurgedPhotosMessage
} from './adminManualIdentityValidationImages.js';

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

describe('isApprovedWithImagesPending', () => {
    it('returns true for approved rows that still have images', () => {
        expect(isApprovedWithImagesPending({
            review_status: 'approved',
            has_images: true
        })).toBe(true);
        expect(isApprovedWithImagesPending({
            review_status: 'approve',
            has_images: true
        })).toBe(true);
    });

    it('returns false when an approved row no longer has images', () => {
        expect(isApprovedWithImagesPending({
            review_status: 'approved',
            has_images: false
        })).toBe(false);
    });

    it('returns false for pending or rejected rows even if images remain', () => {
        expect(isApprovedWithImagesPending({
            review_status: 'pending',
            has_images: true
        })).toBe(false);
        expect(isApprovedWithImagesPending({
            review_status: 'rejected',
            has_images: true
        })).toBe(false);
    });

    it('returns false when the row is missing', () => {
        expect(isApprovedWithImagesPending(null)).toBe(false);
        expect(isApprovedWithImagesPending(undefined)).toBe(false);
    });
});
