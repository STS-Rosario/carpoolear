import { describe, expect, it, vi } from 'vitest';
import {
    CUSTOM_SPLASH_DISMISS_MS,
    getRemainingSplashMs,
    hideBootstrapSplash,
    initBootstrapSplash,
    isAdminAppUrl,
    isCustomSplashVisible
} from './customSplash.js';

describe('isAdminAppUrl', () => {
    it('detects admin routes in history and hash mode', () => {
        expect(isAdminAppUrl({ path: '/admin' })).toBe(true);
        expect(isAdminAppUrl({ path: '/admin/users' })).toBe(true);
        expect(isAdminAppUrl({ pathname: '/app/admin/trips' })).toBe(true);
        expect(isAdminAppUrl({ hash: '#/admin/users' })).toBe(true);
        expect(isAdminAppUrl({ fullPath: '/admin/support-tickets/new' })).toBe(true);
    });

    it('does not treat public routes as admin', () => {
        expect(isAdminAppUrl({ path: '/trips' })).toBe(false);
        expect(isAdminAppUrl({ path: '/trips', fullPath: '/trips?clearSearch=true' })).toBe(false);
        expect(isAdminAppUrl({ pathname: '/trips', search: '?clearSearch=true' })).toBe(false);
        expect(isAdminAppUrl({ path: '/login' })).toBe(false);
        expect(isAdminAppUrl({ hash: '#/trips' })).toBe(false);
        expect(isAdminAppUrl(null)).toBe(false);
    });
});

describe('isCustomSplashVisible', () => {
    it('shows splash on public routes including trips with query params', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: true
            })
        ).toBe(true);
        expect(
            isCustomSplashVisible({
                location: { path: '/trips', fullPath: '/trips?clearSearch=true' },
                showCustomSplash: true
            })
        ).toBe(true);
    });

    it('still shows splash for admin users outside admin routes', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: true
            })
        ).toBe(true);
    });

    it('hides splash on admin routes', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/admin/users' },
                showCustomSplash: true
            })
        ).toBe(false);
    });

    it('hides splash after dismiss timer clears showCustomSplash', () => {
        expect(
            isCustomSplashVisible({
                location: { path: '/trips' },
                showCustomSplash: false
            })
        ).toBe(false);
    });
});

describe('getRemainingSplashMs', () => {
    it('counts down from page load so public users keep the full splash window', () => {
        expect(getRemainingSplashMs(2500, 0)).toBe(500);
        expect(getRemainingSplashMs(4000, 0)).toBe(0);
        expect(getRemainingSplashMs(1000, 500)).toBe(2500);
    });

    it('returns zero when splash was skipped', () => {
        expect(getRemainingSplashMs(1000, null)).toBe(0);
    });
});

describe('hideBootstrapSplash', () => {
    it('removes the bootstrap splash element', () => {
        const bootstrapSplash = { remove: vi.fn() };
        const doc = {
            getElementById: vi.fn(() => bootstrapSplash)
        };

        hideBootstrapSplash(doc);

        expect(doc.getElementById).toHaveBeenCalledWith('bootstrap-splash');
        expect(bootstrapSplash.remove).toHaveBeenCalled();
    });
});

describe('initBootstrapSplash', () => {
    it('shows bootstrap splash immediately for public routes', () => {
        const startedAtValues = [];
        const timeouts = [];

        const result = initBootstrapSplash({
            location: { pathname: '/trips', hash: '' },
            doc: { getElementById: () => null },
            now: 100,
            setStartedAt: (value) => startedAtValues.push(value),
            scheduleTimeout: (fn, delay) => {
                timeouts.push({ fn, delay });
                return delay;
            }
        });

        expect(result.skipped).toBe(false);
        expect(startedAtValues).toEqual([100]);
        expect(timeouts).toEqual([
            expect.objectContaining({ delay: CUSTOM_SPLASH_DISMISS_MS })
        ]);
    });

    it('skips bootstrap splash for admin URLs', () => {
        const bootstrapSplash = { remove: vi.fn() };
        const startedAtValues = [];

        const result = initBootstrapSplash({
            location: { pathname: '/admin/users', hash: '' },
            doc: {
                getElementById: () => bootstrapSplash
            },
            now: 100,
            setStartedAt: (value) => startedAtValues.push(value),
            scheduleTimeout: vi.fn()
        });

        expect(result.skipped).toBe(true);
        expect(bootstrapSplash.remove).toHaveBeenCalled();
        expect(startedAtValues).toEqual([null]);
    });

    it('skips bootstrap splash for hash-mode admin URLs', () => {
        const bootstrapSplash = { remove: vi.fn() };

        const result = initBootstrapSplash({
            location: { pathname: '/', hash: '#/admin/users' },
            doc: { getElementById: () => bootstrapSplash },
            now: 100,
            setStartedAt: () => {},
            scheduleTimeout: vi.fn()
        });

        expect(result.skipped).toBe(true);
        expect(bootstrapSplash.remove).toHaveBeenCalled();
    });
});

describe('CUSTOM_SPLASH_DISMISS_MS', () => {
    it('keeps the public splash visible for three seconds', () => {
        expect(CUSTOM_SPLASH_DISMISS_MS).toBe(3000);
    });
});
