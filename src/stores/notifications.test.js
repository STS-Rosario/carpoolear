import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const countMock = vi.fn();
const indexMock = vi.fn();

vi.mock('../services/api', () => ({
    NotificationApi: class NotificationApiMock {
        count = countMock;
        index = indexMock;
    }
}));

describe('notifications store countAction', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        countMock.mockReset();
        indexMock.mockReset();
    });

    it('deduplicates concurrent count requests into a single API call', async () => {
        let resolveCount;
        countMock.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveCount = () =>
                        resolve({
                            data: {
                                notifications: 3,
                                messages: 2,
                                my_trips: 1
                            }
                        });
                })
        );

        const { useNotificationsStore } = await import('./notifications');
        const store = useNotificationsStore();

        const first = store.countAction();
        const second = store.countAction();

        expect(countMock).toHaveBeenCalledTimes(1);

        resolveCount();
        await Promise.all([first, second]);

        expect(store.count).toBe(3);
        expect(store.messagesCount).toBe(2);
        expect(store.myTripsCount).toBe(1);
    });
});

describe('notifications store indexAction', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        countMock.mockReset();
        indexMock.mockReset();
        indexMock.mockResolvedValue({ data: [] });
    });

    it('clears the badge count immediately when loading with mark true', async () => {
        const { useNotificationsStore } = await import('./notifications');
        const store = useNotificationsStore();
        store.count = 4;

        const promise = store.indexAction({ mark: true, page: 1, page_size: 25 });

        expect(store.count).toBe(0);

        await promise;
        expect(store.count).toBe(0);
    });

    it('does not clear the badge count when mark is not set', async () => {
        const { useNotificationsStore } = await import('./notifications');
        const store = useNotificationsStore();
        store.count = 4;
        store.messagesCount = 2;
        store.myTripsCount = 1;

        await store.indexAction({ page: 1, page_size: 25 });

        expect(store.count).toBe(4);
        expect(store.messagesCount).toBe(2);
        expect(store.myTripsCount).toBe(1);
    });

    it('stores navigation badge counts from the count endpoint payload', async () => {
        countMock.mockResolvedValue({
            data: {
                notifications: 5,
                messages: 2,
                my_trips: 3
            }
        });

        const { useNotificationsStore } = await import('./notifications');
        const store = useNotificationsStore();

        await store.countAction();

        expect(store.count).toBe(5);
        expect(store.messagesCount).toBe(2);
        expect(store.myTripsCount).toBe(3);
    });
});
