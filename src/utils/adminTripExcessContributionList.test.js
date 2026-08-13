import { describe, expect, it } from 'vitest';
import {
    adminExcessContributionDetailRoute,
    adminTripSearchRoute,
    excessContributionStatusActions,
    excessContributionStatusClass,
    excessContributionStatusLabel,
    excessContributionSupportTicketsRoute,
    formatTripContributionPesosLabel
} from './adminTripExcessContributionList.js';

describe('adminTripExcessContributionList', () => {
    const t = (key) => key;

    describe('formatTripContributionPesosLabel', () => {
        it('formats positive seat price cents as peso label', () => {
            expect(formatTripContributionPesosLabel(1500000)).toBe('$15000');
            expect(formatTripContributionPesosLabel(2400000)).toBe('$24000');
        });

        it('returns dash for missing or non-positive values', () => {
            expect(formatTripContributionPesosLabel(null)).toBe('-');
            expect(formatTripContributionPesosLabel(0)).toBe('-');
            expect(formatTripContributionPesosLabel(-1)).toBe('-');
        });
    });

    describe('excessContributionStatusLabel', () => {
        it('maps status keys to i18n labels', () => {
            expect(excessContributionStatusLabel('pendiente', t)).toBe(
                'excesoContribucionStatusPendiente'
            );
            expect(excessContributionStatusLabel('en_proceso', t)).toBe(
                'excesoContribucionStatusEnProceso'
            );
        });
    });

    describe('excessContributionStatusClass', () => {
        it('returns badge classes per status', () => {
            expect(excessContributionStatusClass('resuelto')).toContain('label-success');
            expect(excessContributionStatusClass('pendiente')).toContain('label-warning');
        });
    });

    describe('routes', () => {
        it('builds admin detail and trip search routes', () => {
            expect(adminExcessContributionDetailRoute(42)).toEqual({
                name: 'admin-exceso-contribucion-detail',
                params: { tripId: '42' }
            });
            expect(adminTripSearchRoute(42)).toEqual({
                name: 'admin-trips',
                query: { trip_id: '42' }
            });
        });

        it('builds filtered support tickets route for excess contribution', () => {
            expect(excessContributionSupportTicketsRoute(7)).toEqual({
                name: 'admin-support-tickets',
                query: {
                    user_id: '7',
                    type: 'excess_contribution',
                    open: '1'
                }
            });
        });
    });

    describe('excessContributionStatusActions', () => {
        it('lists other statuses as available actions', () => {
            expect(excessContributionStatusActions('pendiente')).toEqual([
                'resuelto',
                'descartado',
                'en_proceso'
            ]);
        });
    });
});
