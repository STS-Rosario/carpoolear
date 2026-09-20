import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import ConversationApi from './ConversationApi.js';

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

describe('ConversationApi', () => {
    let api;

    beforeEach(() => {
        api = new ConversationApi();
        network.get.mockClear();
        network.post.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
    });

    it('lists conversations with the given data', () => {
        api.list({ page: 1 });
        expectNetworkCall(network.get, '/api/conversations', { page: 1 });
    });

    it('lists conversations with empty params by default', () => {
        api.list();
        expectNetworkCall(network.get, '/api/conversations', {});
    });

    it('shows a conversation by id', () => {
        api.show(4);
        expectNetworkCall(network.get, '/api/conversations/show/4', undefined);
    });

    it('creates conversations between a user and a trip', () => {
        api.create(100, 200);
        expectNetworkCall(network.post, '/api/conversations', { to: 100, tripId: 200 });
    });

    it('fetches messages with pagination data', () => {
        api.getMessages(4, { page: 2 });
        expectNetworkCall(network.get, '/api/conversations/4', { page: 2 });
    });

    it('lists participants of a conversation', () => {
        api.getUsers(4);
        expectNetworkCall(network.get, '/api/conversations/4/users', {});
    });

    it('sends a message with the text payload', () => {
        api.send(4, 'hola');
        expectNetworkCall(network.post, '/api/conversations/4/send', { message: 'hola' });
    });

    it('broadcasts to all conversations', () => {
        api.sendToAll({ message: 'aviso' });
        expectNetworkCall(network.post, '/api/conversations/multi-send', { message: 'aviso' });
    });

    it('checks unread conversations', () => {
        api.unread({ limit: 5 });
        expectNetworkCall(network.get, '/api/conversations/unread', { limit: 5 });
    });

    it('shows the conversation for a trip', () => {
        api.showByTrip(33);
        expectNetworkCall(network.get, '/api/conversations/trip/33', undefined);
    });

    it('updates notification preferences', () => {
        api.updateNotifications(4, false);
        expectNetworkCall(network.post, '/api/conversations/4/notifications', {
            enabled: false
        });
    });
});
