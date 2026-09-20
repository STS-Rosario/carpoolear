import { beforeEach, describe, expect, it, vi } from 'vitest';
import network from '../../services/network.js';
import TripApi from './Trips.js';

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

describe('TripApi', () => {
    let api;

    beforeEach(() => {
        api = new TripApi();
        network.get.mockClear();
        network.post.mockClear();
        network.put.mockClear();
        network.delete.mockClear();
        network.addRequest.mockClear();
        network.get.mockResolvedValue({ data: {} });
        network.post.mockResolvedValue({ data: {} });
        network.put.mockResolvedValue({ data: {} });
        network.delete.mockResolvedValue({ data: {} });
    });

    it('searches trips with the given filters', () => {
        api.search({ from: 'Rosario' });
        expectNetworkCall(network.get, '/api/trips', { from: 'Rosario' });
    });

    it('creates trips with POST', () => {
        api.create({ id: 1 });
        expectNetworkCall(network.post, '/api/trips', { id: 1 });
    });

    it('updates a trip targeting its id', () => {
        api.update({ id: 9, name: 'x' });
        expectNetworkCall(network.put, '/api/trips/9', { id: 9, name: 'x' });
    });

    it('changes seats with an increment payload', () => {
        api.changeSeats({ id: 4, increment: -1 });
        expectNetworkCall(network.post, '/api/trips/4/changeSeats', {
            id: 4,
            increment: -1
        });
    });

    it('removes a trip by id', () => {
        api.remove(8);
        expectNetworkCall(network.delete, '/api/trips/8', undefined);
    });

    it('shows a trip by id', () => {
        api.show(3);
        expectNetworkCall(network.get, '/api/trips/3', undefined);
    });

    it('lists my trips with the driver flag', () => {
        api.myTrips(true);
        expectNetworkCall(network.get, '/api/users/get-trips', { as_driver: true });
    });

    it('fetches the ongoing trip', () => {
        api.ongoingTrip();
        expectNetworkCall(network.get, '/api/users/ongoing-trip', undefined);
    });

    it('builds autocomplete params for a country', () => {
        api.autocomplete('Ros', 'AR', true);
        expectNetworkCall(network.get, '/api/trips/autocomplete', {
            name: 'Ros',
            country: 'AR',
            multicountry: true
        });
    });

    it('posts price requests with the raw payload', () => {
        api.price({ km: 120 });
        expectNetworkCall(network.post, '/api/trips/price', { km: 120 });
    });

    it('changes trip visibility', () => {
        api.changeVisibility({ id: 2, visible: false });
        expectNetworkCall(network.post, '/api/trips/2/change-visibility', {
            id: 2,
            visible: false
        });
    });

    it('invites friends with the friend ids payload', () => {
        api.inviteFriends(10, [1, 2]);
        expectNetworkCall(network.post, '/api/trips/10/invite-friends', {
            friend_ids: [1, 2]
        });
    });

    it('tracks requests with tags and clears them after the call', () => {
        network.get.mockReturnValue('xhr');
        api.tag(['trips']);
        api.show(1);

        expect(network.addRequest).toHaveBeenCalledWith('xhr', ['trips']);

        api.show(2);
        expect(network.addRequest).toHaveBeenLastCalledWith('xhr', null);
    });
});
