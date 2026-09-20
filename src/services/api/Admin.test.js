import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import AdminApi from './Admin.js';

const mockNetwork = vi.hoisted(() => ({
    pendingRequest: { add: vi.fn() },
    addRequest: vi.fn(),
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    put: vi.fn(() => Promise.resolve({})),
    patch: vi.fn(() => Promise.resolve({})),
    delete: vi.fn(() => Promise.resolve({}))
}));

vi.mock('../../services/network.js', () => ({ default: mockNetwork }));

function expectNetworkCall(method, url, params) {
    expect(method).toHaveBeenCalledWith(url, params, undefined);
}

describe('AdminApi', () => {
    let api;

    beforeEach(() => {
        api = new AdminApi();
        network.get.mockClear();
        network.post.mockClear();
        network.put.mockClear();
        network.patch.mockClear();
        network.delete.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
        network.put.mockResolvedValue({ data: {} });
        network.patch.mockResolvedValue({ data: {} });
        network.delete.mockResolvedValue({ data: {} });
    });

    it('updates a user from the admin panel', () => {
        api.adminUpdate({ id: 1, verified: true });
        expectNetworkCall(network.put, '/api/users/modify', { id: 1, verified: true });
    });

    it('lists admin users with pagination params', () => {
        api.getUsersList({ page: 2 });
        expectNetworkCall(network.get, '/api/admin/users', { page: 2 });
    });

    it('fetches the dashboard', () => {
        api.getDashboard();
        expectNetworkCall(network.get, '/api/admin/dashboard', {});
    });

    it('deletes a user with an empty body', () => {
        api.deleteUser(12);
        expectNetworkCall(network.post, '/api/admin/users/12/delete', {});
    });

    it('bans and anonymizes with an optional note', () => {
        api.banAndAnonymizeUser(12, 'spam');
        expectNetworkCall(network.post, '/api/admin/users/12/ban-and-anonymize', {
            note: 'spam'
        });

        api.banAndAnonymizeUser(13);
        expectNetworkCall(network.post, '/api/admin/users/13/ban-and-anonymize', {
            note: ''
        });
    });

    it('reviews identity validations with a reject reason', () => {
        api.reviewManualIdentityValidation(5, 'reject', 'duplicada', 'Evidencia inválida');
        expectNetworkCall(network.post, '/api/admin/manual-identity-validations/5/review', {
            action: 'reject',
            note: 'duplicada',
            reject_reason: 'Evidencia inválida'
        });

        api.reviewManualIdentityValidation(6, 'approve', 'ok');
        expectNetworkCall(network.post, '/api/admin/manual-identity-validations/6/review', {
            action: 'approve',
            note: 'ok'
        });
    });

    it('reviews rejected Mercado Pago validations', () => {
        api.reviewMercadoPagoRejectedValidation(3, 'approve', 'ok');
        expectNetworkCall(network.post, '/api/admin/mercado-pago-rejected-validations/3/review', {
            action: 'approve',
            note: 'ok'
        });
    });

    it('patches ratings and references for moderation', () => {
        api.updateRating(7, { status: 'hidden' });
        expectNetworkCall(network.patch, '/api/admin/ratings/7', { status: 'hidden' });

        api.updateReference(8, { status: 'hidden' });
        expectNetworkCall(network.patch, '/api/admin/references/8', { status: 'hidden' });
    });

    it('cancels maintenance schedules with DELETE', () => {
        api.cancelMaintenanceSchedule(21);
        expectNetworkCall(network.delete, '/api/admin/maintenance/schedules/21', undefined);
    });

    it('persists the maintenance state with PUT', () => {
        api.putMaintenanceState({ enabled: true });
        expectNetworkCall(network.put, '/api/admin/maintenance/state', { enabled: true });
    });

    it('impersonates users', () => {
        api.impersonateUser(99);
        expectNetworkCall(network.post, '/api/admin/users/99/impersonate', {});
    });
});
