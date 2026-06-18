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
            review_status: 'pending'
        }, t)).toBe('estadoPendienteRevision');
    });

    it('uses warning badge for pending paid reviews', () => {
        expect(getManualIdentityValidationStatusBadgeClass({
            paid: true,
            review_status: 'pending'
        })).toBe('label label-warning');
    });

    it('formats waiting time from submitted_at to now', () => {
        const now = new Date('2026-06-18 12:30:00').getTime();
        const result = formatManualIdentityValidationWaitingTime({
            submitted_at: '2026-06-18 10:00:00'
        }, t, now);

        expect(result).toBe('2 tiempoEsperaHoras 30 tiempoEsperaMinutos');
    });
});
