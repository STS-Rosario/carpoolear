import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const apiMock = {
    list: vi.fn(),
    show: vi.fn(),
    create: vi.fn(),
    reply: vi.fn(),
    close: vi.fn(),
    adminList: vi.fn(),
    adminShow: vi.fn(),
    adminReply: vi.fn(),
    adminResolve: vi.fn(),
    adminClose: vi.fn(),
    adminReopen: vi.fn(),
    adminSetPriority: vi.fn(),
    adminSetInternalNote: vi.fn()
};

vi.mock('../services/api', () => ({
    TicketsApi: class TicketsApiMock {
        constructor() {
            return apiMock;
        }
    }
}));

describe('tickets store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        Object.values(apiMock).forEach((fn) => fn.mockReset());
    });

    it('stores admin list response array', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminList.mockResolvedValue({ data: [{ id: 10 }] });

        const store = useTicketsStore();
        const list = await store.fetchAdminList();

        expect(list).toEqual([{ id: 10 }]);
        expect(store.adminList).toEqual([{ id: 10 }]);
    });

    it('sets adminList to empty array on admin list error', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminList.mockRejectedValue(new Error('network error'));

        const store = useTicketsStore();
        await expect(store.fetchAdminList()).rejects.toThrow('network error');
        expect(store.adminList).toEqual([]);
    });
});
