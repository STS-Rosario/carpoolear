import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthApi from './Auth.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('AuthApi', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('POSTs credentials to the login endpoint', () => {
        const creds = { email: 'a@b.com', password: 'secret' };

        new AuthApi().login(creds);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/login',
            creds,
            undefined
        );
    });

    it('POSTs to the logout endpoint', () => {
        new AuthApi().logout();

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/logout',
            undefined,
            undefined
        );
    });

    it('POSTs the handoff data to consume impersonation', () => {
        const data = { token: 'abc123' };

        new AuthApi().consumeImpersonation(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/auth/impersonate/consume',
            data,
            undefined
        );
    });

    it('POSTs an empty body to stop impersonation', () => {
        new AuthApi().stopImpersonation();

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/impersonate/stop',
            {},
            undefined
        );
    });
});
