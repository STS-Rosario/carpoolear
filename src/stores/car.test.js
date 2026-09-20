import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useCarsStore } from './car.js';
import { CarApi } from '../services/api';

vi.mock('../services/api', () => ({
    CarApi: vi.fn()
}));

const carApi = () => CarApi.mock.instances[0];

describe('useCarsStore', () => {
    let store;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useCarsStore();
        carApi().index = vi.fn();
        carApi().create = vi.fn();
        carApi().update = vi.fn();
        carApi().delete = vi.fn();
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('loads the cars list from the API', async () => {
        carApi().index.mockResolvedValue({
            data: [{ id: 1, name: 'Fiat' }]
        });

        await store.index({ some_filter: 1 });

        expect(store.cars).toEqual([{ id: 1, name: 'Fiat' }]);
    });

    it('falls back to an empty list when the API returns an unexpected shape', async () => {
        carApi().index.mockResolvedValue({});

        await store.index({});

        expect(store.cars).toEqual([]);
    });

    it('creates a car and appends it to the list', async () => {
        const car = { id: 2, name: 'Gol' };
        carApi().create.mockResolvedValue({ data: car });

        const created = await store.create({ name: 'Gol' });

        expect(created).toEqual(car);
        expect(store.cars).toEqual([car]);
    });

    it('updates a car in place', async () => {
        store.cars = [{ id: 3, name: 'A' }];
        carApi().update.mockResolvedValue({ data: { id: 3, name: 'B' } });

        await store.update({ id: 3 });

        expect(store.cars).toEqual([{ id: 3, name: 'B' }]);
    });

    it('removes the car matching the id (string or number)', async () => {
        store.cars = [{ id: 5, name: 'X' }, { id: 6, name: 'Y' }];
        carApi().delete.mockResolvedValue({});

        await store.delete({ id: '5' });

        expect(store.cars).toEqual([{ id: 6, name: 'Y' }]);
    });

    it('swallows index errors without touching the list', async () => {
        carApi().index.mockRejectedValue(new Error('down'));

        await expect(store.index({})).resolves.toBeUndefined();
        expect(store.cars).toBeNull();
    });

    it('rejects create errors', async () => {
        carApi().create.mockRejectedValue(new Error('nope'));

        await expect(store.create({})).rejects.toThrow('nope');
    });
});
