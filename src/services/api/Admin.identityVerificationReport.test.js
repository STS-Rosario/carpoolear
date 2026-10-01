import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminApi from './Admin.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('AdminApi.getIdentityVerificationReport', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
    });

    it('GETs the report endpoint mapping filters to snake_case query params', () => {
        new AdminApi().getIdentityVerificationReport({
            from: '2026-09-01',
            to: '2026-10-31',
            groupBy: 'week',
            method: 'mercado_pago',
            surface: 'choice_cards',
            platform: 'android',
            appVersion: '4.0.19'
        });

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/identity-verification-report',
            {
                from: '2026-09-01',
                to: '2026-10-31',
                group_by: 'week',
                method: 'mercado_pago',
                surface: 'choice_cards',
                platform: 'android',
                app_version: '4.0.19'
            },
            undefined
        );
    });

    it('defaults group_by to month and method to all, and omits blank optional filters', () => {
        new AdminApi().getIdentityVerificationReport({
            from: '2026-09-01',
            to: '2026-09-30',
            surface: '  ',
            platform: '',
            appVersion: null
        });

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/identity-verification-report',
            {
                from: '2026-09-01',
                to: '2026-09-30',
                group_by: 'month',
                method: 'all'
            },
            undefined
        );
    });

    it('trims optional text filters', () => {
        new AdminApi().getIdentityVerificationReport({
            from: '2026-09-01',
            to: '2026-09-30',
            appVersion: ' 4.0.19 '
        });

        expect(networkMock.get.mock.calls[0][1].app_version).toBe('4.0.19');
    });
});
