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

    it('POSTs credentials to the login endpoint', async () => {
        const creds = { email: 'a@b.com', password: 'secret' };

        await new AuthApi().login(creds);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/login',
            creds,
            undefined
        );
    });

    it('POSTs to the logout endpoint', async () => {
        await new AuthApi().logout();

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/logout',
            undefined,
            undefined
        );
    });

    it('POSTs the handoff data to consume impersonation', async () => {
        const data = { token: 'abc123' };

        await new AuthApi().consumeImpersonation(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/auth/impersonate/consume',
            data,
            undefined
        );
    });

    it('POSTs an empty body to stop impersonation', async () => {
        await new AuthApi().stopImpersonation();

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/impersonate/stop',
            {},
            undefined
        );
    });
});
