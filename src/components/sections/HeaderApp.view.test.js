import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'HeaderApp.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('HeaderApp mesa de ayuda link', () => {
    it('includes soporte i18n with router-link to tickets for desktop and mobile dropdowns', () => {
        expect(viewSource).toContain("$t('soporte')");
        const ticketRouteMatches = viewSource.match(/name:\s*'tickets'/g);
        expect(ticketRouteMatches).not.toBeNull();
        expect(ticketRouteMatches.length).toBeGreaterThanOrEqual(2);
    });
});
