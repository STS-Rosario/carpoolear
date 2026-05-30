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
    adminSetType: vi.fn(),
    adminSetInternalNote: vi.fn(),
    adminCreate: vi.fn()
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

    it('fetchAdminList passes filter params to adminList API', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminList.mockResolvedValue({ data: [{ id: 3 }] });

        const store = useTicketsStore();
        await store.fetchAdminList({
            type: 'contact',
            priority: 'high',
            needsReply: true
        });

        expect(apiMock.adminList).toHaveBeenCalledWith({
            type: 'contact',
            priority: 'high',
            needs_reply: '1'
        });
    });

    it('sets adminList to empty array on admin list error', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminList.mockRejectedValue(new Error('network error'));

        const store = useTicketsStore();
        await expect(store.fetchAdminList()).rejects.toThrow('network error');
        expect(store.adminList).toEqual([]);
    });

    it('creates support ticket from admin and returns payload data', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminCreate.mockResolvedValue({ data: { id: 88, user_id: 45, type: 'account_verification' } });

        const store = useTicketsStore();
        const created = await store.adminCreateTicket({
            user_id: 45,
            type: 'account_verification',
            subject: 'Verificacion',
            message_markdown: 'Mensaje'
        });

        expect(created).toEqual({ id: 88, user_id: 45, type: 'account_verification' });
        expect(apiMock.adminCreate).toHaveBeenCalledTimes(1);
    });

    it('createTicket unwraps Laravel data envelope so router receives ticket id', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.create.mockResolvedValue({ data: { id: 42, subject: 'Same subject', type: 'contact' } });

        const store = useTicketsStore();
        const ticket = await store.createTicket({
            type: 'contact',
            subject: 'Same subject',
            message_markdown: 'Same body'
        });

        expect(ticket.id).toBe(42);
        expect(apiMock.create).toHaveBeenCalledTimes(1);
    });

    it('adminSetType delegates to API and returns ticket data', async () => {
        const { useTicketsStore } = await import('./tickets');
        apiMock.adminSetType.mockResolvedValue({ data: { id: 5, type: 'bug_report' } });

        const store = useTicketsStore();
        const updated = await store.adminSetType(5, 'bug_report');

        expect(updated).toEqual({ id: 5, type: 'bug_report' });
        expect(apiMock.adminSetType).toHaveBeenCalledWith(5, 'bug_report');
    });
});
