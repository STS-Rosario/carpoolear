import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useServerStatusStore } from './serverStatus.js';

vi.mock('../services/api/HealthApi', () => ({
    default: class {
        async check() {}
    }
}));

vi.mock('./cordova', () => ({
    useCordovaStore: () => ({ networkReady: true, networkState: true })
}));

describe('useServerStatusStore', () => {
    let store;

    beforeEach(() => {
        vi.useFakeTimers();
        setActivePinia(createPinia());
        store = useServerStatusStore();
    });

    afterEach(() => {
        store.stopRetryPolling();
        store.stopHealthMonitoring();
        vi.useRealTimers();
    });

    it('marks the server unavailable and starts retry polling once', () => {
        store.markServerUnavailable();

        expect(store.serverUnavailable).toBe(true);
        expect(store._retryTimerId).not.toBeNull();

        const firstTimer = store._retryTimerId;
        store.markServerUnavailable();
        expect(store._retryTimerId).toBe(firstTimer);
    });

    it('clears the unavailable state and stops polling', () => {
        store.markServerUnavailable();
        store.clearServerUnavailable();

        expect(store.serverUnavailable).toBe(false);
        expect(store._retryTimerId).toBeNull();
    });

    it('starts and stops health monitoring', () => {
        store.startHealthMonitoring();
        expect(store._monitorTimerId).not.toBeNull();

        store.stopHealthMonitoring();
        expect(store._monitorTimerId).toBeNull();
    });

    it('does not double-start health monitoring', () => {
        store.startHealthMonitoring();
        const firstMonitor = store._monitorTimerId;

        store.startHealthMonitoring();
        expect(store._monitorTimerId).toBe(firstMonitor);
    });

    it('short-circuits tryRecover while a check is in flight', async () => {
        store.checking = true;

        await expect(store.tryRecover()).resolves.toBeUndefined();
        expect(store.checking).toBe(true);
    });
});
