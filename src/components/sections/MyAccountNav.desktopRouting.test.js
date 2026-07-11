import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const dropdownPath = path.resolve(__dirname, 'HeaderMenuDropdown.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');
const ticketsPath = path.resolve(__dirname, '../views/Tickets.vue');
const aboutPath = path.resolve(__dirname, '../views/About.vue');
const termsPath = path.resolve(__dirname, '../views/TermsAndConditions.vue');
const dropdownSource = fs.readFileSync(dropdownPath, 'utf8');
const routesSource = fs.readFileSync(routesPath, 'utf8');
const ticketsSource = fs.readFileSync(ticketsPath, 'utf8');
const aboutSource = fs.readFileSync(aboutPath, 'utf8');
const termsSource = fs.readFileSync(termsPath, 'utf8');

describe('desktop Mi cuenta entry points', () => {
    it('routes Mi cuenta in the header dropdown to Editar perfil', () => {
        expect(dropdownSource).toContain('DESKTOP_DEFAULT_ACCOUNT_ROUTE');
        expect(dropdownSource).toMatch(
            /\$t\('miCuenta'\)[\s\S]*DESKTOP_DEFAULT_ACCOUNT_ROUTE/
        );
        expect(dropdownSource).not.toMatch(
            /\$t\('miCuenta'\)[\s\S]*name:\s*'my-account'/
        );
    });

    it('redirects /mi-cuenta to profile update on desktop', () => {
        expect(routesSource).toContain('redirectMyAccountOnDesktop');
        expect(routesSource).toMatch(
            /my-account[\s\S]*beforeEnter[\s\S]*redirectMyAccountOnDesktop/
        );
    });
});

describe('desktop help pages with account sidebar', () => {
    it('wraps tickets, about and terms with the account settings layout', () => {
        expect(ticketsSource).toContain('AccountSettingsLayout');
        expect(aboutSource).toContain('AccountSettingsLayout');
        expect(termsSource).toContain('AccountSettingsLayout');
    });
});
