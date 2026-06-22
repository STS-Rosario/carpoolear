import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const stopThreadsMock = vi.fn();
const threadRunMock = vi.fn();

vi.mock('../classes/Threads', () => ({
    stopThreads: (...args) => stopThreadsMock(...args),
    Thread: class ThreadMock {
        constructor(fn, tags) {
            this.fn = fn;
            this.tags = tags;
        }

        run(interval, runFirst) {
            threadRunMock(interval, runFirst);
        }
    }
}));

vi.mock('./auth', () => ({
    useAuthStore: vi.fn()
}));

vi.mock('./notifications', () => ({
    useNotificationsStore: vi.fn()
}));

describe('root store startThread', () => {
    beforeEach(async () => {
        vi.unstubAllGlobals();
        setActivePinia(createPinia());
        stopThreadsMock.mockClear();
        threadRunMock.mockClear();

        const { useAuthStore } = await import('./auth');
        const { useNotificationsStore } = await import('./notifications');

        useAuthStore.mockReturnValue({
            appConfig: { web_push_notification: false }
        });
        vi.stubGlobal('window', { Notification: { permission: 'default' } });
        useNotificationsStore.mockReturnValue({
            countAction: vi.fn()
        });
    });

    it('stops existing notification threads before starting polling', async () => {
        const { useNotificationsStore } = await import('./notifications');
        const notificationsStore = useNotificationsStore();
        const { useRootStore } = await import('./root');
        const rootStore = useRootStore();

        await rootStore.startThread();

        expect(stopThreadsMock).toHaveBeenCalledWith('NOTIFICATIONS');
        expect(notificationsStore.countAction).toHaveBeenCalledTimes(1);
        expect(threadRunMock).toHaveBeenCalledWith(30000, false);
    });

    it('fetches notification count once when web push is already granted', async () => {
        vi.stubGlobal('window', { Notification: { permission: 'granted' } });

        const { useAuthStore } = await import('./auth');
        useAuthStore.mockReturnValue({
            appConfig: { web_push_notification: true }
        });

        const { useNotificationsStore } = await import('./notifications');
        const notificationsStore = useNotificationsStore();
        const { useRootStore } = await import('./root');
        const rootStore = useRootStore();

        await rootStore.startThread();

        expect(stopThreadsMock).toHaveBeenCalledWith('NOTIFICATIONS');
        expect(notificationsStore.countAction).toHaveBeenCalledTimes(1);
        expect(threadRunMock).not.toHaveBeenCalled();
    });
});
