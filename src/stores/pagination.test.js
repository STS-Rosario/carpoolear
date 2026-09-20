import { describe, expect, it, vi } from 'vitest';
import {
    extractPaginatedList,
    makePaginationActions,
    makePaginationGetters,
    makePaginationState
} from './pagination.js';

describe('extractPaginatedList', () => {
    it('handles plain arrays', () => {
        expect(extractPaginatedList([1, 2])).toEqual([1, 2]);
    });

    it('unwraps the data key', () => {
        expect(extractPaginatedList({ data: [3, 4] })).toEqual([3, 4]);
    });

    it('unwraps nested paginator data', () => {
        expect(extractPaginatedList({ data: { data: [5] } })).toEqual([5]);
    });

    it('returns an empty list for unexpected shapes', () => {
        expect(extractPaginatedList(null)).toEqual([]);
        expect(extractPaginatedList({ foo: 1 })).toEqual([]);
    });
});

describe('makePaginationState', () => {
    it('builds the default pagination state for a resource', () => {
        expect(makePaginationState('trips')).toEqual({
            trips: null,
            tripsSearchParam: { page: 1, pageSize: 20, lastPage: false, data: {} },
            tripsCurrentPage: 1
        });
    });
});

describe('makePaginationGetters', () => {
    it('exposes MorePage from the lastPage flag', () => {
        const getters = makePaginationGetters('trips');
        expect(getters.tripsMorePage({ tripsSearchParam: { lastPage: false } })).toBe(true);
        expect(getters.tripsMorePage({ tripsSearchParam: { lastPage: true } })).toBe(false);
    });
});

describe('makePaginationActions', () => {
    const buildContext = () => ({
        trips: null,
        tripsSearchParam: { page: 1, pageSize: 20, lastPage: false, data: {} },
        tripsCurrentPage: 1
    });

    it('runs a first-page search, stores items and marks last page when reached', async () => {
        const requestGeneration = vi.fn().mockResolvedValue({
            data: [{ id: 1 }],
            current_page: 2,
            last_page: 2
        });
        const ctx = buildContext();
        const action = makePaginationActions('trips', requestGeneration).tripsSearch;

        await action.call(ctx, { page: '2', someFilter: 'x' });

        expect(requestGeneration).toHaveBeenCalledWith({
            store: ctx,
            data: { page: 2, page_size: 20, someFilter: 'x' }
        });
        expect(ctx.trips).toEqual([{ id: 1 }]);
        expect(ctx.tripsSearchParam.lastPage).toBe(true);
        expect(ctx.tripsSearchParam.page).toBe(2);
    });

    it('appends results on next-page searches', async () => {
        const requestGeneration = vi.fn().mockResolvedValue({
            data: [{ id: 2 }],
            meta: { pagination: { current_page: 2, total_pages: 3 } }
        });
        const ctx = buildContext();
        ctx.trips = [{ id: 1 }];
        ctx.tripsSearchParam.page = 1;
        const action = makePaginationActions('trips', requestGeneration).tripsSearch;

        await action.call(ctx, { next: true });

        expect(ctx.trips).toEqual([{ id: 1 }, { id: 2 }]);
        expect(ctx.tripsSearchParam.page).toBe(2);
        expect(ctx.tripsSearchParam.lastPage).toBe(false);
    });

    it('replaces the list on a fresh search', async () => {
        const requestGeneration = vi.fn().mockResolvedValue({
            data: [{ id: 1 }, { id: 3 }],
            meta: { current_page: 1, last_page: 1 }
        });
        const ctx = buildContext();
        ctx.trips = [{ id: 1 }, { id: 2 }];
        const action = makePaginationActions('trips', requestGeneration).tripsSearch;

        await action.call(ctx, {});

        expect(ctx.trips).toEqual([{ id: 1 }, { id: 3 }]);
        expect(ctx.tripsSearchParam.lastPage).toBe(true);
    });

    it('notifies the callback with the store and the pending request', () => {
        const requestGeneration = vi.fn().mockResolvedValue({ data: [] });
        const callback = vi.fn();
        const ctx = buildContext();
        const action = makePaginationActions('trips', requestGeneration, callback).tripsSearch;

        const promises = action.call(ctx, {});
        expect(callback).toHaveBeenCalledWith(ctx, promises);
    });
});
