import { describe, it, expect, vi } from 'vitest';
import {
    LOCALE_STORAGE_KEY,
    buildLocaleUpdateFormData,
    persistLocaleChoice,
    resolveInitialLocale,
    syncLocaleToBackend,
} from './userLocale.js';

describe('userLocale', () => {
    it('resolveInitialLocale prefers stored locale over profile and app defaults', () => {
        expect(
            resolveInitialLocale({
                storedLocale: 'en',
                userLocale: 'arg',
                appLocale: 'chl',
            })
        ).toBe('en');
    });

    it('resolveInitialLocale uses profile locale when nothing is stored locally', () => {
        expect(
            resolveInitialLocale({
                storedLocale: null,
                userLocale: 'en',
                appLocale: 'arg',
            })
        ).toBe('en');
    });

    it('resolveInitialLocale falls back to app locale when profile locale is missing', () => {
        expect(
            resolveInitialLocale({
                storedLocale: null,
                userLocale: null,
                appLocale: 'arg',
            })
        ).toBe('arg');
    });

    it('buildLocaleUpdateFormData includes locale for profile update', () => {
        const formData = buildLocaleUpdateFormData('en');

        expect(formData.get('locale')).toBe('en');
        expect(formData.get('_method')).toBe('PUT');
    });

    it('persistLocaleChoice stores locale in localStorage', () => {
        const storage = {};
        vi.stubGlobal('localStorage', {
            setItem: (key, value) => {
                storage[key] = value;
            },
            getItem: (key) => storage[key] ?? null,
        });

        persistLocaleChoice('en');

        expect(storage[LOCALE_STORAGE_KEY]).toBe('en');
        vi.unstubAllGlobals();
    });

    it('syncLocaleToBackend updates profile when user is logged in', async () => {
        const update = vi.fn().mockResolvedValue({ data: {} });
        const userApi = { update };

        await syncLocaleToBackend(userApi, 'en', true);

        expect(update).toHaveBeenCalledTimes(1);
        expect(update.mock.calls[0][0].get('locale')).toBe('en');
    });

    it('syncLocaleToBackend skips API call when user is logged out', async () => {
        const update = vi.fn();
        const userApi = { update };

        await syncLocaleToBackend(userApi, 'en', false);

        expect(update).not.toHaveBeenCalled();
    });
});
