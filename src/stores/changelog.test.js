import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const apiMock = {
    fetchForVersion: vi.fn(),
    adminList: vi.fn(),
    adminShow: vi.fn(),
    adminCreate: vi.fn(),
    adminUpdate: vi.fn(),
    adminDelete: vi.fn()
};

vi.mock('../services/api', () => ({
    ChangelogApi: class ChangelogApiMock {
        constructor() {
            return apiMock;
        }
    }
}));

describe('changelog store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        Object.values(apiMock).forEach((fn) => fn.mockReset());
    });

    it('loads changelog for the current app version', async () => {
        const { useChangelogStore } = await import('./changelog');
        apiMock.fetchForVersion.mockResolvedValue({
            data: { id: 1, version: '3.2.3', body_markdown: '## Cambios' }
        });

        const store = useChangelogStore();
        const entry = await store.fetchForVersion('3.2.3');

        expect(entry).toEqual({ id: 1, version: '3.2.3', body_markdown: '## Cambios' });
        expect(store.currentEntry).toEqual(entry);
    });

    it('probes the current version only once', async () => {
        const { useChangelogStore } = await import('./changelog');
        apiMock.fetchForVersion.mockResolvedValue({
            data: { id: 1, version: '3.2.3', body_markdown: '## Cambios' }
        });

        const store = useChangelogStore();
        await store.probeForVersion('3.2.3');
        await store.probeForVersion('3.2.3');

        expect(apiMock.fetchForVersion).toHaveBeenCalledTimes(1);
        expect(store.probedVersion).toBe('3.2.3');
    });

    it('loads admin changelog list into state', async () => {
        const { useChangelogStore } = await import('./changelog');
        apiMock.adminList.mockResolvedValue({ data: [{ id: 2, version: '1.0.0' }] });

        const store = useChangelogStore();
        const list = await store.fetchAdminList();

        expect(list).toEqual([{ id: 2, version: '1.0.0' }]);
        expect(store.adminList).toEqual([{ id: 2, version: '1.0.0' }]);
    });
});
