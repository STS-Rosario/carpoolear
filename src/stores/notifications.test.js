import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const countMock = vi.fn();

vi.mock('../services/api', () => ({
    NotificationApi: class NotificationApiMock {
        count = countMock;
    }
}));

describe('notifications store countAction', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        countMock.mockReset();
    });

    it('deduplicates concurrent count requests into a single API call', async () => {
        let resolveCount;
        countMock.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveCount = () => resolve({ data: 3 });
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
    });
});
