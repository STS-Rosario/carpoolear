import { describe, it, expect, vi, beforeEach } from 'vitest';
import UserApi from './User.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('UserApi', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('defaults to /me when no id is provided on show', () => {
        new UserApi().show();

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/users/me',
            {},
            undefined
        );
    });

    it('passes query params when requesting the Mercado Pago OAuth URL', () => {
        const params = { surface: 'choice_cards' };

        new UserApi().getMercadoPagoOAuthUrl(params);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/users/mercadopago-oauth-url',
            params,
            undefined
        );
    });

    it('posts whitelisted identity verification client events', () => {
        const payload = { event: 'viewed', surface: 'choice_cards' };

        new UserApi().recordIdentityVerificationEvent(payload);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/users/identity-verification-events',
            payload,
            undefined
        );
    });

    it('appends _method=PUT and posts multipart when updating a user', () => {
        const form = new FormData();
        form.append('name', 'jane');

        new UserApi().update(form);

        expect(form.get('_method')).toBe('PUT');
        expect(networkMock.post).toHaveBeenCalledWith('/api/users', form, {
            'Content-Type': 'multipart/form-data'
        });
    });
});
