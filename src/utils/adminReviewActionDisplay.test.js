import { describe, expect, it } from 'vitest';
import {
    getReviewActionAdminLabelKey,
    shouldShowReviewAdminAction
} from './adminReviewActionDisplay.js';

describe('adminReviewActionDisplay', () => {
    it('maps approved review status to approved-by label key', () => {
        expect(getReviewActionAdminLabelKey('approved')).toBe('aprobadoPor');
        expect(getReviewActionAdminLabelKey('approve')).toBe('aprobadoPor');
    });

    it('maps rejected review status to rejected-by label key', () => {
        expect(getReviewActionAdminLabelKey('rejected')).toBe('rechazadoPor');
        expect(getReviewActionAdminLabelKey('reject')).toBe('rechazadoPor');
    });

    it('maps pending review status to marked-pending-by label key', () => {
        expect(getReviewActionAdminLabelKey('pending')).toBe('marcadoPendientePor');
    });

    it('shows review admin action only when reviewed_at is present', () => {
        expect(shouldShowReviewAdminAction({
            reviewed_at: '2026-06-18 10:00:00',
            reviewed_by_name: 'Admin One'
        })).toBe(true);

        expect(shouldShowReviewAdminAction({
            reviewed_at: null,
            reviewed_by_name: 'Admin One'
        })).toBe(false);
    });
});
