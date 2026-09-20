import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import UserApi from './User.js';

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

describe('UserApi', () => {
    let api;

    beforeEach(() => {
        api = new UserApi();
        network.get.mockClear();
        network.post.mockClear();
        network.put.mockClear();
        network.addRequest.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
        network.put.mockResolvedValue({ data: {} });
    });

    it('registers users with multipart headers', () => {
        const headers = { 'Content-Type': 'multipart/form-data' };
        const data = { name: 'Ana' };

        api.register(data);

        expect(network.post).toHaveBeenCalledWith('/api/users', data, headers);
    });

    it('updates users with a spoofed _method PUT field', () => {
        const form = new FormData();
        form.append('name', 'Ana');

        api.update(form);

        expect(form.get('_method')).toBe('PUT');
        expect(network.post).toHaveBeenCalledWith(
            '/api/users',
            form,
            { 'Content-Type': 'multipart/form-data' }
        );
    });

    it('updates the user photo with PUT', () => {
        api.updatePhoto({ file: 'x' });
        expectNetworkCall(network.put, '/api/users/photo', { file: 'x' });
    });

    it('shows the current user by default', () => {
        api.show(undefined);
        expectNetworkCall(network.get, '/api/users/me', {});

        api.show(5);
        expectNetworkCall(network.get, '/api/users/5', {});
    });

    it('fetches badges for a specific user or the current one', () => {
        api.getBadges(7);
        api.getBadges();
        expect(network.get).toHaveBeenNthCalledWith(1, '/api/users/7/badges', {}, undefined);
        expect(network.get).toHaveBeenNthCalledWith(2, '/api/users/me/badges', {}, undefined);
    });

    it('lists users forwarding the query params', () => {
        api.list({ term: 'ana' });
        expectNetworkCall(network.get, '/api/users/list', { term: 'ana' });
    });

    it('requests account deletion', () => {
        api.deleteAccountRequest();
        expect(network.post).toHaveBeenCalledWith(
            '/api/users/delete-account-request',
            {},
            undefined
        );

        api.deleteAccount();
        expect(network.post).toHaveBeenCalledWith('/api/users/delete-account', {}, undefined);
    });

    it('appends a language query for terms text', () => {
        api.getTermsText('en');
        expect(network.get).toHaveBeenCalledWith('/api/users/terms?lang=en', undefined, undefined);

        api.getTermsText('');
        expect(network.get).toHaveBeenCalledWith('/api/users/terms', undefined, undefined);
    });

    it('composes change-property URLs from the passed data', () => {
        api.changeProperty({ property: 'gender', value: 'f' });
        expect(network.post).toHaveBeenCalledWith('/api/users/change/gender/f', null, undefined);
    });

    it('appends the request id to manual identity validation uploads', () => {
        const form = new FormData();
        form.append('photo', 'x');

        api.submitManualIdentityValidation(42, form);

        expect(form.get('request_id')).toBe('42');
        expect(network.post).toHaveBeenCalledWith(
            '/api/users/manual-identity-validation',
            form,
            { 'Content-Type': 'multipart/form-data' }
        );
    });
});
