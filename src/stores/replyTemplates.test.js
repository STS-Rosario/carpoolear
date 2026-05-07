import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const apiMock = {
    adminReplyTemplateList: vi.fn(),
    adminReplyTemplateShow: vi.fn(),
    adminReplyTemplateCreate: vi.fn(),
    adminReplyTemplateUpdate: vi.fn(),
    adminReplyTemplateDelete: vi.fn(),
    adminReplyTemplateDuplicate: vi.fn()
};

vi.mock('../services/api', () => ({
    TicketsApi: class TicketsApiMock {
        constructor() {
            return apiMock;
        }
    }
}));

describe('replyTemplates store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        Object.values(apiMock).forEach((fn) => fn.mockReset());
    });

    it('loads admin template list into state', async () => {
        const { useReplyTemplatesStore } = await import('./replyTemplates');
        apiMock.adminReplyTemplateList.mockResolvedValue({ data: [{ id: 1, name: 'A' }] });

        const store = useReplyTemplatesStore();
        const list = await store.fetchAdminList();

        expect(list).toEqual([{ id: 1, name: 'A' }]);
        expect(store.adminList).toEqual([{ id: 1, name: 'A' }]);
    });

    it('returns single template from show', async () => {
        const { useReplyTemplatesStore } = await import('./replyTemplates');
        apiMock.adminReplyTemplateShow.mockResolvedValue({ data: { id: 2, name: 'B' } });

        const store = useReplyTemplatesStore();
        const row = await store.fetchAdminOne(2);

        expect(row).toEqual({ id: 2, name: 'B' });
    });
});
