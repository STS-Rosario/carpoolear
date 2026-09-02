import { describe, expect, it } from 'vitest';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel
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
});
