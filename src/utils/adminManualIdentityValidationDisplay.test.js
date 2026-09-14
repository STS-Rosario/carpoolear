import { describe, expect, it } from 'vitest';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationReviewActionAdminLabelKey,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel,
    shouldShowManualIdentityValidationReviewAdminAction
} from './adminManualIdentityValidationDisplay.js';

describe('adminManualIdentityValidationDisplay', () => {
    const t = (key) => key;

    it('labels pending paid reviews as pending revision', () => {
        expect(getManualIdentityValidationStatusLabel({
            paid: true,
            review_status: 'pending',
            submitted_at: '2026-06-18 10:00:00'
        }, t)).toBe('estadoPendienteRevision');
    });

    it('labels paid requests awaiting photos before submission', () => {
        expect(getManualIdentityValidationStatusLabel({
            paid: true,
            review_status: 'awaiting_photos',
            submitted_at: null
        }, t)).toBe('estadoEsperandoFotos');
    });

    it('uses info badge for paid requests awaiting photos', () => {
        expect(getManualIdentityValidationStatusBadgeClass({
            paid: true,
            review_status: 'awaiting_photos',
            submitted_at: null
        })).toBe('label label-info');
    });

    it('uses warning badge for pending paid reviews', () => {
        expect(getManualIdentityValidationStatusBadgeClass({
            paid: true,
            review_status: 'pending',
            submitted_at: '2026-06-18 10:00:00'
        })).toBe('label label-warning');
    });

    it('labels closed paid requests as cerrado', () => {
        expect(getManualIdentityValidationStatusLabel({
            paid: true,
            review_status: 'closed',
            submitted_at: '2026-06-18 10:00:00'
        }, t)).toBe('estadoCerrado');
    });

    it('labels unpaid closed requests as cerrado', () => {
        expect(getManualIdentityValidationStatusLabel({
            paid: false,
            review_status: 'closed',
            submitted_at: null
        }, t)).toBe('estadoCerrado');
    });

    it('uses default badge for closed requests', () => {
        expect(getManualIdentityValidationStatusBadgeClass({
            paid: true,
            review_status: 'closed',
            submitted_at: '2026-06-18 10:00:00'
        })).toBe('label label-default');
    });

    it('formats waiting time from submitted_at to now', () => {
        const now = new Date('2026-06-18 12:30:00').getTime();
        const result = formatManualIdentityValidationWaitingTime({
            submitted_at: '2026-06-18 10:00:00'
        }, t, now);

        expect(result).toBe('2 tiempoEsperaHoras 30 tiempoEsperaMinutos');
    });

    it('maps approved review status to approved-by label key', () => {
        expect(getManualIdentityValidationReviewActionAdminLabelKey('approved')).toBe('aprobadoPor');
        expect(getManualIdentityValidationReviewActionAdminLabelKey('approve')).toBe('aprobadoPor');
    });

    it('maps rejected review status to rejected-by label key', () => {
        expect(getManualIdentityValidationReviewActionAdminLabelKey('rejected')).toBe('rechazadoPor');
        expect(getManualIdentityValidationReviewActionAdminLabelKey('reject')).toBe('rechazadoPor');
    });

    it('maps pending review status to marked-pending-by label key', () => {
        expect(getManualIdentityValidationReviewActionAdminLabelKey('pending')).toBe('marcadoPendientePor');
    });

    it('shows review admin action only when reviewed_at is present', () => {
        expect(shouldShowManualIdentityValidationReviewAdminAction({
            reviewed_at: '2026-06-18 10:00:00',
            reviewed_by_name: 'Admin One'
        })).toBe(true);

        expect(shouldShowManualIdentityValidationReviewAdminAction({
            reviewed_at: null,
            reviewed_by_name: 'Admin One'
        })).toBe(false);
    });
});
