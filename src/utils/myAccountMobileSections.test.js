import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
    getMyAccountMobileSections,
    MOBILE_DELETE_ACCOUNT_ROUTE
} from './myAccountMobileSections';

describe('getMyAccountMobileSections', () => {
    it('groups items into perfil, configuracion and ayuda sections', () => {
        const sections = getMyAccountMobileSections({}, 'arg');
        expect(sections.map((s) => s.id)).toEqual([
            'perfil',
            'configuracion',
            'ayuda'
        ]);
    });

    it('lists perfil items in the design order, hiding ratings for now', () => {
        const [perfil] = getMyAccountMobileSections({}, 'arg');
        expect(perfil.items.map((i) => i.id)).toEqual([
            'edit-profile',
            'friends',
            'cars'
        ]);
        expect(perfil.items.map((i) => i.id)).not.toContain('ratings');
    });

    it('keeps ratings and privacy defined but hidden in the source', () => {
        const source = fs.readFileSync(
            path.resolve(__dirname, 'myAccountMobileSections.js'),
            'utf8'
        );
        expect(source).toMatch(/id:\s*'ratings'[\s\S]*?hidden:\s*true/);
        expect(source).toMatch(/id:\s*'privacy'[\s\S]*?hidden:\s*true/);
    });

    it('adds identity validation to perfil only when enabled', () => {
        const without = getMyAccountMobileSections({}, 'arg')[0].items;
        expect(without.map((i) => i.id)).not.toContain('identity-validation');

        const withValidation = getMyAccountMobileSections(
            {
                identity_validation_enabled: true,
                identity_validation_mercado_pago_enabled: true
            },
            'arg'
        )[0].items;
        expect(withValidation.map((i) => i.id)).toContain('identity-validation');
    });

    it('lists configuracion items with a locale switcher, hiding privacy for now', () => {
        const configuracion = getMyAccountMobileSections({}, 'arg')[1];
        expect(configuracion.items.map((i) => i.id)).toEqual([
            'notifications',
            'password',
            'language'
        ]);
        expect(configuracion.items.map((i) => i.id)).not.toContain('privacy');
        const language = configuracion.items.find((i) => i.id === 'language');
        expect(language.localeSwitcher).toBe(true);
        expect(language.placeholder).toBeUndefined();
        expect(language.value).toBeUndefined();
    });

    it('lists ayuda items linking to faq, support, about and legal', () => {
        const ayuda = getMyAccountMobileSections({}, 'arg')[2];
        expect(ayuda.items.map((i) => i.id)).toEqual([
            'faq',
            'support',
            'about',
            'legal'
        ]);
        expect(ayuda.items[0].href).toMatch(/^https:\/\/carpoolear\.com\.ar/);
        expect(ayuda.items[1].route).toEqual({ name: 'tickets' });
    });

    it('excludes delete account from the navigation sections', () => {
        const sections = getMyAccountMobileSections({}, 'arg');
        const ids = sections.flatMap((s) => s.items.map((i) => i.id));
        expect(ids).not.toContain('delete-account');
    });

    it('exposes the delete account route for the separate action', () => {
        expect(MOBILE_DELETE_ACCOUNT_ROUTE).toEqual({
            name: 'profile_update',
            query: { action: 'delete-account' }
        });
    });
});
