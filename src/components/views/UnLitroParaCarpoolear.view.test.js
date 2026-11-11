import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UnLitroParaCarpoolear.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');

describe('UnLitroParaCarpoolear page wiring', () => {
    it('registers an in-app route that loads the Vue page (not StaticHtmlPage)', () => {
        const routesSource = fs.readFileSync(routesPath, 'utf8');
        expect(routesSource).toContain("path: '/un-litro-para-carpoolear'");
        expect(routesSource).toContain("name: 'un_litro_para_carpoolear'");
        expect(routesSource).toContain('UnLitroParaCarpoolear');
        expect(routesSource).not.toMatch(
            /path:\s*'\/un-litro-para-carpoolear'[\s\S]*?pageSlug:\s*'un-litro-para-carpoolear'/
        );
    });

    it('wraps content with AccountSettingsLayout and the page title key', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain('unLitroParaCarpoolear');
    });

    it('renders the informational sections from the Un litro mockup', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('¿Qué es 1 litro para Carpoolear?');
        expect(viewSource).toContain('Así funciona');
        expect(viewSource).toContain('Un peaje más, para la comunidad');
        expect(viewSource).toContain(
            'Se divide entre todas las personas que viajan'
        );
        expect(viewSource).toContain('Tus 2 primeros viajes son sin cargo');
        expect(viewSource).toContain('1/4 L');
        expect(viewSource).toContain(
            'Si nadie se sube a tu viaje, se aplica para el siguiente'
        );
    });
});
