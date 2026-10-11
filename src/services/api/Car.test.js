import { describe, it, expect, vi, beforeEach } from 'vitest';
import CarApi from './Car.js';

const networkMock = vi.hoisted(() => ({
    pendingRequest: { add: () => {} },
    get: vi.fn(() => Promise.resolve({})),
    post: vi.fn(() => Promise.resolve({})),
    put: vi.fn(() => Promise.resolve({})),
    delete: vi.fn(() => Promise.resolve({})),
    addRequest: vi.fn()
}));

vi.mock('../network.js', () => ({ default: networkMock }));

describe('CarApi', () => {
    beforeEach(() => {
        networkMock.get.mockClear();
        networkMock.post.mockClear();
        networkMock.put.mockClear();
        networkMock.delete.mockClear();
        networkMock.addRequest.mockClear();
    });

    it('GETs a car by id', () => {
        new CarApi().show(3);

        expect(networkMock.get).toHaveBeenCalledWith(
            '/api/cars/3',
            undefined,
            undefined
        );
    });

    it('POSTs a new car', () => {
        const data = { brand: 'Fiat', model: '500' };

        new CarApi().create(data);

        expect(networkMock.post).toHaveBeenCalledWith(
            '/api/cars',
            data,
            undefined
        );
    });

    it('PUTs an existing car by id', () => {
        const data = { id: 7, brand: 'Ford' };

        new CarApi().update(data);

        expect(networkMock.put).toHaveBeenCalledWith(
            '/api/cars/7',
            data,
            undefined
        );
    });

    it('delegates delete to TaggedApi without recursing into itself', () => {
        const data = { id: 5 };

        new CarApi().delete(data);

        expect(networkMock.delete).toHaveBeenCalledWith(
            '/api/cars/5',
            data,
            undefined
        );
    });
});
