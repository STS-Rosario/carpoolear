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

    it('GETs the user-migrations list with params', () => {
        const params = { page: 2 };

        new AdminApi().getUserMigrations(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/user-migrations',
            params,
            undefined
        );
    });

    it('POSTs a new user migration', () => {
        const data = { user_id: 1 };

        new AdminApi().createUserMigration(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/user-migrations',
            data,
            undefined
        );
    });

    it('PATCHes a rating by id', () => {
        const data = { score: 5 };

        new AdminApi().updateRating(9, data);

        expect(networkMock.patch).toHaveBeenCalledWith(
            '/api/admin/ratings/9',
            data,
            undefined
        );
    });

    it('PATCHes a reference by id', () => {
        const data = { note: 'ok' };

        new AdminApi().updateReference(4, data);

        expect(networkMock.patch).toHaveBeenCalledWith(
            '/api/admin/references/4',
            data,
            undefined
        );
    });

    it('POSTs a private admin note to a manual identity validation', () => {
        new AdminApi().updateManualIdentityValidationPrivateNote(3, 'hola');

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/manual-identity-validations/3/private-note',
            { private_admin_note: 'hola' },
            undefined
        );
    });

    it('POSTs review_status and paid to the manual identity validation state endpoint', () => {
        const payload = { review_status: 'approved', paid: true };

        new AdminApi().updateManualIdentityValidationState(3, payload);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/admin/manual-identity-validations/3/state',
            payload,
            undefined
        );
    });

    it('GETs the admin action-logs list', () => {
        const params = { page: 1 };

        new AdminApi().getActionLogs(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/admin/action-logs',
            params,
            undefined
        );
    });
});
