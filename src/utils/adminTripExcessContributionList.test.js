import { describe, expect, it } from 'vitest';
import {
    adminExcessContributionDetailRoute,
    adminTripSearchRoute,
    buildTripExcessContributionListParams,
    excessContributionStatusActions,
    excessContributionStatusButtonVariant,
    excessContributionStatusClass,
    excessContributionStatusLabel,
    excessContributionSupportTicketsRoute,
    formatTripContributionPesosLabel,
    formatAdminTripContributionLabel,
    formatAdminExcessContributionPercentageLabel,
    getNextTripExcessContributionSortState,
    getRequiresActionOnlyExcessContributions,
    parseTripExcessContributionListFromRoute,
    saveRequiresActionOnlyExcessContributions,
    TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS
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

    describe('formatAdminTripContributionLabel', () => {
        it('formats positive seat price cents as peso label', () => {
            expect(formatAdminTripContributionLabel(1000000)).toBe('$10000');
        });

        it('returns null for missing values so the UI can show N/D', () => {
            expect(formatAdminTripContributionLabel(null)).toBeNull();
            expect(formatAdminTripContributionLabel(0)).toBeNull();
        });
    });

    describe('formatAdminExcessContributionPercentageLabel', () => {
        it('formats stored percentage values', () => {
            expect(formatAdminExcessContributionPercentageLabel(100)).toBe('100%');
            expect(formatAdminExcessContributionPercentageLabel(140)).toBe('140%');
        });

        it('returns null for missing values so the UI can show N/D', () => {
            expect(formatAdminExcessContributionPercentageLabel(null)).toBeNull();
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
        it('lists other statuses with en proceso first and pendiente last', () => {
            expect(excessContributionStatusActions('pendiente')).toEqual([
                'en_proceso',
                'resuelto',
                'descartado'
            ]);
            expect(excessContributionStatusActions('en_proceso')).toEqual([
                'resuelto',
                'descartado',
                'pendiente'
            ]);
        });
    });

    describe('excessContributionStatusButtonVariant', () => {
        it('maps descartado to danger and resuelto to success', () => {
            expect(excessContributionStatusButtonVariant('descartado')).toBe('danger');
            expect(excessContributionStatusButtonVariant('resuelto')).toBe('success');
            expect(excessContributionStatusButtonVariant('pendiente')).toBe('secondary');
        });
    });

    describe('list filters and sorting params', () => {
        it('defaults requires action only preference to true', () => {
            const storage = new Map();

            expect(getRequiresActionOnlyExcessContributions({
                getItem: (key) => storage.get(key) ?? null,
                setItem: (key, value) => storage.set(key, value)
            })).toBe(true);
        });

        it('persists requires action only preference', () => {
            const storage = new Map();
            const memoryStorage = {
                getItem: (key) => storage.get(key) ?? null,
                setItem: (key, value) => storage.set(key, value)
            };

            saveRequiresActionOnlyExcessContributions(false, memoryStorage);
            expect(getRequiresActionOnlyExcessContributions(memoryStorage)).toBe(false);
        });

        it('builds list params with filter and sort', () => {
            expect(buildTripExcessContributionListParams({
                page: 2,
                perPage: 25,
                requiresActionOnly: true,
                sortKey: 'user_name',
                sortDir: 'asc'
            })).toEqual({
                page: 2,
                per_page: 25,
                requires_action_only: '1',
                sort: 'user_name',
                direction: 'asc'
            });
        });

        it('parses route query for filter and sort', () => {
            expect(parseTripExcessContributionListFromRoute({
                page: '3',
                requires_action_only: '1',
                sort: 'id',
                direction: 'desc'
            })).toEqual({
                page: 3,
                perPage: 20,
                requiresActionOnly: true,
                sortKey: 'id',
                sortDir: 'desc'
            });
        });

        it('toggles sort direction for active column', () => {
            expect(getNextTripExcessContributionSortState('id', 'desc', 'id')).toEqual({
                sortKey: 'id',
                sortDir: 'asc'
            });
            expect(getNextTripExcessContributionSortState(null, 'asc', 'user_name')).toEqual({
                sortKey: 'user_name',
                sortDir: 'asc'
            });
        });

        it('defines sortable columns for the list table', () => {
            expect(TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS.map((column) => column.key)).toEqual(
                expect.arrayContaining([
                    'average_contribution_cents',
                    'excess_contribution_percentage',
                    'exceso_contribucion_status'
                ])
            );
        });
    });
});
