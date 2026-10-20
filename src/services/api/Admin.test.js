import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminApi from './Admin.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    patch: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('AdminApi contract', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.patch.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('GETs the user-migrations list with params', async () => {
        const params = { page: 2 };

        await new AdminApi().getUserMigrations(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/user-migrations',
            params,
            undefined
        );
    });

    it('POSTs a new user migration', async () => {
        const data = { user_id: 1 };

        await new AdminApi().createUserMigration(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/user-migrations',
            data,
            undefined
        );
    });

    it('PATCHes a rating by id', async () => {
        const data = { score: 5 };

        await new AdminApi().updateRating(9, data);

        expect(networkMock.patch).toHaveBeenCalledWith(
            '/api/admin/ratings/9',
            data,
            undefined
        );
    });

    it('PATCHes a reference by id', async () => {
        const data = { note: 'ok' };

        await new AdminApi().updateReference(4, data);

        expect(networkMock.patch).toHaveBeenCalledWith(
            '/api/admin/references/4',
            data,
            undefined
        );
    });

    it('POSTs a private admin note to a manual identity validation', async () => {
        await new AdminApi().updateManualIdentityValidationPrivateNote(3, 'hola');

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/manual-identity-validations/3/private-note',
            { private_admin_note: 'hola' },
            undefined
        );
    });

    it('POSTs review_status and paid to the manual identity validation state endpoint', async () => {
        const payload = { review_status: 'approved', paid: true };

        await new AdminApi().updateManualIdentityValidationState(3, payload);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/manual-identity-validations/3/state',
            payload,
            undefined
        );
    });

    it('GETs the admin action-logs list', async () => {
        const params = { page: 1 };

        await new AdminApi().getActionLogs(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/action-logs',
            params,
            undefined
        );
    });

    it('GETs the received and given ratings for a user', async () => {
        await new AdminApi().getUserRatings(7);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/users/7/ratings',
            undefined,
            undefined
        );
    });

    it('GETs the admin dashboard summary', async () => {
        await new AdminApi().getDashboard();

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/dashboard',
            {},
            undefined
        );
    });

    it('POSTs to start impersonation for a user', async () => {
        await new AdminApi().impersonateUser(7);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/users/7/impersonate',
            {},
            undefined
        );
    });

    it('POSTs a coded review with reject_reason when reviewing a validation', async () => {
        await new AdminApi().reviewManualIdentityValidation(
            3,
            'reject',
            'documento ilegible',
            'blurry'
        );

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/manual-identity-validations/3/review',
            {
                action: 'reject',
                note: 'documento ilegible',
                reject_reason: 'blurry'
            },
            undefined
        );
    });
});
