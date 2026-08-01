import { describe, expect, it } from 'vitest';
import {
    PROFILE_DEFAULT_TAB,
    PROFILE_TAB_INDEX,
    buildProfileTabRoute,
    resolveProfileTabIndex
} from './profileDeepLinks.js';

describe('profileDeepLinks', () => {
    it('maps named tabs to Viajes / Perfil / Calificaciones indices', () => {
        expect(PROFILE_TAB_INDEX).toEqual({
            viajes: 0,
            perfil: 1,
            calificaciones: 2
        });
        expect(PROFILE_DEFAULT_TAB).toBe('perfil');
        expect(PROFILE_TAB_INDEX[PROFILE_DEFAULT_TAB]).toBe(1);
    });

    it('builds a profile route with the tab query', () => {
        expect(buildProfileTabRoute({ id: 'me', tab: 'perfil' })).toEqual({
            name: 'profile',
            params: { id: 'me' },
            query: { tab: 'perfil' }
        });
        expect(buildProfileTabRoute({ id: 42, tab: 'viajes' })).toEqual({
            name: 'profile',
            params: { id: 42 },
            query: { tab: 'viajes' }
        });
        expect(buildProfileTabRoute({ id: 'me' }).query.tab).toBe('perfil');
    });

    it('resolves query tab names first, then legacy activeTab/hash, else Perfil', () => {
        expect(
            resolveProfileTabIndex({ query: { tab: 'calificaciones' } })
        ).toBe(2);
        expect(resolveProfileTabIndex({ query: { tab: 'viajes' } })).toBe(0);
        expect(resolveProfileTabIndex({ activeTab: 2 })).toBe(2);
        expect(resolveProfileTabIndex({ activeTab: '0' })).toBe(0);
        expect(resolveProfileTabIndex({ hash: '#2' })).toBe(2);
        expect(resolveProfileTabIndex({})).toBe(1);
        expect(resolveProfileTabIndex({ query: { tab: 'nope' } })).toBe(1);
    });
});
