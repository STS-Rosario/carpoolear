import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
    getMyAccountDesktopExpandedSection,
    getMyAccountDesktopSections,
    isMyAccountDesktopItemActive
} from './myAccountDesktopSections';

describe('getMyAccountDesktopSections', () => {
    it('groups items into perfil, configuracion and ayuda sections', () => {
        const sections = getMyAccountDesktopSections({}, 'arg');
        expect(sections.map((s) => s.id)).toEqual([
            'perfil',
            'configuracion',
            'ayuda'
        ]);
    });

    it('hides resumen, calificaciones and privacidad but keeps them in source', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, 'myAccountDesktopSections.js'),
            'utf8'
        );
        expect(source).toMatch(/id:\s*'resumen'[\s\S]*?hidden:\s*true/);
        expect(source).toMatch(/id:\s*'ratings'[\s\S]*?hidden:\s*true/);
        expect(source).toMatch(/id:\s*'privacy'[\s\S]*?hidden:\s*true/);

        const visibleIds = getMyAccountDesktopSections({}, 'arg').flatMap((s) =>
            s.items.map((i) => i.id)
        );
        expect(visibleIds).not.toContain('resumen');
        expect(visibleIds).not.toContain('ratings');
        expect(visibleIds).not.toContain('privacy');
    });

    it('lists visible perfil items with Editar perfil as the default profile route', () => {
        const perfil = getMyAccountDesktopSections({}, 'arg')[0];
        expect(perfil.items.map((i) => i.id)).toEqual([
            'edit-profile',
            'friends',
            'cars'
        ]);
        const editProfile = perfil.items.find((i) => i.id === 'edit-profile');
        expect(editProfile.labelKey).toBe('editarPerfil');
        expect(editProfile.route).toEqual({ name: 'profile_update' });
    });

    it('shows idioma with the current locale label in configuracion', () => {
        const configuracion = getMyAccountDesktopSections({}, 'arg')[1];
        const language = configuracion.items.find((i) => i.id === 'language');
        expect(language.localeSwitcher).toBe(true);
        expect(language.value).toBeUndefined();
    });
});

describe('getMyAccountDesktopExpandedSection', () => {
    it('expands perfil for profile settings routes', () => {
        expect(getMyAccountDesktopExpandedSection('profile_update')).toBe(
            'perfil'
        );
        expect(getMyAccountDesktopExpandedSection('friends_setting')).toBe(
            'perfil'
        );
        expect(getMyAccountDesktopExpandedSection('profile_cars')).toBe(
            'perfil'
        );
    });

    it('expands ayuda for support and legal routes', () => {
        expect(getMyAccountDesktopExpandedSection('tickets')).toBe('ayuda');
        expect(getMyAccountDesktopExpandedSection('acerca_de')).toBe('ayuda');
        expect(getMyAccountDesktopExpandedSection('terms')).toBe('ayuda');
    });
});

describe('isMyAccountDesktopItemActive', () => {
    it('highlights edit profile on profile_update by default', () => {
        const sections = getMyAccountDesktopSections({}, 'arg');
        const editProfile = sections[0].items.find((i) => i.id === 'edit-profile');
        expect(isMyAccountDesktopItemActive(editProfile, 'profile_update')).toBe(
            true
        );
    });

    it('highlights support on tickets routes', () => {
        const sections = getMyAccountDesktopSections({}, 'arg');
        const support = sections[2].items.find((i) => i.id === 'support');
        expect(isMyAccountDesktopItemActive(support, 'tickets')).toBe(true);
        expect(isMyAccountDesktopItemActive(support, 'ticket-detail')).toBe(true);
    });
});
